import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Language } from '../../types/index.ts';
import { X, Lock, Mail, User as UserIcon, BookOpen, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, loginAsDemoStudent, loginAsDemoAdmin } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(authModalTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [medium, setMedium] = useState<Language>(language);
  const [targetExam, setTargetExam] = useState('SSC CGL');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync tab with context if opened from external trigger
  React.useEffect(() => {
    if (authModalTab) setTab(authModalTab);
    setErrorMsg('');
    setSuccessMsg('');
  }, [authModalTab, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || t.common.error);
      }
    } else if (tab === 'register') {
      const res = await register(name, email, password, medium, targetExam);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || t.common.error);
      } else {
        setLanguage(medium);
      }
    } else if (tab === 'forgot') {
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword: 'Reset@123' }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setSuccessMsg(
            language === 'hi'
              ? 'पासवर्ड रीसेट कर दिया गया है। आप नए पासवर्ड "Reset@123" से लॉग इन कर सकते हैं।'
              : 'Password reset successfully. You can log in with temporary password "Reset@123".'
          );
        } else {
          setErrorMsg(data.error || 'User not found');
        }
      } catch {
        setLoading(false);
        setErrorMsg('Network error occurred');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              tab === 'login'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.auth.loginBtn}
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              tab === 'register'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.auth.signUpTitle}
          </button>
          <button
            onClick={() => {
              setTab('forgot');
              setErrorMsg('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              tab === 'forgot'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.auth.forgotTitle}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-2.5 text-xs text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.auth.fullName}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajnish Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.auth.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth.mediumSelect}
                </label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value as Language)}
                  className="w-full py-2 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                >
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth.targetExamSelect}
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full py-2 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Class 10">Class 10 Board</option>
                  <option value="Class 12">Class 12 Board</option>
                  <option value="SSC CGL">SSC CGL</option>
                  <option value="Banking PO">IBPS / SBI PO</option>
                  <option value="Railway NTPC">Railway RRB</option>
                  <option value="UPSC GS">UPSC / State PCS</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 text-xs transition shadow-sm disabled:opacity-50"
          >
            {loading ? t.common.loading : tab === 'login' ? t.auth.loginBtn : tab === 'register' ? t.auth.registerBtn : t.auth.resetBtn}
          </button>
        </form>

        {/* Quick Demo Accounts for Seamless Evaluation */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] text-center text-slate-400 font-medium">
            {language === 'hi' ? 'त्वरित मूल्यांकन हेतु डेमो खाते:' : 'Quick demo accounts for testing:'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginAsDemoStudent}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.auth.demoStudent}</span>
            </button>
            <button
              type="button"
              onClick={loginAsDemoAdmin}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-orange-500" />
              <span>{t.auth.demoAdmin}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
