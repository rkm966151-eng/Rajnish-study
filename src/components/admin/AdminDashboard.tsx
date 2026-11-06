import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Course, Subject, Chapter, QuestionServer } from '../../types/index.ts';
import {
  ShieldCheck,
  Plus,
  Layers,
  BookOpen,
  HelpCircle,
  Bell,
  Users,
  FileCheck,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Check,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, token, loginAsDemoAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'courses' | 'chapters' | 'questions' | 'announcements' | 'students' | 'subscription'
  >('overview');

  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Course form state
  const [courseNameEn, setCourseNameEn] = useState('');
  const [courseNameHi, setCourseNameHi] = useState('');
  const [courseCategory, setCourseCategory] = useState<'school_college' | 'competitive_exam'>('school_college');

  // Chapter form state
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterNameEn, setChapterNameEn] = useState('');
  const [chapterNameHi, setChapterNameHi] = useState('');

  // Bulk MCQ JSON import state
  const [jsonBulkInput, setJsonBulkInput] = useState('');

  // Subscription management state
  const [subData, setSubData] = useState<any>(null);
  const [editPrice, setEditPrice] = useState<number>(99);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number>(499);
  const [editUpiId, setEditUpiId] = useState<string>('rajnishstudy@upi');
  const [editTitleHi, setEditTitleHi] = useState<string>('संपूर्ण बैच 2026 (सभी विषय एवं टेस्ट)');
  const [editTitleEn, setEditTitleEn] = useState<string>('Complete Batch 2026 (All Subjects & Tests)');
  const [savingPlan, setSavingPlan] = useState(false);

  const fetchAdminData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Access denied');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to admin API');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/subscription', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubData(data);
        if (data.plan) {
          setEditPrice(data.plan.price);
          setEditOriginalPrice(data.plan.originalPrice || 499);
          setEditUpiId(data.plan.upiId || 'rajnishstudy@upi');
          setEditTitleHi(data.plan.titleHi || '');
          setEditTitleEn(data.plan.titleEn || '');
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchSubscriptionData();
  }, [token, user]);

  const handleSaveSubscriptionPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPlan(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: Number(editPrice),
          originalPrice: Number(editOriginalPrice),
          upiId: editUpiId,
          titleHi: editTitleHi,
          titleEn: editTitleEn,
        }),
      });
      if (res.ok) {
        setSuccessMsg(language === 'hi' ? 'बैच शुल्क और प्लान विवरण सफलतापूर्वक अपडेट हुआ!' : 'Batch pricing & plan details updated successfully!');
        fetchSubscriptionData();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to update plan');
      }
    } catch {
      setErrorMsg('Network error updating subscription plan');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleToggleUserPaid = async (userId: string, currentPaid: boolean) => {
    try {
      const res = await fetch('/api/admin/subscription/toggle-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, isPaidMember: !currentPaid }),
      });
      if (res.ok) {
        fetchSubscriptionData();
      }
    } catch {
      // ignore
    }
  };

  const handleToggleChapterDemo = async (chapterId: string, currentDemo: boolean) => {
    try {
      const res = await fetch('/api/admin/subscription/toggle-chapter-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chapterId, isFreeDemo: !currentDemo }),
      });
      if (res.ok) {
        fetchSubscriptionData();
      }
    } catch {
      // ignore
    }
  };

  // Check role access
  const isAuthorized = user && (user.role === 'super_admin' || user.role === 'content_admin');

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t.admin.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.admin.accessDenied}
        </p>
        <button
          onClick={loginAsDemoAdmin}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
        >
          {t.auth.demoAdmin}
        </button>
      </div>
    );
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: courseCategory,
          nameEn: courseNameEn,
          nameHi: courseNameHi,
          descriptionEn: `${courseNameEn} syllabus and chapter material.`,
          descriptionHi: `${courseNameHi} पाठ्यक्रम एवं सामग्री।`,
          slug: courseNameEn.toLowerCase().replace(/\s+/g, '-'),
          iconName: 'BookOpen',
          order: 99,
          isPublished: true,
        }),
      });
      if (res.ok) {
        setSuccessMsg('New course published successfully!');
        setCourseNameEn('');
        setCourseNameHi('');
        fetchAdminData();
      }
    } catch {
      setErrorMsg('Failed to create course');
    }
  };

  const handleBulkImportMCQs = async () => {
    if (!jsonBulkInput.trim()) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const parsed = JSON.parse(jsonBulkInput);
      const res = await fetch('/api/admin/questions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: parsed }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Successfully imported ${data.count} MCQs into the question bank!`);
        setJsonBulkInput('');
        fetchAdminData();
      }
    } catch (e: any) {
      setErrorMsg(`Invalid JSON format: ${e.message}`);
    }
  };

  const sampleJsonTemplate = JSON.stringify(
    [
      {
        chapterId: 'ch_c10_sci_1',
        questionEn: 'Which gas is evolved when zinc granules react with dilute sulfuric acid?',
        questionHi: 'तनु सल्फ्यूरिक अम्ल के साथ जिंक की अभिक्रिया से कौन सी गैस निकलती है?',
        optionsEn: ['Oxygen', 'Hydrogen (H2)', 'Nitrogen', 'Chlorine'],
        optionsHi: ['ऑक्सीजन', 'हाइड्रोजन (H2)', 'नाइट्रोजन', 'क्लोरीन'],
        correctOptionIndex: 1,
        explanationEn: 'Zn + H2SO4 -> ZnSO4 + H2(g). Hydrogen burns with a pop sound.',
        explanationHi: 'Zn + H2SO4 -> ZnSO4 + H2(g)। हाइड्रोजन गैस पॉप ध्वनि के साथ जलती है।',
        difficulty: 'Easy',
        marks: 1,
        topic: 'Acids, Bases & Metals',
      },
    ],
    null,
    2
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0B192C] text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {user.role}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold">{t.admin.title}</h1>
          <p className="text-xs text-slate-300 mt-1">{t.admin.subtitle}</p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Courses</div>
            <div className="text-lg font-bold text-amber-400 tabular-nums">{overviewData?.totalCourses || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Chapters</div>
            <div className="text-lg font-bold text-emerald-400 tabular-nums">{overviewData?.totalChapters || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-slate-400 text-[10px] uppercase font-bold">MCQs</div>
            <div className="text-lg font-bold text-blue-400 tabular-nums">{overviewData?.totalQuestions || 0}</div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeAdminTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveAdminTab('courses')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeAdminTab === 'courses'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.admin.tabCourses}
        </button>
        <button
          onClick={() => setActiveAdminTab('questions')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeAdminTab === 'questions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.admin.tabQuestions}
        </button>
        <button
          onClick={() => setActiveAdminTab('students')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeAdminTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.admin.tabStudents}
        </button>
        <button
          onClick={() => setActiveAdminTab('subscription')}
          className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition ${
            activeAdminTab === 'subscription'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
              : 'text-amber-600 dark:text-amber-400 font-bold'
          }`}
        >
          <span>₹</span>
          <span>{language === 'hi' ? 'बैच शुल्क एवं कमाई' : 'Batch Fee & Revenue'}</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              System Audit Logs
            </h3>
            <div className="space-y-2">
              {overviewData?.recentAuditLogs?.map((log: any) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Course Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Use the Courses tab to add classes (Class 6 - 12) or government exams (SSC, Railway, Banking, UPSC). All changes update the public API instantly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveAdminTab('courses')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs"
              >
                + Add Course / Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Courses Management */}
      {activeAdminTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.admin.addCourse}
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Category
                </label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="school_college">School & College</option>
                  <option value="competitive_exam">Competitive Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={courseNameEn}
                  onChange={(e) => setCourseNameEn(e.target.value)}
                  placeholder="e.g. Class 11 Biology or SSC GD"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name (Hindi)
                </label>
                <input
                  type="text"
                  required
                  value={courseNameHi}
                  onChange={(e) => setCourseNameHi(e.target.value)}
                  placeholder="उदा. कक्षा 11 जीव विज्ञान"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs"
              >
                Publish Course
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Published Courses & Exams ({overviewData?.courses?.length || 0})
            </h3>
            <div className="space-y-2 max-h-[460px] overflow-y-auto">
              {overviewData?.courses?.map((c: Course) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{c.nameHi} / {c.nameEn}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {c.category === 'school_college' ? 'School & College' : 'Competitive Exam'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Published</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Questions Bulk Import */}
      {activeAdminTab === 'questions' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.admin.bulkUploadTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paste JSON array of MCQs with bilingual questions, 4 options, correct answer index, and detailed explanations.
              </p>
            </div>
            <button
              onClick={() => setJsonBulkInput(sampleJsonTemplate)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 underline"
            >
              Load Sample Template
            </button>
          </div>

          <textarea
            value={jsonBulkInput}
            onChange={(e) => setJsonBulkInput(e.target.value)}
            placeholder="Paste JSON array here..."
            className="w-full h-64 p-4 font-mono text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={handleBulkImportMCQs}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>{t.admin.importJson}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Students */}
      {activeAdminTab === 'students' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Registered Students Directory
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(subData?.students || []).map((st: any) => (
                  <tr key={st.id} className="text-slate-800 dark:text-slate-200">
                    <td className="py-3 font-bold">{st.name}</td>
                    <td className="py-3 text-slate-500">{st.email}</td>
                    <td className="py-3">
                      {st.isPaidMember ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <Check className="w-3 h-3" /> Paid Member
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold text-[11px]">
                          Free Tier
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleUserPaid(st.id, !!st.isPaidMember)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          st.isPaidMember
                            ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {st.isPaidMember ? 'Revoke Access' : 'Grant Paid Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Subscription & Dynamic Pricing Management */}
      {activeAdminTab === 'subscription' && (
        <div className="space-y-6">
          {/* Revenue & Plan Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white">
              <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                {language === 'hi' ? 'सक्रिय बैच शुल्क (प्राइस)' : 'Active Batch Fee (Price)'}
              </div>
              <div className="text-3xl font-black mt-1 text-amber-600 dark:text-amber-400">
                ₹{subData?.plan?.price || 99}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'hi' ? 'छात्रों से ली जाने वाली फीस' : 'Charged to students on checkout'}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-white">
              <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                {language === 'hi' ? 'कुल अर्जित आय (Total Revenue)' : 'Total Revenue Collected'}
              </div>
              <div className="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
                ₹{subData?.totalRevenue || 0}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'hi' ? `${subData?.paidUsersCount || 0} पेड छात्र नामांकित` : `${subData?.paidUsersCount || 0} Paid students enrolled`}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-slate-900 dark:text-white">
              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                {language === 'hi' ? 'UPI पेमेंट आईडी' : 'Receiving UPI ID'}
              </div>
              <div className="text-lg font-bold mt-2 text-blue-600 dark:text-blue-400 truncate">
                {subData?.plan?.upiId || 'rajnishstudy@upi'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'hi' ? 'सीधे आपके बैंक में प्राप्त' : 'Direct student UPI settlements'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Dynamic Price Editor */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'बैच शुल्क घटाएं या बढ़ाएं' : 'Adjust Batch Fee & Pricing'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'आप जब चाहें फीस बदल सकते हैं' : 'Change batch fees dynamically at any time'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSubscriptionPlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'छात्र शुल्क (Current Offer Price in ₹)' : 'Current Offer Price (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                      placeholder="99"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {language === 'hi' ? 'जैसे ₹99, ₹149, ₹49 इत्यादि' : 'e.g. ₹99, ₹149, ₹199 etc.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'वास्तविक मूल्य (M.R.P / Original Price ₹)' : 'Original Price (M.R.P. in ₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                      placeholder="499"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'आपकी UPI आईडी (Receiver UPI ID)' : 'Receiver UPI ID (e.g. yourname@oksbi)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editUpiId}
                    onChange={(e) => setEditUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                    placeholder="rajnishstudy@upi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'बैच शीर्षक (हिंदी)' : 'Batch Title (Hindi)'}
                  </label>
                  <input
                    type="text"
                    value={editTitleHi}
                    onChange={(e) => setEditTitleHi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'बैच शीर्षक (अंग्रेज़ी)' : 'Batch Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPlan}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition"
                >
                  {savingPlan ? 'Updating...' : language === 'hi' ? 'शुल्क सहेजें और लागू करें' : 'Save & Apply New Pricing'}
                </button>
              </form>
            </div>

            {/* Chapters Demo/Paid Access Controls & Transactions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Chapters Demo status control */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{language === 'hi' ? 'पाठ डेमो स्थिति (Free Demo vs Locked)' : 'Chapter Demo Status (Free vs Locked)'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {language === 'hi' ? 'केवल डेमो चैप्टर बिना भुगतान के खुले रहेंगे' : 'Only demo chapters are free to view'}
                  </span>
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {(subData?.chapters || []).map((ch: any) => (
                    <div
                      key={ch.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {ch.titleHi || ch.titleEn}
                        </div>
                        <div className="text-[10px] text-slate-400">{ch.id}</div>
                      </div>
                      <button
                        onClick={() => handleToggleChapterDemo(ch.id, !!ch.isFreeDemo)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          ch.isFreeDemo
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {ch.isFreeDemo
                          ? (language === 'hi' ? '✓ फ्री डेमो (खुला)' : '✓ Free Demo (Open)')
                          : (language === 'hi' ? '🔒 लॉक (₹ पेड)' : '🔒 Locked (Paid)')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transactions log */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'हालिया भुगतान लेनदेन (Payment Log)' : 'Recent Payment Transactions'}
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {(subData?.transactions || []).length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      {language === 'hi' ? 'अभी तक कोई भुगतान नहीं हुआ है।' : 'No payment transactions yet.'}
                    </p>
                  ) : (
                    subData.transactions.map((tx: any) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {tx.userName || tx.userEmail}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            UTR: {tx.transactionRef || 'Direct UPI'} · {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            +₹{tx.amount}
                          </div>
                          <div className="text-[10px] text-emerald-500 font-semibold">
                            {tx.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
