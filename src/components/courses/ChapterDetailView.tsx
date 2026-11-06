import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Chapter, Subject, Course } from '../../types/index.ts';
import { OfficialNotesViewer } from '../notes/OfficialNotesViewer.tsx';
import { QuizPlayer } from '../quiz/QuizPlayer.tsx';
import { PersonalNotesEditor } from '../notes/PersonalNotesEditor.tsx';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Sparkles,
  ArrowLeft,
  Bookmark,
  Share2,
  Lock,
} from 'lucide-react';

interface ChapterDetailViewProps {
  chapterId: string;
  onBack: () => void;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({ chapterId, onBack }) => {
  const { t, language } = useLanguage();
  const { user, plan, openUpgradeModal } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'theory' | 'quiz' | 'notes' | 'summary'>('theory');
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChapterInfo() {
      setLoading(true);
      try {
        const res = await fetch(`/api/chapters/${chapterId}`);
        if (res.ok) {
          const data = await res.json();
          setChapter(data.chapter);
          setSubject(data.subject);
          setCourse(data.course);
        }
      } catch (err) {
        console.error('Failed to load chapter:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChapterInfo();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        {t.common.loading}
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="p-8 text-center">
        <p className="text-xs text-slate-500">Chapter not found.</p>
        <button
          onClick={onBack}
          className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const chapterTitle = language === 'hi' ? chapter.nameHi : chapter.nameEn;
  const subjectTitle = subject ? (language === 'hi' ? subject.nameHi : subject.nameEn) : '';
  const courseTitle = course ? (language === 'hi' ? course.nameHi : course.nameEn) : '';

  const isUnlocked = user?.isPaidMember || user?.role === 'super_admin' || chapter.isFreeDemo;

  if (!isUnlocked) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {language === 'hi' ? '🔒 प्रीमियम पेड बैच सामग्री' : '🔒 Premium Paid Batch Content'}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {chapterTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {language === 'hi'
              ? `यह अध्याय, अभ्यास क्विज एवं आधिकारिक थ्योरी नोट्स पेड बैच में शामिल हैं। मात्र ₹${plan?.price || 99} में संपूर्ण कोर्स अनलॉक करें!`
              : `This chapter, quiz practice, and official notes are part of our Paid Batch. Unlock all subjects and mock tests for just ₹${plan?.price || 99}!`}
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={openUpgradeModal}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? `मात्र ₹${plan?.price || 99} में तुरंत अनलॉक करें` : `Unlock for ₹${plan?.price || 99}`}</span>
          </button>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {language === 'hi' ? 'वापस जाएं' : 'Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'पाठ्यक्रम पर वापस' : 'Back to Syllabus'}</span>
        </button>

        {/* Clean unboxed metadata separator per §1.A */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:flex items-center gap-2">
          <span>{courseTitle}</span>
          <span>·</span>
          <span>{subjectTitle}</span>
          <span>·</span>
          <span>Chapter {chapter.chapterNumber}</span>
        </div>
      </div>

      {/* Chapter Title Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          {subjectTitle} · Chapter {chapter.chapterNumber}
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {chapterTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {language === 'hi' ? chapter.descriptionHi : chapter.descriptionEn}
        </p>

        {/* Segmented Tab Controls (§1.A functional buttons) */}
        <div className="pt-4 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'theory'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.chapterView.theoryTab}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.chapterView.quizTab}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'notes'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.chapterView.notesTab}</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'theory' && (
        <OfficialNotesViewer chapterId={chapter.id} />
      )}

      {activeSubTab === 'quiz' && (
        <QuizPlayer chapterId={chapter.id} chapterTitle={chapterTitle} onExit={() => setActiveSubTab('theory')} />
      )}

      {activeSubTab === 'notes' && (
        <PersonalNotesEditor defaultChapterId={chapter.id} defaultChapterTitle={chapterTitle} />
      )}
    </div>
  );
};
