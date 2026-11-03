import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Loader2, 
  Tag, 
  AlertCircle,
  Building2,
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
      setPromoError('দয়া করে একটি প্রোমো বা রেফারেল কোড লিখুন।');
      return;
    }
    const matched = validatePromoCode(code, appSettings);
    if (!matched) {
      setAppliedPromo(null);
      setPromoError('এই প্রোমো বা রেফারেল কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ।');
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

    // Require student name & email
    const cleanName = formData.studentName.trim();
    const cleanEmail = formData.studentEmail.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !cleanEmail.includes('@')) {
      setShowBillingInputs(true);
      setErrorMessage('দয়া করে আপনার নাম ও সঠিক ইমেইল লিখুন (যেখানে পেমেন্ট কনফার্মেশন ও ইনভয়েস যাবে)।');
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
        throw new Error(data.error || 'Stripe পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে।');
      }

      // Redirect student to Stripe 256-bit SSL secure checkout
      window.location.href = data.url;
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md my-auto bg-[#0d131f] text-slate-100 rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-10 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4">
          
          {/* Mascot Car Header Illustration */}
          <div className="flex flex-col items-center justify-center text-center pt-2">
            <div className="relative mb-2">
              {/* Cute Yellow Car Mascot with Eyes */}
              <div className="w-20 h-14 bg-gradient-to-b from-[#ffd233] to-[#f59e0b] rounded-t-[28px] rounded-b-[18px] relative shadow-lg shadow-amber-500/20 border-2 border-[#fbbf24] flex items-center justify-center">
                {/* Windshield */}
                <div className="w-13 h-7 bg-[#60a5fa] rounded-t-[14px] rounded-b-[6px] border border-blue-300/40 relative overflow-hidden flex items-center justify-center gap-2">
                  {/* Cartoon Eye 1 */}
                  <div className="w-3.5 h-3.5 bg-white rounded-full relative flex items-center justify-center shadow-xs">
                    <div className="w-2 h-2 bg-[#1e293b] rounded-full translate-y-[-1px] translate-x-[1px]" />
                  </div>
                  {/* Cartoon Eye 2 */}
                  <div className="w-3.5 h-3.5 bg-white rounded-full relative flex items-center justify-center shadow-xs">
                    <div className="w-2 h-2 bg-[#1e293b] rounded-full translate-y-[-1px] translate-x-[1px]" />
                  </div>
                  {/* Glass Reflection */}
                  <div className="absolute top-0 right-1 w-2 h-5 bg-white/30 rotate-12" />
                </div>
                {/* Wheels */}
                <div className="absolute -bottom-2 -left-1 w-5 h-5 bg-slate-900 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
                <div className="absolute -bottom-2 -right-1 w-5 h-5 bg-slate-900 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
                {/* Headlights */}
                <div className="absolute bottom-2 left-1 w-2 h-2 bg-amber-200 rounded-full" />
                <div className="absolute bottom-2 right-1 w-2 h-2 bg-amber-200 rounded-full" />
              </div>

              {/* Floating Padlock Badge */}
              <div className="absolute -bottom-2 -right-3 w-7 h-7 rounded-full bg-[#1e293b] border-2 border-[#334155] text-blue-400 flex items-center justify-center shadow-md">
                <Lock className="w-3.5 h-3.5 text-blue-300" />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold tracking-tight text-white font-serif mt-2">
              এই অংশটা পুরো কোর্সে আছে
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-400 mt-1.5 max-w-xs leading-relaxed">
              ফ্রি ২১ দিনে রাউন্ড ১-২০ খোলা। বাকি সমস্ত রাউন্ড ও সম্পূর্ণ কোর্স পড়তে একটা Plan লাগবে।
            </p>

            {/* Founders Offer Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold mt-2.5">
              <span>✨ Founders অফার: বিশেষ ছাড়</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 3 Subscription Plan Cards */}
          <div className="space-y-3 pt-1">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const price = appliedPromo && isSelected ? activePrice : plan.priceEur;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center justify-between select-none ${
                    isSelected
                      ? 'border-[#0ea5e9] bg-[#0c1e30] shadow-lg shadow-cyan-500/10 ring-1 ring-[#0ea5e9]/50'
                      : 'border-slate-800 bg-[#111827]/70 hover:border-slate-700 hover:bg-[#111827]'
                  }`}
                >
                  {/* Most Popular Badge on 3-months card */}
                  {plan.popularBadgeBn && (
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#38bdf8] text-[#0f172a] text-[10px] font-black tracking-wide shadow-sm">
                      {plan.popularBadgeBn}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Left Duration Badge */}
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center text-cyan-400 shrink-0 leading-tight">
                      <span className="text-sm font-black">{plan.badgeNumberBn}</span>
                      <span className="text-[10px] font-bold text-slate-300">{plan.badgeUnitBn}</span>
                    </div>

                    {/* Price and Rate */}
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-white">
                          €{price}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          €{plan.regularPriceEur}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {plan.monthlyRateBn}
                      </p>
                    </div>
                  </div>

                  {/* Radio / Check Circle */}
                  <div className="shrink-0 pl-2">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#0ea5e9] flex items-center justify-center text-[#0f172a] shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-800/50" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo Code Toggle / Input */}
          <div className="pt-1">
            {!showPromoInput && !appliedPromo ? (
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>প্রোমো বা রেফারেল কোড আছে? (Promo Code)</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>প্রোমো / রেফারেল কোড</span>
                  </span>
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] font-bold text-rose-400 hover:underline cursor-pointer"
                    >
                      সরান
                    </button>
                  )}
                </div>

                {appliedPromo ? (
                  <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between">
                    <span>
                      ✓ <strong>{appliedPromo.code}</strong> কোডে €{appliedPromo.discountEur} ছাড় পেয়েছেন!
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
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
                      placeholder="যেমন: FRIEND5"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold uppercase text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-400 font-semibold">{promoError}</p>
                )}
              </div>
            )}
          </div>

          {/* Student Billing Input Fields (if not filled or toggled) */}
          {(showBillingInputs || !formData.studentName || !formData.studentEmail) && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">
                  শিক্ষার্থীর তথ্য (Student Info for Certificate & Invoice)
                </span>
                {formData.studentName && formData.studentEmail && (
                  <button
                    type="button"
                    onClick={() => setShowBillingInputs(!showBillingInputs)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {showBillingInputs ? 'লুকান' : 'পরিবর্তন'}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    সম্পূর্ণ নাম (Nome e Cognome)*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentName: e.target.value }))
                    }
                    placeholder="যেমন: Md Arif Hossain"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    ইমেইল অ্যাড্রেস (Email Address)*
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.studentEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentEmail: e.target.value }))
                    }
                    placeholder="arif@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    WhatsApp মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentPhone: e.target.value }))
                    }
                    placeholder="+39 351 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features Checklist */}
          <div className="space-y-1.5 text-center text-xs text-slate-300 pt-1">
            <p className="flex items-center justify-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>২৪০টি রাউন্ড • ৭,১৬৫টি কুইজ • সম্পূর্ণ বাংলা অর্থ ও অডিও</span>
            </p>
            <p className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>১৪ দিনের মধ্যে টাকা ফেরতের গ্যারান্টি</span>
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSubmitPayment()}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-black text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Stripe গেটওয়েতে সংযোগ হচ্ছে...</span>
                </>
              ) : (
                <span>পেমেন্ট করুন - €{activePrice}</span>
              )}
            </button>
          </div>

          {/* Accepted Payment Logos */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-amber-300 font-bold">
              🟡 PostePay
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 font-bold">
              💳 Carta / Visa
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-blue-400 font-bold">
              🅿️ PayPal
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-white font-bold">
              🍎 Apple Pay
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('bonifico');
                setShowBillingInputs(true);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-emerald-400 font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-1"
            >
              <Building2 className="w-3 h-3" />
              <span>Bonifico Bancario</span>
            </button>
          </div>

          {bonificoPendingSent && (
            <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs text-center space-y-1">
              <p className="font-bold">✓ Bonifico রিকোয়েস্ট সফলভাবে হোয়াটসঅ্যাপে পাঠানো হয়েছে!</p>
              <p className="text-[11px] text-emerald-400">
                ব্যাংক ট্রান্সফারের রসিদ পাঠালে অ্যাডমিন সাথে সাথে কোর্স অ্যাক্টিভ করে দেবে।
              </p>
            </div>
          )}

          {/* Legal / Policy Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 space-y-1 pt-1 leading-relaxed">
            <p>পেমেন্ট করলে আপনি মেনে নিচ্ছেন শর্তাবলি ও টাকা ফেরতের নীতি।</p>
            <p>PatenteGuru Autoscuola • Stripe 256-bit SSL সিকিউর পেমেন্ট ও অফিশিয়াল ইনভয়েস</p>
            <p className="text-slate-400 font-medium">সবসময় ফ্রি: রবিবারের সাপ্তাহিক Mock আর শব্দের অর্থ</p>
          </div>

          {/* Return to Home / Close */}
          <div className="text-center pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
            >
              Home-এ ফিরুন (ফ্রি প্র্যাকটিসে ব্যাক করুন)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
