import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { QuestionClient, QuestionAnswerVerification, QuizAttemptRecord } from '../../types/index.ts';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface QuizPlayerProps {
  chapterId?: string;
  chapterTitle?: string;
  isMockTest?: boolean;
  initialQuestions?: QuestionClient[];
  onFinish?: (result: QuizAttemptRecord) => void;
  onExit?: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  chapterId,
  chapterTitle,
  isMockTest = false,
  initialQuestions,
  onFinish,
  onExit,
}) => {
  const { t, language } = useLanguage();
  const { token, user } = useAuth();

  const [questions, setQuestions] = useState<QuestionClient[]>(initialQuestions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [qId: string]: number }>({});
  const [verifications, setVerifications] = useState<{ [qId: string]: QuestionAnswerVerification }>({});
  const [showExplanation, setShowExplanation] = useState<{ [qId: string]: boolean }>({});
  const [loading, setLoading] = useState(!initialQuestions || initialQuestions.length === 0);
  const [timeLeft, setTimeLeft] = useState<number>(isMockTest ? 20 * 60 : 15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttemptRecord | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<{ [qId: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  // Load questions if not provided
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(initialQuestions);
      setLoading(false);
      return;
    }

    async function loadQuizQuestions() {
      setLoading(true);
      try {
        const url = isMockTest ? '/api/quiz/mock-test' : `/api/quiz/questions/${chapterId}`;
        const res = await fetch(url);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadQuizQuestions();
  }, [chapterId, isMockTest, initialQuestions]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  const currentQ = questions[currentIndex];

  // Option selection & immediate server-side validation for practice mode
  const handleSelectOption = async (optionIdx: number) => {
    if (!currentQ || isSubmitted) return;
    if (verifications[currentQ.id]) return; // prevent re-answering once verified

    setSelectedOptions((prev) => ({ ...prev, [currentQ.id]: optionIdx }));

    // Verify on server
    try {
      const res = await fetch('/api/quiz/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQ.id, selectedOption: optionIdx }),
      });
      if (res.ok) {
        const verifiedData: QuestionAnswerVerification = await res.json();
        setVerifications((prev) => ({ ...prev, [currentQ.id]: verifiedData }));
      }
    } catch (err) {
      console.error('Error verifying answer:', err);
    }
  };

  const toggleBookmark = async (q: QuestionClient) => {
    const isSaved = bookmarkedQuestions[q.id];
    setBookmarkedQuestions((prev) => ({ ...prev, [q.id]: !isSaved }));

    if (!token) return;
    try {
      if (!isSaved) {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemType: 'question',
            itemId: q.id,
            title: language === 'hi' ? q.questionHi : q.questionEn,
            subtitle: `MCQ · ${q.difficulty}`,
            targetId: q.chapterId,
          }),
        });
      }
    } catch (e) {
      console.error('Bookmark error:', e);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitted || submitting) return;
    setSubmitting(true);

    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedOption: selectedOptions[q.id] !== undefined ? selectedOptions[q.id] : -1,
    }));

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          chapterId,
          testType: isMockTest ? 'mock_test' : 'chapter_practice',
          title: chapterTitle || (isMockTest ? 'Full-Length Mock Test' : 'Chapter Practice Test'),
          answers: answersPayload,
          timeTakenSeconds: (isMockTest ? 20 * 60 : 15 * 60) - timeLeft,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResult(data.result);
        setIsSubmitted(true);
        if (data.result.accuracy >= 70) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
        }
        if (onFinish) onFinish(data.result);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        {t.common.loading}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500">No questions found for this test.</p>
        {onExit && (
          <button
            onClick={onExit}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
          >
            {t.quiz.backToChapter}
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // QUIZ RESULT SCREEN
  // -------------------------------------------------------------
  if (isSubmitted && quizResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        {/* Scorecard Hero */}
        <div className="rounded-3xl bg-[#0B192C] text-white p-6 sm:p-8 border border-slate-800 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.quiz.testAnalysis}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {quizResult.accuracy >= 80 ? t.quiz.excellent : quizResult.accuracy >= 50 ? t.quiz.good : t.quiz.needsImprovement}
          </h2>

          <div className="flex items-center justify-center gap-2 text-4xl sm:text-5xl font-extrabold text-amber-400 tabular-nums">
            <span>{quizResult.score}</span>
            <span className="text-2xl text-slate-400">/ {quizResult.totalQuestions}</span>
          </div>

          <p className="text-xs text-slate-300">
            {language === 'hi'
              ? `आपने कुल ${quizResult.totalQuestions} में से ${quizResult.correctAnswers} प्रश्न सही हल किए।`
              : `You successfully answered ${quizResult.correctAnswers} out of ${quizResult.totalQuestions} questions.`}
          </p>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800 max-w-lg mx-auto text-xs">
            <div>
              <div className="text-slate-400">{t.quiz.accuracyRate}</div>
              <div className="font-bold text-amber-400 text-sm sm:text-base tabular-nums">{quizResult.accuracy}%</div>
            </div>
            <div>
              <div className="text-slate-400">{t.quiz.correctCount}</div>
              <div className="font-bold text-emerald-400 text-sm sm:text-base tabular-nums">{quizResult.correctAnswers}</div>
            </div>
            <div>
              <div className="text-slate-400">{t.quiz.incorrectCount}</div>
              <div className="font-bold text-red-400 text-sm sm:text-base tabular-nums">{quizResult.incorrectAnswers}</div>
            </div>
            <div>
              <div className="text-slate-400">{t.quiz.timeTaken}</div>
              <div className="font-bold text-slate-200 text-sm sm:text-base tabular-nums">{formatTimer(quizResult.timeTakenSeconds)}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedOptions({});
              setVerifications({});
              setCurrentIndex(0);
              setTimeLeft(isMockTest ? 20 * 60 : 15 * 60);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>{t.quiz.retryIncorrect}</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
            >
              {t.quiz.backToChapter}
            </button>
          )}
        </div>

        {/* Question-by-Question Review */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'hi' ? 'प्रश्नों की विस्तृत समीक्षा' : 'Detailed Question Review'}
          </h3>

          {questions.map((q, idx) => {
            const userAns = selectedOptions[q.id];
            const verified = verifications[q.id];
            const isCorrect = verified ? verified.isCorrect : false;
            const options = language === 'hi' ? q.optionsHi : q.optionsEn;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-2xs space-y-3 ${
                  userAns === undefined
                    ? 'border-slate-200 dark:border-slate-800'
                    : isCorrect
                    ? 'border-emerald-300 dark:border-emerald-900/50'
                    : 'border-red-300 dark:border-red-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Q{idx + 1}.
                  </span>
                  <div className="flex-1 text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? q.questionHi : q.questionEn}
                  </div>
                  {isCorrect ? (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : userAns !== undefined ? (
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold">Unattempted</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {options.map((opt, oIdx) => {
                    const isSelected = userAns === oIdx;
                    const isRightOption = verified && verified.correctOptionIndex === oIdx;

                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                    if (isRightOption) {
                      optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-bold line-through';
                    }

                    return (
                      <div key={oIdx} className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${optStyle}`}>
                        <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {verified && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                      {t.quiz.explanationTitle}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {language === 'hi' ? verified.explanationHi : verified.explanationEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE QUESTION SCREEN
  // -------------------------------------------------------------
  const verification = currentQ ? verifications[currentQ.id] : undefined;
  const currentSelected = currentQ ? selectedOptions[currentQ.id] : undefined;
  const options = currentQ ? (language === 'hi' ? currentQ.optionsHi : currentQ.optionsEn) : [];
  const questionText = currentQ ? (language === 'hi' ? currentQ.questionHi : currentQ.questionEn) : '';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Quiz Header Bar: Progress, Timer & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            {isMockTest ? t.quiz.mockTitle : t.quiz.practiceTitle}
          </span>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
            {t.quiz.questionNumber} {currentIndex + 1} {t.quiz.of} {questions.length}
          </div>
        </div>

        {/* Timer display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold tabular-nums">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          {currentQ && (
            <button
              onClick={() => toggleBookmark(currentQ)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition"
              title={t.quiz.bookmarkQuestion}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  bookmarkedQuestions[currentQ.id]
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-slate-400'
                }`}
              />
            </button>
          )}

          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            {submitting ? t.common.loading : t.quiz.submitTest}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="h-full bg-amber-500 transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {questionText}
          </h2>
          {currentQ && (
            <span className="text-[11px] font-semibold text-slate-400 tabular-nums shrink-0">
              {currentQ.difficulty}
            </span>
          )}
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-3">
          {options.map((opt, optIdx) => {
            const isSelected = currentSelected === optIdx;
            const isVerified = Boolean(verification);

            let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

            if (isVerified && verification) {
              if (verification.correctOptionIndex === optIdx) {
                // Correct answer in GREEN
                btnStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500 font-bold';
              } else if (isSelected && !verification.isCorrect) {
                // Incorrect selected in RED
                btnStyle = 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-300 ring-2 ring-red-500 font-bold';
              } else {
                btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 opacity-70';
              }
            } else if (isSelected) {
              btnStyle = 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-slate-900 dark:text-white ring-1 ring-amber-500';
            }

            return (
              <button
                key={optIdx}
                disabled={isVerified}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{opt}</span>
                </div>

                {isVerified && verification && verification.correctOptionIndex === optIdx && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isVerified && verification && isSelected && !verification.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Banner & Explanation button */}
        {verification && (
          <div className="pt-2 space-y-3 animate-in fade-in duration-200">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                verification.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-300'
              }`}
            >
              <span>{verification.isCorrect ? t.quiz.correctFeedback : t.quiz.incorrectFeedback}</span>
              <button
                type="button"
                onClick={() =>
                  setShowExplanation((prev) => ({
                    ...prev,
                    [currentQ.id]: !prev[currentQ.id],
                  }))
                }
                className="text-xs font-bold underline cursor-pointer ml-3 shrink-0"
              >
                {showExplanation[currentQ.id] ? t.quiz.hideExplanation : t.quiz.showExplanation}
              </button>
            </div>

            {/* Detailed Explanation Panel */}
            {showExplanation[currentQ.id] && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  {t.quiz.explanationTitle}:
                </span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-justify">
                  {language === 'hi' ? verification.explanationHi : verification.explanationEn}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons: Prev / Next */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.quiz.previous}</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-2xs"
            >
              <span>{t.quiz.next}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <span>{t.quiz.finishQuiz}</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>{t.quiz.questionPalette}</span>
          <span className="tabular-nums font-normal text-[11px]">
            {Object.keys(selectedOptions).length} / {questions.length} Attempted
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = selectedOptions[q.id] !== undefined;
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                  isCurrent
                    ? 'ring-2 ring-amber-500 bg-amber-500 text-slate-950 font-extrabold'
                    : isAnswered
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
