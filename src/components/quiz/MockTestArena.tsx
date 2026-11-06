import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { QuizPlayer } from './QuizPlayer.tsx';
import {
  Target,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const MockTestArena: React.FC = () => {
  const { t, language } = useLanguage();
  const [testStarted, setTestStarted] = useState(false);

  if (testStarted) {
    return (
      <QuizPlayer
        isMockTest={true}
        chapterTitle="All India Full-Length Bilingual Mock Test 2026"
        onExit={() => setTestStarted(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B192C] text-white border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'hi' ? 'लाइव ऑल इंडिया टेस्ट सीरीज' : 'Live All India Mock Series'}</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          {language === 'hi'
            ? 'अखिल भारतीय संपूर्ण द्विभाषी संयुक्त मॉक टेस्ट 2026'
            : 'All India Full-Length Bilingual Combined Mock Test 2026'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {language === 'hi'
            ? 'कक्षा 10, एसएससी, बैंकिंग एवं रेलवे परीक्षाओं के पाठ्यक्रम पर आधारित मिश्रित 15 प्रश्नों का समयबद्ध टेस्ट। तुरंत सटीक परिणाम, ऑल इंडिया स्कोर और व्याख्या प्राप्त करें।'
            : 'Timed mixed 15-question test covering Science, Mathematics, General Studies, and Reasoning with instant performance report and detailed solutions.'}
        </p>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 max-w-md text-xs">
          <div>
            <div className="text-slate-400">Total Questions</div>
            <div className="font-bold text-amber-400 text-sm sm:text-base tabular-nums">15 MCQs</div>
          </div>
          <div>
            <div className="text-slate-400">Duration</div>
            <div className="font-bold text-slate-200 text-sm sm:text-base tabular-nums">20 Mins</div>
          </div>
          <div>
            <div className="text-slate-400">Marking</div>
            <div className="font-bold text-emerald-400 text-sm sm:text-base tabular-nums">+1 / 0</div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setTestStarted(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition transform active:scale-95"
          >
            <span>{language === 'hi' ? 'मॉक टेस्ट अभी शुरू करें' : 'Start Mock Test Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Test Guidelines & Instructions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {language === 'hi' ? 'महत्वपूर्ण परीक्षा निर्देश' : 'Exam Rules & Instructions'}
        </h3>

        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
          <li>
            {language === 'hi'
              ? 'प्रत्येक प्रश्न हिंदी और अंग्रेजी दोनों भाषाओं में उपलब्ध है।'
              : 'Each question is available in both Hindi and English.'}
          </li>
          <li>
            {language === 'hi'
              ? 'टाइमर स्वचालित रूप से 20 मिनट बाद टेस्ट सबमिट कर देगा।'
              : 'The countdown timer will auto-submit the exam after 20 minutes.'}
          </li>
          <li>
            {language === 'hi'
              ? 'आप किसी भी समय दाईं ओर दिए गए प्रश्न पैलेट से प्रश्नों के बीच नेविगेट कर सकते हैं।'
              : 'You can freely navigate between questions using the question palette.'}
          </li>
          <li>
            {language === 'hi'
              ? 'परीक्षण समाप्त होने के बाद विस्तृत विषयवार विश्लेषण एवं प्रत्येक प्रश्न की व्याख्या उपलब्ध होगी।'
              : 'A full performance breakdown with accuracy rates and step-by-step solutions will be generated upon completion.'}
          </li>
        </ul>
      </div>
    </div>
  );
};
