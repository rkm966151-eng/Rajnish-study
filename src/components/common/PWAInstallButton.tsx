import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { AndroidApkModal } from './AndroidApkModal.tsx';
import { Smartphone, Download, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t, language } = useLanguage();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowApkModal(true)}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white transition-colors shadow-xs whitespace-nowrap shrink-0"
        title="Download Android APK / Install App"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
        <span>{language === 'hi' ? 'APK / ऐप' : 'APK / App'}</span>
      </button>

      <AndroidApkModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />
    </>
  );
};
