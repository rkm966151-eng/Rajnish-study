import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Language } from '../../types/index.ts';
import { BookOpen, GraduationCap, Sparkles, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { hasChosenOnboarding, completeOnboarding } = useLanguage();
  const [selectedMedium, setSelectedMedium] = useState<Language>('hi');

  if (hasChosenOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-hidden relative">
        {/* Decorative subtle saffron accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0B192C] flex items-center justify-center p-2 shadow-md">
            <img src="/icon.svg" alt="Rajnish Study" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              RAJNISH STUDY
            </h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold tracking-wide">
              Learn Smart. Practice More. Achieve More.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            अपनी पढ़ाई का माध्यम चुनें / Select Your Study Medium
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can change your language anytime from Settings. All navigation, notes, and MCQs will follow your selected medium.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Hindi Medium Card */}
          <button
            type="button"
            onClick={() => setSelectedMedium('hi')}
            className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all relative ${
              selectedMedium === 'hi'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-1 ring-amber-500'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            {selectedMedium === 'hi' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              हिंदी माध्यम (Hindi)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              कक्षा 6 से 12 एवं प्रतियोगी परीक्षाओं (SSC, Banking, Railway, UPSC) की पूरी सामग्री व प्रश्न हिंदी में।
            </p>
          </button>

          {/* English Medium Card */}
          <button
            type="button"
            onClick={() => setSelectedMedium('en')}
            className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all relative ${
              selectedMedium === 'en'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-1 ring-amber-500'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            {selectedMedium === 'en' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              English Medium
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Complete curriculum, official theory, formula sheets, and chapter MCQs in English.
            </p>
          </button>
        </div>

        <button
          onClick={() => completeOnboarding(selectedMedium)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold py-3 px-6 text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {selectedMedium === 'hi' ? 'पढ़ाई शुरू करें (Start Learning)' : 'Start Learning Now'}
          </span>
        </button>
      </div>
    </div>
  );
};
