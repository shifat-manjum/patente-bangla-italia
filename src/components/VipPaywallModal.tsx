import React from 'react';
import {
  Lock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  X,
  ShieldCheck
} from 'lucide-react';

interface VipPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockVip: () => void;
  questionsAnsweredCount: number;
}

export const VipPaywallModal: React.FC<VipPaywallModalProps> = ({
  isOpen,
  onClose,
  onUnlockVip,
  questionsAnsweredCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl bg-white space-y-6 overflow-hidden text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 p-0.5 mx-auto shadow-sm flex items-center justify-center text-[#FB6C00]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800">
            <Sparkles className="w-3.5 h-3.5 text-[#FB6C00]" />
            <span>ফ্রি ট্রায়াল সম্পন্ন ({questionsAnsweredCount} / 200 প্রশ্ন)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            সম্পূর্ণ ৭,১০০+ প্রশ্ন ও ২৪০টি রাউন্ড আনলক করুন!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            ইতালিয়ান ড্রাইভিং লাইসেন্স (Patente B) প্রথম চান্সে পাস করার জন্য যা যা প্রয়োজন—সবকিছু পেয়ে যান একসাথে।
          </p>
        </div>

        {/* VIP Benefits List */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            VIP মেম্বারশিপে আপনি যা পাবেন:
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>সম্পূর্ণ ৭,১০০+ অফিশিয়াল প্রশ্ন</strong>: প্রতিটি প্রশ্নের সহজ বাংলা অনুবাদ ও সঠিক যুক্তির ব্যাখ্যা।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>২৪০টি আনলকযোগ্য রাউন্ড</strong>: ধাপে ধাপে লেভেল পার হয়ে আসল পরীক্ষার জন্য প্রস্তুত হওয়ার সুবিধা।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>আনলিমিটেড মক টেস্ট</strong>: হুবহু মোটরিজ্জাসিওনে (Motorizzazione)-র ২০ মিনিটে ৩০ প্রশ্নের রিয়েল টাইমার এক্সাম।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>সব ট্রাফিক সাইনের ছবি ও অডিও</strong>: কঠিন শব্দের নির্ভুল ইতালিয়ান উচ্চারণ শুনতে পারবেন।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>স্পেশাল হোয়াটসঅ্যাপ স্টাডি হেল্প</strong>: কোনো প্রশ্ন না বুঝলে সরাসরি সাহায্য পাওয়ার সুবিধা।</span>
            </li>
          </ul>
        </div>

        {/* Pricing Box */}
        <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              এককালীন ফি (লাইফটাইম অ্যাক্সেস)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">€49</span>
              <span className="text-xs text-slate-400 line-through">€120</span>
              <span className="text-[11px] font-bold text-[#FB6C00] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                ৬০% ছাড়
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onUnlockVip}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>এখনই আনলক করুন (€49)</span>
          </button>
        </div>

        {/* Accepted Payment Badges */}
        <div className="space-y-2 text-center">
          <p className="text-[11px] text-slate-500">
            ইতালির যেকোনো পেমেন্ট মেথড গ্রহণ করা হয়:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">🟡 PostePay</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">💳 Carta di Credito</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">🅿️ PayPal</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">🔴 Satispay</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>নিরাপদ এসএসএল পেমেন্ট • ১০০% মানি ব্যাক গ্যারান্টি যদি ভালো না লাগে</span>
        </div>
      </div>
    </div>
  );
};
