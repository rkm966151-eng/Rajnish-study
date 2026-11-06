import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import {
  Search,
  Sun,
  Moon,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  LogIn,
  Menu,
  X,
  Languages,
  Lock,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'courses'
  | 'mock_tests'
  | 'notes_maker'
  | 'pdf_center'
  | 'bookmarks'
  | 'admin';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, openAuthModal, plan, openUpgradeModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B192C]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0B192C] dark:bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-xs transition group-hover:scale-105">
              <img src="/icon.svg" alt="Rajnish Study" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
                {t.brand.name}
              </span>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block leading-tight tracking-wider uppercase">
                {language === 'hi' ? 'द्विभाषी शिक्षा मंच' : 'Bilingual Platform'}
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'dashboard'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('courses')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'courses'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              {t.nav.courses}
            </button>
            <button
              onClick={() => handleNavClick('mock_tests')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'mock_tests'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              {t.nav.mockTests}
            </button>
            <button
              onClick={() => handleNavClick('notes_maker')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'notes_maker'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              {t.nav.notesMaker}
            </button>
            <button
              onClick={() => handleNavClick('pdf_center')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'pdf_center'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              {t.nav.pdfCenter}
            </button>
            <button
              onClick={() => handleNavClick('bookmarks')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'bookmarks'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              {t.nav.bookmarks}
            </button>
            {user && (user.role === 'super_admin' || user.role === 'content_admin') && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'admin' ? 'border-b-2 border-orange-500 font-bold' : ''
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.nav.admin}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action & Controls Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Global Search trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t.nav.search}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher Button (HI / EN) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-amber-700 dark:text-amber-400 hover:border-amber-400 transition"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'हिंदी' : 'ENG'}</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'dark' ? t.common.lightMode : t.common.darkMode}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Paid Batch Unlock / VIP Status button */}
            {user?.isPaidMember || user?.role === 'super_admin' ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>VIP Paid</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={openUpgradeModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-xs transition whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>₹{plan?.price || 99} Batch</span>
              </button>
            )}

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-amber-400 transition text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                        {user.role} · {user.medium === 'hi' ? 'हिंदी माध्यम' : 'English Medium'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>{t.nav.profile}</span>
                    </button>

                    {(user.role === 'super_admin' || user.role === 'content_admin') && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 flex items-center gap-2 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t.nav.admin}</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-600 text-xs font-bold transition whitespace-nowrap shrink-0 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.nav.login}</span>
              </button>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2 text-xs font-semibold">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left py-2.5 px-3 rounded-lg ${
              activeTab === 'dashboard'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => handleNavClick('courses')}
            className={`w-full text-left py-2.5 px-3 rounded-lg ${
              activeTab === 'courses'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.courses}
          </button>
          <button
            onClick={() => handleNavClick('mock_tests')}
            className={`w-full text-left py-2.5 px-3 rounded-lg ${
              activeTab === 'mock_tests'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.mockTests}
          </button>
          <button
            onClick={() => handleNavClick('notes_maker')}
            className={`w-full text-left py-2.5 px-3 rounded-lg ${
              activeTab === 'notes_maker'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.notesMaker}
          </button>
          <button
            onClick={() => handleNavClick('pdf_center')}
            className={`w-full text-left py-2.5 px-3 rounded-lg ${
              activeTab === 'pdf_center'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.pdfCenter}
          </button>
          <button
            onClick={() => handleNavClick('bookmarks')}
            className={`w-full text-left py-2.5 px-3 rounded-lg ${
              activeTab === 'bookmarks'
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.bookmarks}
          </button>
          {user && (user.role === 'super_admin' || user.role === 'content_admin') && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-orange-600 dark:text-orange-400 ${
                activeTab === 'admin'
                  ? 'bg-orange-50 dark:bg-orange-950/30 font-bold'
                  : ''
              }`}
            >
              {t.nav.admin}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
