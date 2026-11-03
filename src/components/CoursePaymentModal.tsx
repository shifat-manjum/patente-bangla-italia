import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Loader2,
  Tag,
  AlertCircle,
  Building2,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../services/paymentService';
import type { 
  SubscriptionPlanId, 
  PaymentMethodType, 
  PaymentFormData, 
  InvoiceRecord 
} from '../services/paymentService';
import { 
  getAppSettings, 
  SETTINGS_CHANGE_EVENT,
  validatePromoCode 
} from '../services/appSettingsService';
import type { PromoCodeItem } from '../services/appSettingsService';
import { WHATSAPP_SUPPORT_NUMBER } from '../config/constants';
import { trackInitiateCheckout } from '../utils/metaPixel';
import { trackPaymentStart } from '../services/analytics';
import { CarLogo } from './CarLogo';

interface CoursePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoice: InvoiceRecord) => void;
  initialStudent?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  attemptedRound?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
}

export const CoursePaymentModal: React.FC<CoursePaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess: _onSuccess,
  initialStudent,
  attemptedRound = 21,
}) => {
  const [appSettings, setAppSettings] = useState(() => getAppSettings());
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('3_months');
  const [showBillingInputs, setShowBillingInputs] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bonificoPendingSent, setBonificoPendingSent] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState<string>(() => {
    try {
      return localStorage.getItem('patente_referral_code') || '';
    } catch {
      return '';
    }
  });
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeItem | null>(() => {
    try {
      const savedRef = localStorage.getItem('patente_referral_code');
      return savedRef ? validatePromoCode(savedRef, getAppSettings()) : null;
    } catch {
      return null;
    }
  });
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Student Form Data
  const [formData, setFormData] = useState<PaymentFormData>({
    studentName: initialStudent?.name || '',
    studentEmail: initialStudent?.email || '',
    studentPhone: initialStudent?.phone || '+39 ',
    codiceFiscale: '',
    address: '',
    city: 'Bolzano',
    paymentMethod: 'card',
  });

  useEffect(() => {
    const handleSettingsChanged = (e: any) => {
      if (e?.detail) setAppSettings(e.detail);
    };
    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
  }, []);

  useEffect(() => {
    if (initialStudent) {
      setFormData((prev) => ({
        ...prev,
        studentName: prev.studentName || initialStudent.name || '',
        studentEmail: prev.studentEmail || initialStudent.email || '',
        studentPhone:
          prev.studentPhone && prev.studentPhone !== '+39 '
            ? prev.studentPhone
            : initialStudent.phone || '+39 ',
      }));
    }
  }, [initialStudent]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isProcessing]);

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const discountEur = appliedPromo ? Math.max(0, appliedPromo.discountEur || 0) : 0;
  const activePrice = Math.max(5, currentPlan.priceEur - discountEur);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('দয়া করে একটি প্রোমো বা রেফারেল কোড লিখুন।');
      return;
    }
    const matched = validatePromoCode(code, appSettings);
    if (!matched) {
      setAppliedPromo(null);
      setPromoError('এই প্রোমো বা রেফারেল কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ।');
      return;
    }
    setAppliedPromo(matched);
    setPromoInput(matched.code);
    try {
      localStorage.setItem('patente_referral_code', matched.code);
    } catch {}
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
    try {
      localStorage.removeItem('patente_referral_code');
    } catch {}
  };

  const handleSubmitPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanName = formData.studentName.trim();
    const cleanEmail = formData.studentEmail.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !cleanEmail.includes('@')) {
      setShowBillingInputs(true);
      setErrorMessage('দয়া করে আপনার নাম ও সঠিক ইমেইল প্রদান করুন (ইনভয়েস ও অ্যাক্সেস কনফার্মেশনের জন্য)।');
      return;
    }

    // Handle Bonifico Bancario via WhatsApp
    if (selectedMethod === 'bonifico') {
      setBonificoPendingSent(true);
      const waNumber = WHATSAPP_SUPPORT_NUMBER.replace(/[^0-9]/g, '');
      const promoLine = appliedPromo
        ? `🎁 Promo Code: ${appliedPromo.code} (-€${appliedPromo.discountEur})\n`
        : '';
      const waText = encodeURIComponent(
        `Ciao PatenteGuru! Ho scelto il pagamento tramite Bonifico Bancario per il piano: ${currentPlan.nameBn} (€${activePrice},00).\n\n` +
        `👤 Nome: ${cleanName}\n` +
        `📧 Email: ${cleanEmail}\n` +
        `📱 Telefono: ${formData.studentPhone.trim()}\n` +
        promoLine +
        `Invio qui la ricevuta (CRO/TRN) del bonifico per l'attivazione immediata del mio account.`
      );
      window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank', 'noopener,noreferrer');
      return;
    }

    setIsProcessing(true);

    try {
      trackPaymentStart(attemptedRound, activePrice);
      trackInitiateCheckout(activePrice, 'EUR', `Patente Guru ${currentPlan.nameBn}`);

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: cleanName,
          studentEmail: cleanEmail,
          studentPhone: formData.studentPhone.trim(),
          codiceFiscale: formData.codiceFiscale.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          planId: currentPlan.id,
          priceEur: activePrice,
          promoCode: appliedPromo?.code || '',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Stripe পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে।');
      }

      // Redirect student to Stripe official 256-bit SSL encrypted checkout
      window.location.href = data.url;
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto text-left"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-lg my-auto bg-white dark:bg-[#12161F] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Banner */}
        <div className="relative bg-gradient-to-r from-[#170E18] via-[#1a1215] to-[#1a150f] p-5 sm:p-6 text-white shrink-0 border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer disabled:opacity-50 z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB6C00] to-[#E73F1E] p-0.5 shadow-lg shadow-[#FB6C00]/30 shrink-0 flex items-center justify-center">
              <CarLogo size="sm" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FB6C00]/20 border border-[#FB6C00]/40 text-[#FB6C00] text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Patente Guru • Pro Pass</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                সম্পূর্ণ সিলেবাস ও প্রিমিয়াম মেম্বারশিপ
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                আপনার প্রয়োজন অনুযায়ী পছন্দের প্ল্যানটি বেছে নিন ও প্রথম প্রচেষ্টায় পাশের পূর্ণ প্রস্তুতি নিন।
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 3 Subscription Plan Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              প্ল্যান নির্বাচন করুন (Scegli il tuo piano):
            </label>

            {/* Plan 1: 1 Month (€11) */}
            <div
              onClick={() => setSelectedPlanId('1_month')}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between select-none ${
                selectedPlanId === '1_month'
                  ? 'border-[#FB6C00] bg-orange-50/70 dark:bg-[#FB6C00]/10 shadow-md ring-2 ring-[#FB6C00]/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                  selectedPlanId === '1_month'
                    ? 'bg-[#FB6C00] text-white shadow-md shadow-[#FB6C00]/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <span className="text-base leading-none">১</span>
                  <span className="text-[10px] font-bold opacity-90 leading-tight">মাস</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      ১ মাস মেম্বারশিপ পাস
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      ৩০ দিন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    দ্রুত প্রস্তুতি ও শেষ মুহূর্তের ফুল রিভিশনের জন্য
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    €11
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    €15
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">
                  €11 / মাস
                </span>
              </div>
            </div>

            {/* Plan 2: 3 Months (€30) - Highlighted Most Popular */}
            <div
              onClick={() => setSelectedPlanId('3_months')}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between select-none ${
                selectedPlanId === '3_months'
                  ? 'border-[#FB6C00] bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/70 dark:from-[#FB6C00]/15 dark:via-orange-950/20 dark:to-[#E73F1E]/15 shadow-lg shadow-[#FB6C00]/15 ring-2 ring-[#FB6C00]/50'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FB6C00] to-[#E73F1E] text-white text-[10px] font-black tracking-wide shadow-md shadow-[#FB6C00]/30 flex items-center gap-1">
                <span>🔥 সবচেয়ে জনপ্রিয় (Best Value)</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                  selectedPlanId === '3_months'
                    ? 'bg-gradient-to-br from-[#FB6C00] to-[#E73F1E] text-white shadow-md shadow-[#FB6C00]/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <span className="text-base leading-none">৩</span>
                  <span className="text-[10px] font-bold opacity-90 leading-tight">মাস</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      ৩ মাস সম্পূর্ণ কোর্স
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-[#FB6C00]/20 text-[#FB6C00] font-bold">
                      ৯০ দিন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ২৪০টি রাউন্ড শেষ করার পর্যাপ্ত সময় • সর্বাধিক সাশ্রয়ী
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-[#FB6C00] dark:text-[#FB6C00]">
                    €30
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    €45
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  মাত্র €10 / মাস
                </span>
              </div>
            </div>

            {/* Plan 3: Lifetime (€44) - Fino alla Patente */}
            <div
              onClick={() => setSelectedPlanId('lifetime')}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between select-none ${
                selectedPlanId === 'lifetime'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                  selectedPlanId === 'lifetime'
                    ? 'bg-gradient-to-br from-[#F9B637] to-[#FB6C00] text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <span className="text-xs font-black leading-none">VIP</span>
                  <span className="text-[9px] font-bold leading-tight">আজীবন</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      লাইফটাইম ভিআইপি পাস
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold">
                      Fino alla Patente
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    লাইসেন্স পাওয়ার আগ পর্যন্ত আনলিমিটেড • নো রিনিউয়াল ফি
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    €44
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    €99
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">
                  এককালীন পেমেন্ট
                </span>
              </div>
            </div>
          </div>

          {/* Patente Guru Value Inclusions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <GraduationCap className="w-4 h-4 text-[#FB6C00]" />
              <span>নির্বাচিত প্ল্যানে যা যা পাচ্ছেন:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px] pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>২৪০টি সম্পূর্ণ রাউন্ড (১-২৪০)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>৭,১৬৫টি অফিসিয়াল মিনিস্টেরিয়াল কুইজ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>নেটিভ ইতালিয়ান অডিও সিমুলেশন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ফাঁদ শব্দ ও ট্র্যাপ ব্যাংক (Trabocchetti)</span>
              </div>
            </div>
          </div>

          {/* Promo / Referral Code Box */}
          <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
            {!showPromoInput && !appliedPromo ? (
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="text-xs font-bold text-[#FB6C00] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>প্রোমো বা রেফারেল কোড আছে? (Codice Sconto)</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FB6C00]" />
                    <span>প্রোমো কোড (Codice Promo / Referral)</span>
                  </span>
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      সরান (Remove)
                    </button>
                  )}
                </div>

                {appliedPromo ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <span>
                      ✓ <strong>{appliedPromo.code}</strong> কোডে অতিরিক্ত <strong>€{appliedPromo.discountEur} ছাড়</strong> পেয়েছেন!
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      -€{appliedPromo.discountEur}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoError) setPromoError(null);
                      }}
                      placeholder="যেমন: FRIEND5 বা ITALIA10"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FB6C00]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FB6C00] hover:bg-[#e56000] text-white font-bold text-xs transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{promoError}</p>
                )}
              </div>
            )}
          </div>

          {/* Student Billing Inputs (for unregistered visitors) */}
          {(showBillingInputs || !formData.studentName || !formData.studentEmail) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  শিক্ষার্থীর বিবরণ (Student Details for Certificate & Invoice):
                </span>
                {formData.studentName && formData.studentEmail && (
                  <button
                    type="button"
                    onClick={() => setShowBillingInputs(!showBillingInputs)}
                    className="text-[11px] text-[#FB6C00] hover:underline"
                  >
                    {showBillingInputs ? 'লুকান' : 'পরিবর্তন'}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    সম্পূর্ণ নাম (Nome e Cognome)*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentName: e.target.value }))
                    }
                    placeholder="যেমন: Shifat Manjum"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    ইমেইল অ্যাড্রেস (Email Address)*
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.studentEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentEmail: e.target.value }))
                    }
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    WhatsApp মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentPhone: e.target.value }))
                    }
                    placeholder="+39 351 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Guarantee Pill */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold py-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>১৪ দিনের ১০০% সন্তুষ্টি ও মানি-ব্যাক গ্যারান্টি</span>
          </div>

          {/* Primary Action Button (Patente Guru Signature Gradient) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleSubmitPayment()}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FB6C00] via-[#E73F1E] to-[#FB6C00] hover:from-[#e56000] hover:to-[#c22d10] text-white font-black text-base shadow-xl shadow-[#FB6C00]/30 hover:shadow-[#FB6C00]/40 transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>সিকিউর পেমেন্টে সংযোগ হচ্ছে...</span>
                </>
              ) : (
                <span>কোর্স আনলক করুন • €{activePrice}</span>
              )}
            </button>
          </div>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-amber-600 dark:text-amber-400">
              🟡 PostePay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
              💳 Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400">
              🅿️ PayPal
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
              🍎 Apple Pay
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('bonifico');
                setShowBillingInputs(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1"
            >
              <Building2 className="w-3 h-3" />
              <span>Bonifico SEPA</span>
            </button>
          </div>

          {bonificoPendingSent && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-1">
              <p className="font-bold">✓ Bonifico রিকোয়েস্ট সফলভাবে হোয়াটসঅ্যাপে পাঠানো হয়েছে!</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                ব্যাংক ট্রান্সফারের রসিদ পাঠালে অ্যাডমিন সাথে সাথে কোর্স অ্যাক্টিভ করে দেবে।
              </p>
            </div>
          )}

          {/* Trust & Guarantee Disclaimers */}
          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1 leading-relaxed">
            <p className="flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Stripe 256-bit SSL এনক্রিপ্ট সিকিউর চেকআউট • অটোমেটিক ইনস্ট্যান্ট অ্যাক্টিভেশন</span>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              পেমেন্ট সম্পন্ন করার পর আপনার অফিশিয়াল ইনভয়েস রসিদ (Fattura) স্বয়ংক্রিয়ভাবে ডাউনলোডযোগ্য হবে।
            </p>
          </div>

          {/* Return / Close Link */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              বাতিল করুন ও ফ্রি প্র্যাকটিসে ফিরুন (Torna ai Quiz)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
