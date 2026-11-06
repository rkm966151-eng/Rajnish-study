import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { OfficialNote } from '../../types/index.ts';
import { printDocument } from '../../utils/pdfExport.ts';
import {
  FileText,
  Printer,
  Download,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface OfficialNotesViewerProps {
  chapterId: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const OfficialNotesViewer: React.FC<OfficialNotesViewerProps> = ({
  chapterId,
  onBookmark,
  isBookmarked,
}) => {
  const { t, language } = useLanguage();
  const [note, setNote] = useState<OfficialNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [readingProgress, setReadingProgress] = useState(40);

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);
      try {
        const res = await fetch(`/api/notes/official/${chapterId}`);
        const data = await res.json();
        setNote(data.note || null);
      } catch (err) {
        console.error('Failed to load official notes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        {t.common.loading}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        No official notes available for this chapter.
      </div>
    );
  }

  const content = language === 'hi' ? note.contentHi : note.contentEn;
  const title = language === 'hi' ? note.titleHi : note.titleEn;

  const handlePrint = () => {
    printDocument({
      title,
      subtitle: 'Rajnish Study Official Theory & Formulas',
      sections: [
        { heading: 'Overview', content: content.overview },
        {
          heading: 'Key Definitions',
          content: content.keyDefinitions
            .map((kd) => `• ${kd.term}: ${kd.definition}`)
            .join('\n\n'),
        },
        {
          heading: 'Important Exam Points',
          content: content.importantPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n'),
        },
        {
          heading: 'Formulas & Principles',
          content: content.formulas
            .map((f) => `[${f.name}]\nFormula: ${f.formula}\nDetails: ${f.explanation}`)
            .join('\n\n'),
        },
        {
          heading: 'Worked Examples',
          content: content.examples
            .map((ex) => `Question: ${ex.problem}\nSolution: ${ex.solution}`)
            .join('\n\n'),
        },
        { heading: 'Summary & Revision Tips', content: `${content.summary}\n\nRevision tips:\n${content.revisionTips.join('\n')}` },
      ],
      language,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>Rajnish Study Official Curriculum</span>
            <span>·</span>
            <span>Updated 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isBookmarked
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? t.chapterView.bookmarked : t.chapterView.bookmarkChapter}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.chapterView.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Main Theory Document Layout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 max-w-4xl mx-auto leading-relaxed">
        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'hi' ? '1. अध्याय परिचय एवं पृष्ठभूमि' : '1. Overview & Context'}</span>
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-justify">
            {content.overview}
          </p>
        </section>

        {/* Section 2: Key Definitions */}
        {content.keyDefinitions && content.keyDefinitions.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? '2. प्रमुख परिभाषाएं' : '2. Key Terminology & Definitions'}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.keyDefinitions.map((kd, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {kd.term}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    {kd.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Important Points for Exams */}
        {content.importantPoints && content.importantPoints.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>{language === 'hi' ? '3. परीक्षा उपयोगी महत्वपूर्ण बिंदु' : '3. Critical Exam Points'}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-disc list-inside">
              {content.importantPoints.map((pt, idx) => (
                <li key={idx} className="leading-relaxed">
                  {pt}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section 4: Formulas & Equations */}
        {content.formulas && content.formulas.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{language === 'hi' ? '4. सूत्र एवं अभिक्रियाएं' : '4. Essential Formulas & Equations'}</span>
            </h3>
            <div className="space-y-3">
              {content.formulas.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-1.5"
                >
                  <div className="text-[11px] font-semibold text-amber-400">{f.name}</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white tracking-wide py-1">
                    {f.formula}
                  </div>
                  <div className="text-xs text-slate-300">{f.explanation}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Worked Sample Examples */}
        {content.examples && content.examples.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'hi' ? '5. हल सहित मॉडल उदाहरण' : '5. Solved Examples & Case Studies'}</span>
            </h3>
            <div className="space-y-3">
              {content.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-amber-50/20 dark:bg-amber-950/10 space-y-2"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    <span className="text-amber-600 dark:text-amber-400 mr-1.5">Q:</span>
                    {ex.problem}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800 pt-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 mr-1.5">Sol:</span>
                    {ex.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Summary & Quick Revision */}
        <section className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'hi' ? 'त्वरित पुनरावलोकन सारांश' : 'Chapter Summary'}
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {content.summary}
          </p>
          {content.revisionTips && (
            <div className="pt-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
              Tip: {content.revisionTips.join(' ')}
            </div>
          )}
        </section>

        {/* Completion Action */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? t.courses.completed : t.courses.markComplete}</span>
          </button>

          <span className="text-xs text-slate-400">
            {isCompleted ? '100% Completed' : `${readingProgress}% read`}
          </span>
        </div>
      </div>
    </div>
  );
};
