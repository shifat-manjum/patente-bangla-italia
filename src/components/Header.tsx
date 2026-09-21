import React from 'react';
import { Award, BookOpen, AlertCircle, BookmarkCheck, MapPin, Sparkles, ShieldCheck, Info } from 'lucide-react';

export type NavTab = 'rounds' | 'exam' | 'topics' | 'vocab' | 'mistakes' | 'admin';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  mistakesCount: number;
  totalQuestionsAnswered: number;
  isVip: boolean;
  onOpenPaywall: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mistakesCount,
  totalQuestionsAnswered,
  isVip,
  onOpenPaywall,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-box bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top Line: Brand & VIP Upgrade Action */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-rose-600 p-0.5 shadow-lg shadow-emerald-500/25 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sm font-black text-white">
                🇮🇹🇧🇩
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  Patente<span className="text-emerald-400">Bangla</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PATENTE B 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                ইতালিয়ান ড্রাইভিং লাইসেন্স কুইজ বাংলা ব্যাখ্যা সহ
              </p>
            </div>
          </div>

          {/* Right Status / Paywall / About Us Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenAbout}
              className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="আমাদের সম্পর্কে ও প্রতিষ্ঠাতা"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">পরিচিতি</span>
            </button>
            {!isVip ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 block font-bold">ফ্রি ট্রায়াল কোটা</span>
                  <span className="text-xs font-black text-emerald-400">
                    {Math.min(200, totalQuestionsAnswered)} / 200 প্রশ্ন
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-400/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>VIP আনলক (€49)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                <ShieldCheck className="w-4 h-4" />
                <span>VIP আনলকড (৭,১০০+ প্রশ্ন)</span>
              </div>
            )}
          </div>
        </div>

        {/* 5-Card Action Navigation */}
        <nav className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {/* 1. Rounds Map (240 Rounds) */}
          <button
            onClick={() => setActiveTab('rounds')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'rounds'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">ধাপে ধাপে রাউন্ড</span>
              <span className="text-[10px] font-normal opacity-80 block">২৪০টি লেভেল</span>
            </div>
          </button>

          {/* 2. Mock Exam */}
          <button
            onClick={() => setActiveTab('exam')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">মডেল টেস্ট</span>
              <span className="text-[10px] font-normal opacity-80 block">৩০ প্রশ্ন (২০ মি.)</span>
            </div>
          </button>

          {/* 3. Topics */}
          <button
            onClick={() => setActiveTab('topics')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'topics'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">অধ্যায় অনুযায়ী</span>
              <span className="text-[10px] font-normal opacity-80 block">টপিক কুইজ</span>
            </div>
          </button>

          {/* 4. Vocabulary */}
          <button
            onClick={() => setActiveTab('vocab')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'vocab'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">শব্দার্থ ও অডিও</span>
              <span className="text-[10px] font-normal opacity-80 block">কঠিন শব্দকোষ</span>
            </div>
          </button>

          {/* 5. Mistakes */}
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md relative col-span-2 sm:col-span-1 ${
              activeTab === 'mistakes'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-500/25 ring-2 ring-rose-400 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="leading-tight">ভুল প্রশ্ন ব্যাংক</span>
                {mistakesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white leading-tight">
                    {mistakesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-normal opacity-80 block">রিভিশন দিন</span>
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
};
