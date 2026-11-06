import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { AndroidApkModal } from './AndroidApkModal.tsx';
import { Smartphone, Download, Share2, Sparkles, X } from 'lucide-react';

export const StickyInstallBanner: React.FC = () => {
  const { language } = useLanguage();
  const { isInstallable, install, isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  // If running already inside standalone PWA or manually closed
  if (isInstalled || dismissed) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        setShowApkModal(true);
      }
    } else {
      setShowApkModal(true);
    }
  };

  return (
    <>
      {/* Floating Bottom Bar on Mobile / Desktop */}
      <aside aria-label="App Installation" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white border-2 border-amber-500/40 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                  Rajnish Study App
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {language === 'hi' ? 'फोन के होम स्क्रीन पर डाउनलोड करें' : 'Download to Home Screen'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md transition transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'इंस्टॉल' : 'Install'}</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <AndroidApkModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />
    </>
  );
};
