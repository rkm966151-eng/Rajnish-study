import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import confetti from 'canvas-confetti';
import {
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
  QrCode,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { user, plan, isUpgradeModalOpen, closeUpgradeModal, unlockSubscription } = useAuth();
  const { t, language } = useLanguage();

  const [paymentTab, setPaymentTab] = useState<'upi_apps' | 'qr_code' | 'cards'>('upi_apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'phonepe' | 'gpay' | 'paytm' | 'bhim'>('phonepe');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isUpgradeModalOpen) return null;

  const currentPrice = plan?.price || 99;
  const originalPrice = plan?.originalPrice || 499;
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  const upiId = plan?.upiId || 'rajnishstudy@upi';
  const receiverName = plan?.upiReceiverName || 'Rajnish Study Education';

  const features =
    language === 'hi'
      ? plan?.featuresHi || [
          'सभी स्कूल व कॉलेज कक्षाएं (Class 6 से 12 एवं ग्रेजुएशन)',
          'सभी प्रतियोगी परीक्षाएं (SSC, Banking, Railway, UPSC, State PCS)',
          'असीमित वस्तुनिष्ठ प्रश्न (MCQ) एवं संपूर्ण मॉक टेस्ट सीरीज',
          'आधिकारिक थ्योरी नोट्स एवं सूत्र सारांश का A4 पीडीएफ डाउनलोड',
          'व्यक्तिगत नोट्स मेकर एवं क्लाउड सिंक',
          'लाइफ-टाइम वैलिडिटी एवं आगामी सभी अपडेट्स फ्री',
        ]
      : plan?.featuresEn || [
          'All School & College classes (Class 6 to 12 & Graduation)',
          'All Competitive Exams (SSC, Banking, Railway, UPSC, State PCS)',
          'Unlimited Chapter MCQs & Full-Length Mock Test Series',
          'Official Theory Notes & Formula Sheets Printable A4 PDF Downloads',
          'Personal Study Notes Maker with Cloud Backup',
          'Full Access to All Current & Upcoming Chapters Included',
        ];

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    const res = await unlockSubscription({
      amount: currentPrice,
      paymentMethod:
        paymentTab === 'upi_apps'
          ? `UPI (${selectedUpiApp.toUpperCase()})`
          : paymentTab === 'qr_code'
          ? 'UPI (QR Code Scan)'
          : 'Debit/Credit Card',
      utrNumber: utrNumber.trim() || undefined,
    });

    setIsProcessing(false);

    if (res.success) {
      setPaymentSuccess(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}

      setTimeout(() => {
        setPaymentSuccess(false);
        closeUpgradeModal();
      }, 2400);
    } else {
      setErrorMsg(res.error || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative my-auto">
        {/* Saffron gradient header trim */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentSuccess ? (
          /* Payment Success Confirmation Screen */
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.subscription.paymentSuccessTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              {t.subscription.paymentSuccessMsg}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>₹{currentPrice} {language === 'hi' ? 'भुगतान सफल' : 'Payment Verified'}</span>
            </div>
          </div>
        ) : (
          /* Main Checkout & Features Screen */
          <div className="p-5 sm:p-6 space-y-5">
            {/* Header Lock Info */}
            <div className="space-y-1.5 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.subscription.limitedTimeOffer} ({discountPercent}% OFF)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {language === 'hi'
                  ? plan?.titleHi || t.subscription.paidBatchTitle
                  : plan?.titleEn || t.subscription.paidBatchTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'hi' ? plan?.subtitleHi : plan?.subtitleEn}
              </p>
            </div>

            {/* Pricing Tag Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white flex items-center justify-between shadow-md">
              <div>
                <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
                  {language === 'hi' ? 'संपूर्ण ऑल-एक्सेस अनलॉक' : 'Complete All-Access Unlock'}
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
                    ₹{currentPrice}
                  </span>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ₹{originalPrice}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                    Save {discountPercent}%
                  </span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-300">
                <div className="flex items-center gap-1 font-semibold justify-end text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Safe</span>
                </div>
                <div>One-time fee</div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px]">
                {language === 'hi' ? 'पेड बैच में आपको क्या-क्या मिलेगा:' : "What's Included in Paid Batch:"}
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentTab('upi_apps')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                    paymentTab === 'upi_apps'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('qr_code')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                    paymentTab === 'qr_code'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('cards')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                    paymentTab === 'cards'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>

              {/* Tab 1: UPI Apps Selector */}
              {paymentTab === 'upi_apps' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'phonepe', name: 'PhonePe', color: 'border-purple-300 dark:border-purple-900' },
                    { id: 'gpay', name: 'Google Pay', color: 'border-blue-300 dark:border-blue-900' },
                    { id: 'paytm', name: 'Paytm UPI', color: 'border-cyan-300 dark:border-cyan-900' },
                    { id: 'bhim', name: 'BHIM UPI', color: 'border-emerald-300 dark:border-emerald-900' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        selectedUpiApp === app.id
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 font-bold ring-1 ring-amber-500 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs">{app.name}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab 2: Dynamic QR Code Scanner */}
              {paymentTab === 'qr_code' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  {/* Clean SVG QR Code Representation */}
                  <div className="w-36 h-36 mx-auto p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                      {/* Corner 2 */}
                      <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                      {/* Corner 3 */}
                      <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                      {/* Random Data Dots */}
                      <rect x="40" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="52" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="40" y="24" width="8" height="8" fill="currentColor" />
                      <rect x="45" y="45" width="12" height="12" rx="2" fill="#E65100" />
                      <rect x="10" y="45" width="8" height="8" fill="currentColor" />
                      <rect x="25" y="45" width="8" height="8" fill="currentColor" />
                      <rect x="68" y="45" width="8" height="8" fill="currentColor" />
                      <rect x="80" y="45" width="8" height="8" fill="currentColor" />
                      <rect x="40" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="55" y="75" width="8" height="8" fill="currentColor" />
                      <rect x="72" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="80" width="8" height="8" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    UPI ID: <span className="font-mono text-amber-600 dark:text-amber-400">{upiId}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {t.subscription.scanQRText}
                  </p>
                </div>
              )}

              {/* Tab 3: Card simulation */}
              {paymentTab === 'cards' && (
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    defaultValue="4111 •••• •••• 9926"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-mono text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="•••"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Optional UTR input */}
              <div>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder={t.subscription.enterUtrPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            {/* CTA Unlock Button */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold py-3.5 px-6 text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>
                {isProcessing
                  ? t.common.loading
                  : language === 'hi'
                  ? `मात्र ₹${currentPrice} भुगतान करें एवं अभी अनलॉक करें`
                  : `Pay ₹${currentPrice} & Unlock All Access Now`}
              </span>
            </button>

            <p className="text-[10px] text-center text-slate-400 font-medium">
              Instant activation · Secure 256-bit encrypted transaction · Verified by Rajnish Study
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
