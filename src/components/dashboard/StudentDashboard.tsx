import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { UserAnalytics } from '../../types/index.ts';
import {
  Flame,
  Clock,
  Target,
  Award,
  BookOpen,
  FileText,
  Bookmark,
  TrendingUp,
  ArrowRight,
  Sparkles,
  PlayCircle,
  ShieldCheck,
  Lock,
  Zap,
  Smartphone,
  Download,
} from 'lucide-react';
import { AndroidApkModal } from '../common/AndroidApkModal.tsx';

interface StudentDashboardProps {
  onNavigateToCourses: (category?: 'school_college' | 'competitive_exam') => void;
  onNavigateToMockTests: () => void;
  onNavigateToNotes: () => void;
  onOpenChapter: (chapterId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToCourses,
  onNavigateToMockTests,
  onNavigateToNotes,
  onOpenChapter,
}) => {
  const { user, token, plan, openUpgradeModal } = useAuth();
  const { t, language } = useLanguage();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApkDownloadModal, setShowApkDownloadModal] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!token) return;
      try {
        const res = await fetch('/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [token]);

  const isPaid = user?.isPaidMember || user?.role === 'super_admin';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#0B192C] p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.brand.tagline}</span>
              </div>
              {isPaid ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '⭐ प्रीमियम पेड बैच सक्रिय' : '⭐ Premium Batch Active'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openUpgradeModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-xs hover:bg-amber-400 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? `पेड बैच अनलॉक करें (मात्र ₹${plan?.price || 99})` : `Unlock Paid Batch (₹${plan?.price || 99})`}</span>
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.dashboard.welcomeBack}, {user ? user.name : 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'आज का अभ्यास शुरू करें और अपनी तैयारी को अगले स्तर पर ले जाएं। अध्यायवार नोट्स, वस्तुनिष्ठ प्रश्न और मॉक टेस्ट उपलब्ध हैं।'
                : 'Boost your academic and exam preparation today with chapter-wise theory, practice MCQs, and full-length tests.'}
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onOpenChapter('ch_c10_sci_1')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition transform active:scale-95 whitespace-nowrap"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{t.dashboard.resumeChapter} (Demo)</span>
            </button>
            <button
              onClick={onNavigateToMockTests}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition backdrop-blur-xs whitespace-nowrap"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>{t.dashboard.takeDailyQuiz}</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Prominent Paid Batch Unlock Alert Card if user is not yet a paid subscriber */}
      {!isPaid && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-extrabold shadow-sm">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi'
                    ? `विशेष छूट: मात्र ₹${plan?.price || 99} में संपूर्ण पेड बैच अनलॉक करें`
                    : `Special Offer: Unlock All-Access Paid Batch for just ₹${plan?.price || 99}`}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                  Save {plan ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100) : 80}%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'डेमो क्लास के अलावा सभी क्लास, नोट्स, क्विज एवं टेस्ट सीरीज पर लॉक लगा है। एक बार ₹99 देकर सब अनलॉक करें।'
                  : 'Apart from free demo classes, all full-length tests and chapters require Paid Batch membership.'}
              </p>
            </div>
          </div>

          <button
            onClick={openUpgradeModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-md transition transform active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <span>{language === 'hi' ? `अभी ₹${plan?.price || 99} में अनलॉक करें` : `Unlock All for ₹${plan?.price || 99}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Android APK Download Showcase Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'Rajnish Study आधिकारिक Android APK डाउनलोड' : 'Rajnish Study Official Android App & APK'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                v1.2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'फोन में बिना रुकावट टेस्ट देने, नोट्स ऑफलाइन पढ़ने और 1-क्लिक एक्सेस के लिए ऐप इंस्टॉल करें।'
                : 'Install as an Android App for offline access, instant notifications, and full-screen test experience.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowApkDownloadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition shrink-0 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'hi' ? 'APK / ऐप डाउनलोड करें' : 'Download APK / Install'}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.learningStreak}
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics?.streakDays || 1} <span className="text-xs font-normal text-slate-400">days</span>
            </h3>
          </div>
        </div>

        {/* Total Quizzes Attempted */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.totalQuizzes}
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics?.totalQuizAttempts || 0}
            </h3>
          </div>
        </div>

        {/* Accuracy % */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.accuracy}
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics?.overallAccuracy || 0}%
            </h3>
          </div>
        </div>

        {/* Study Time */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.totalStudyTime}
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics?.totalStudyMinutes || 0} <span className="text-xs font-normal text-slate-400">{t.dashboard.minutes}</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Split: Continue Learning & Target Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning & Performance Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Featured Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>{t.dashboard.continueLearning}</span>
              </h2>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Class 10 Science
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Chapter 1 · Chemical Reactions and Equations
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi'
                    ? 'रासायनिक अभिक्रियाएँ एवं समीकरण (Bilingual Notes & 10 MCQs)'
                    : 'Chemical Reactions and Equations (Official Notes & MCQs)'}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>80% Accuracy</span>
                  <span>·</span>
                  <span>10 Practice MCQs</span>
                  <span>·</span>
                  <span>45 mins est.</span>
                </div>
              </div>

              <button
                onClick={() => onOpenChapter('ch_c10_sci_1')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-xs whitespace-nowrap self-stretch sm:self-auto justify-center"
              >
                <span>{t.courses.startChapter}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Weekly Activity & Performance Visualizer */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span>{t.dashboard.weeklyProgress}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Study minutes and completed quiz sessions
                </p>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44 border-b border-slate-100 dark:border-slate-800 pb-2">
              {(analytics?.weeklyActivityDays || [
                { day: 'Mon', minutes: 45, quizzes: 2 },
                { day: 'Tue', minutes: 60, quizzes: 3 },
                { day: 'Wed', minutes: 30, quizzes: 1 },
                { day: 'Thu', minutes: 75, quizzes: 4 },
                { day: 'Fri', minutes: 50, quizzes: 2 },
                { day: 'Sat', minutes: 90, quizzes: 5 },
                { day: 'Sun', minutes: 40, quizzes: 2 },
              ]).map((item, idx) => {
                const heightPct = Math.min(100, Math.round((item.minutes / 100) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-500 transition tabular-nums opacity-0 group-hover:opacity-100">
                      {item.minutes}m
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-500 hover:to-orange-400 transition-all duration-300 relative"
                    />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Subject-wise breakdown chips */}
            <div className="mt-6 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                {t.dashboard.subjectPerformance}
              </h4>
              <div className="space-y-3">
                {(analytics?.subjectPerformance || [
                  { subjectName: 'Science (विज्ञान)', totalAttempted: 15, accuracy: 80 },
                  { subjectName: 'Polity (राजव्यवस्था)', totalAttempted: 10, accuracy: 90 },
                  { subjectName: 'Reasoning (तर्कशक्ति)', totalAttempted: 8, accuracy: 88 },
                  { subjectName: 'Mathematics (गणित)', totalAttempted: 12, accuracy: 75 },
                ]).map((subj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{subj.subjectName}</span>
                      <span className="text-slate-900 dark:text-white tabular-nums font-bold">
                        {subj.accuracy}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${subj.accuracy}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          subj.accuracy >= 80 ? 'bg-emerald-500' : subj.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Explore Major Pathways & Recent Activity */}
        <div className="space-y-6">
          {/* Explore Major Courses Pathways */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'पाठ्यक्रम वर्ग / Course Paths' : 'Explore Study Pathways'}
            </h3>

            {/* School & College pathway card */}
            <button
              onClick={() => onNavigateToCourses('school_college')}
              className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {t.courses.schoolAndCollege}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {t.courses.schoolSubtitle}
              </p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                Class 6 - 12 · Graduation · Post Grad →
              </span>
            </button>

            {/* Competitive Exams pathway card */}
            <button
              onClick={() => onNavigateToCourses('competitive_exam')}
              className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {t.courses.competitiveExams}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {t.courses.competitiveSubtitle}
              </p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                SSC · Banking · Railway · UPSC · BPSC →
              </span>
            </button>
          </div>

          {/* Quick Tools Box */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'hi' ? 'अध्ययन उपकरण' : 'Learning Tools'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onNavigateToNotes}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>{t.nav.notesMaker}</span>
              </button>
              <button
                onClick={onNavigateToMockTests}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
              >
                <Target className="w-4 h-4 text-orange-500" />
                <span>{t.nav.mockTests}</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {t.dashboard.recentActivity}
            </h4>

            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
                {analytics.recentActivity.map((act) => (
                  <div key={act.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {act.score && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                        {act.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                {t.dashboard.noRecentActivity}
              </p>
            )}
          </div>
        </div>
      </div>

      <AndroidApkModal isOpen={showApkDownloadModal} onClose={() => setShowApkDownloadModal(false)} />
    </div>
  );
};
