import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { Header, ActiveTab } from './components/common/Header.tsx';
import { OfflineIndicator } from './components/common/OfflineIndicator.tsx';
import { StickyInstallBanner } from './components/common/StickyInstallBanner.tsx';
import { UpgradeModal } from './components/subscription/UpgradeModal.tsx';
import { OnboardingModal } from './components/onboarding/OnboardingModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { GlobalSearchModal } from './components/search/GlobalSearchModal.tsx';
import { StudentDashboard } from './components/dashboard/StudentDashboard.tsx';
import { CourseExplorer } from './components/courses/CourseExplorer.tsx';
import { ChapterDetailView } from './components/courses/ChapterDetailView.tsx';
import { MockTestArena } from './components/quiz/MockTestArena.tsx';
import { PersonalNotesEditor } from './components/notes/PersonalNotesEditor.tsx';
import { PDFDownloadCenter } from './components/pdf/PDFDownloadCenter.tsx';
import { BookmarksView } from './components/bookmarks/BookmarksView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

function MainApp() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [initialCourseCategory, setInitialCourseCategory] = useState<
    'school_college' | 'competitive_exam' | undefined
  >(undefined);

  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
  };

  const handleBackFromChapter = () => {
    setSelectedChapterId(null);
  };

  const handleNavigateToCourses = (category?: 'school_college' | 'competitive_exam') => {
    setInitialCourseCategory(category);
    setSelectedChapterId(null);
    setActiveTab('courses');
  };

  const handleSearchResultClick = (type: string, targetId: string) => {
    if (type === 'chapter' || type === 'question' || type === 'note') {
      setSelectedChapterId(targetId);
    } else {
      setActiveTab('courses');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar adhering to the Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedChapterId(null);
          setActiveTab(tab);
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedChapterId ? (
          <ChapterDetailView chapterId={selectedChapterId} onBack={handleBackFromChapter} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                onNavigateToCourses={handleNavigateToCourses}
                onNavigateToMockTests={() => setActiveTab('mock_tests')}
                onNavigateToNotes={() => setActiveTab('notes_maker')}
                onOpenChapter={handleOpenChapter}
              />
            )}

            {activeTab === 'courses' && (
              <CourseExplorer
                initialCategory={initialCourseCategory}
                onSelectChapter={handleOpenChapter}
              />
            )}

            {activeTab === 'mock_tests' && <MockTestArena />}

            {activeTab === 'notes_maker' && <PersonalNotesEditor />}

            {activeTab === 'pdf_center' && <PDFDownloadCenter />}

            {activeTab === 'bookmarks' && (
              <BookmarksView
                onOpenItem={(type, targetId) => {
                  setSelectedChapterId(targetId);
                }}
              />
            )}

            {activeTab === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Global Modals & Notifications */}
      <UpgradeModal />
      <OnboardingModal />
      <AuthModal />
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={handleSearchResultClick}
      />
      <OfflineIndicator />
      <StickyInstallBanner />

      {/* Clean, unboxed Footer per §1.B */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white">
              {t.brand.name}
            </span>
            <span>·</span>
            <span>{t.brand.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>NCERT & State Boards (Class 6-12)</span>
            <span>·</span>
            <span>SSC · Banking · Railway · UPSC · BPSC</span>
            <span>·</span>
            <span>© 2026 Rajnish Study</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
