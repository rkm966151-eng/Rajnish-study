import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import {
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  X,
  QrCode,
  Shield,
  Zap,
  Globe,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { isInstallable, install, isInstalled } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'twa' | 'guide'>('pwa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The live app URL
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rajnishstudy.com';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPwaApk = async () => {
    if (isInstallable) {
      await install();
      onClose();
    } else {
      // Trigger browser's native install prompt or guide
      setActiveTab('guide');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 p-2 flex items-center justify-center shrink-0">
              <Smartphone className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'Android APK व इंस्टॉलेशन हब' : 'Android APK & Installation Hub'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {language === 'hi' ? 'Rajnish Study ऐप डाउनलोड करें' : 'Download Rajnish Study App'}
              </h2>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex gap-2 mt-5 p-1 rounded-2xl bg-black/20 text-xs font-bold">
            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex-1 py-2 px-3 rounded-xl transition ${
                activeTab === 'pwa'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'hi' ? '⚡ 1-क्लिक ऐप (तुरंत इंस्टॉल)' : '⚡ 1-Click App (Instant)'}
            </button>
            <button
              onClick={() => setActiveTab('twa')}
              className={`flex-1 py-2 px-3 rounded-xl transition ${
                activeTab === 'twa'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'hi' ? '📦 स्टैंडअलोन APK / TWA' : '📦 APK Package (TWA)'}
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2 px-3 rounded-xl transition ${
                activeTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'hi' ? '📖 सहायता एवं गाइड' : '📖 Install Guide'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
          {/* Tab 1: Instant PWA Install (Direct APK on Android) */}
          {activeTab === 'pwa' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'hi'
                      ? 'गूगल क्रोम / एंड्रॉयड वेबएप (Zero-Size PWA APK)'
                      : 'Google Chrome / Android WebAPK (Instant Install)'}
                  </h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'hi'
                      ? 'एंड्रॉयड डिवाइस पर यह सीधे WebAPK के रूप में आपके फोन में एक असली ऐप की तरह इंस्टॉल हो जाता है। इसमें फोन मेमोरी खर्च नहीं होती और सभी टेस्ट ऑफलाइन भी चलते हैं।'
                      : 'Installs directly onto your Android device as an official native WebAPK with full offline support, zero bloatware, and instant updates.'}
                  </p>
                </div>
              </div>

              {/* Install Action Banner */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                    RS
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                      Rajnish Study (Official Android App)
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      v1.2.0 · Hindi & English · 3.2 MB · Verified Safe
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPwaApk}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'hi' ? 'फोन में अभी इंस्टॉल करें' : 'Install on Android Phone'}</span>
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">अल्ट्रा-फास्ट लोडिंग</span>
                    <span className="text-[10px] text-slate-400">0.5 सेकंड में टेस्ट खुलते हैं</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">100% सुरक्षित</span>
                    <span className="text-[10px] text-slate-400">SSL & डाटा एन्क्रिप्शन</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">ऑफलाइन मोड</span>
                    <span className="text-[10px] text-slate-400">इंटरनेट के बिना भी नोट्स पढ़ें</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">फुल स्क्रीन अनुभव</span>
                    <span className="text-[10px] text-slate-400">कोई ब्राउज़र बार नहीं</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Standalone APK & TWA Package Builder */}
          {activeTab === 'twa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>{language === 'hi' ? 'एंड्रॉयड स्टूडियो / PWABuilder APK पैकेज' : 'Android Studio / PWABuilder APK Generator'}</span>
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                  {language === 'hi'
                    ? 'यदि आप Google Play Store या सीधे .APK फ़ाइल अपने दोस्तों को WhatsApp पर भेजना चाहते हैं, तो Rajnish Study को PWABuilder या Bubblewrap (TWA) द्वारा सीधे साइंड APK में बदला जा सकता है:'
                    : 'To distribute an official standalone .APK file on WhatsApp or publish to Google Play Store, Rajnish Study uses standard Trusted Web Activity (TWA) architecture.'}
                </p>
              </div>

              {/* Step 1: Copy Production URL */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? '1. ऐप का लाइव लिंक (App Live URL)' : '1. App Live URL'}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    {copied ? (language === 'hi' ? '✓ कॉपी हुआ!' : '✓ Copied!') : (language === 'hi' ? 'कॉपी करें' : 'Copy Link')}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all">
                  {appUrl}
                </div>
              </div>

              {/* Step 2: 1-Click APK Generator via PWABuilder */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? '2. फ्री ऑनलाइन APK बनाएं (PWABuilder)' : '2. Generate Standalone APK (PWABuilder)'}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {language === 'hi' ? 'माइक्रोसॉफ्ट द्वारा समर्थित फ्री APK जनरेटर' : 'Official Google/Microsoft supported APK packager'}
                    </p>
                  </div>
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition shrink-0"
                  >
                    <span>{language === 'hi' ? 'APK बनाएं →' : 'Build APK →'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? 'ऊपर दिए गए "APK बनाएं" पर क्लिक करें → "Package for Stores" में Android चुनें → आपको तुरंत साइंड APK और Play Store AAB पैकेज डाउनलोड के लिए मिल जाएगा।'
                    : 'Click "Build APK" above → Select Android → Download your signed APK or Play Store .AAB bundle ready for sideloading or store release.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Step-by-step installation instructions */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'hi' ? 'किसी भी एंड्रॉयड फोन में कैसे इंस्टॉल करें:' : 'How to install on any Android phone:'}
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? 'गूगल क्रोम (Google Chrome) में खोलें' : 'Open in Google Chrome'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi' ? 'अपने फोन के Chrome ब्राउज़र में इस लिंक को खोलें।' : 'Visit this URL on Chrome or any modern Android browser.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? 'शीर्ष दाएँ कोने में 3 डॉट्स (⋮) पर टैप करें' : 'Tap 3 Dots (⋮) Menu in Chrome'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi' ? 'ब्राउज़र के ऊपर दाएँ कोने में मेन्यू बटन दबाएं।' : 'Locate the top right corner menu inside Chrome.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? '"ऐप इंस्टॉल करें" या "Add to Home Screen" चुनें' : 'Select "Install App" or "Add to Home Screen"'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi' ? 'मात्र 2 सेकंड में Rajnish Study का आइकन आपके फोन की होम स्क्रीन पर आ जाएगा।' : 'Rajnish Study app icon will appear on your app drawer like any Play Store app.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Rajnish Study Native Android PWA v1.2</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold transition"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
