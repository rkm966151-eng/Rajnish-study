import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Course, Subject, Chapter } from '../../types/index.ts';
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
  Search,
  Filter,
  Lock,
  Unlock,
} from 'lucide-react';

interface CourseExplorerProps {
  initialCategory?: 'school_college' | 'competitive_exam';
  onSelectChapter: (chapterId: string) => void;
}

export const CourseExplorer: React.FC<CourseExplorerProps> = ({ initialCategory, onSelectChapter }) => {
  const { t, language } = useLanguage();
  const { user, plan, openUpgradeModal } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'school_college' | 'competitive_exam'>(
    initialCategory || 'all'
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const url =
          selectedCategory === 'all' ? '/api/courses' : `/api/courses?category=${selectedCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [selectedCategory]);

  // When a course is clicked, load its subjects
  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setSelectedSubject(null);
    setChapters([]);
    try {
      const res = await fetch(`/api/courses/${course.id}/subjects`);
      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  // When a subject is clicked, load its chapters
  const handleSelectSubject = async (subject: Subject) => {
    setSelectedSubject(subject);
    try {
      const res = await fetch(`/api/subjects/${subject.id}/chapters`);
      const data = await res.json();
      setChapters(data.chapters || []);
    } catch (err) {
      console.error('Failed to load chapters:', err);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.nameEn.toLowerCase().includes(q) || c.nameHi.includes(q);
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb Header navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <button
          onClick={() => {
            setSelectedCourse(null);
            setSelectedSubject(null);
          }}
          className="hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          {t.courses.title}
        </button>

        {selectedCourse && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition font-bold"
            >
              {language === 'hi' ? selectedCourse.nameHi : selectedCourse.nameEn}
            </button>
          </>
        )}

        {selectedSubject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {language === 'hi' ? selectedSubject.nameHi : selectedSubject.nameEn}
            </span>
          </>
        )}
      </div>

      {/* Main Course Selection Level */}
      {!selectedCourse && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {t.courses.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'hi'
                  ? 'अपनी कक्षा या लक्षित प्रतियोगी परीक्षा चुनें'
                  : 'Select your target class or competitive examination'}
              </p>
            </div>

            {/* Filter Tabs adhering to §1.A (functional buttons with segmented control styling) */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto text-xs font-bold">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.courses.filterAll}
              </button>
              <button
                onClick={() => setSelectedCategory('school_college')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'school_college'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.courses.schoolAndCollege}
              </button>
              <button
                onClick={() => setSelectedCategory('competitive_exam')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'competitive_exam'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.courses.competitiveExams}
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.courses.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-2xs"
            />
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCourse(c)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      {c.category === 'school_college' ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    {/* Unboxed clean metadata per §1.A */}
                    <div className="text-[11px] font-semibold text-slate-400">
                      <span>{c.category === 'school_college' ? 'School / College' : 'Govt. Exam'}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {language === 'hi' ? c.nameHi : c.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {language === 'hi' ? c.descriptionHi : c.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {c.totalSubjects ? `${c.totalSubjects} ${t.courses.subjects}` : 'Syllabus available'}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>{t.courses.viewSubjects}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Drilldown Level: Subjects List */}
      {selectedCourse && !selectedSubject && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0B192C] text-white space-y-2 border border-slate-800">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              {selectedCourse.category === 'school_college' ? t.courses.schoolAndCollege : t.courses.competitiveExams}
            </div>
            <h2 className="text-xl font-extrabold">
              {language === 'hi' ? selectedCourse.nameHi : selectedCourse.nameEn}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              {language === 'hi' ? selectedCourse.descriptionHi : selectedCourse.descriptionEn}
            </p>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.courses.subjects} ({subjects.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div
                key={s.id}
                onClick={() => handleSelectSubject(s)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {language === 'hi' ? s.nameHi : s.nameEn}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {s.chapterCount ? `${s.chapterCount} ${t.courses.chapters}` : 'Theory & Quizzes'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Drilldown Level: Chapters List */}
      {selectedCourse && selectedSubject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {language === 'hi' ? selectedSubject.nameHi : selectedSubject.nameEn} - {t.courses.chapters}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'अध्यायवार आधिकारिक थ्योरी, सूत्र सारांश एवं वस्तुनिष्ठ प्रश्न हल करें'
                  : 'Complete theory, formula sheets, and chapter practice MCQs'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {chapters.map((ch) => {
              const isUnlocked = user?.isPaidMember || user?.role === 'super_admin' || ch.isFreeDemo;

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectChapter(ch.id);
                    } else {
                      openUpgradeModal();
                    }
                  }}
                  className={`group p-5 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md'
                      : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 opacity-90 hover:border-amber-400/80'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                        ch.isFreeDemo
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : isUnlocked
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {!isUnlocked ? <Lock className="w-4 h-4" /> : ch.chapterNumber}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                          {language === 'hi' ? ch.nameHi : ch.nameEn}
                        </h3>
                        {ch.isFreeDemo ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {t.subscription.freeDemoBadge}
                          </span>
                        ) : !isUnlocked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>₹{plan?.price || 99} Paid</span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {language === 'hi' ? ch.descriptionHi : ch.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold shrink-0 self-end sm:self-center">
                    <span className="text-slate-400 tabular-nums">
                      {ch.estimatedMinutes} mins
                    </span>
                    {isUnlocked ? (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-600 text-slate-950 font-bold transition shadow-2xs whitespace-nowrap"
                      >
                        <span>{t.courses.startChapter}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUpgradeModal();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold transition shadow-xs whitespace-nowrap"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
                        <span>Unlock ₹{plan?.price || 99}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
