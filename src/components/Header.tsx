import React from 'react';
import { Award, BookOpen, AlertCircle, BookmarkCheck, MapPin, Sparkles, ShieldCheck, Info, Flame } from 'lucide-react';

export type NavTab = 'rounds' | 'exam' | 'hotshot' | 'topics' | 'vocab' | 'mistakes' | 'admin';

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
    <header className="sticky top-0 z-50 w-full glass-box bg-[#110e10]/95 backdrop-blur-2xl border-b border-[#FFDD9C]/15 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top Line: Brand & VIP Upgrade Action */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E73F1E] via-[#FB6C00] to-[#F9B637] p-0.5 shadow-lg shadow-[#FB6C00]/30 shrink-0">
              <div className="w-full h-full bg-[#120f11] rounded-[14px] flex items-center justify-center text-sm font-black text-white">
                🇮🇹🇧🇩
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  Patente<span className="text-[#FB6C00]">Bangla</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#E73F1E]/20 text-[#FFDD9C] border border-[#FB6C00]/30">
                  PATENTE B 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                ইতালিয়ান ড্রাইভিং লাইসেন্স কুইজ বাংলা ব্যাখ্যা সহ
              </p>
            </div>
          </div>

          {/* Right Status / Paywall / About Us Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenAbout}
              className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="আমাদের সম্পর্কে ও প্রতিষ্ঠাতা"
            >
              <Info className="w-3.5 h-3.5 text-[#F9B637]" />
              <span className="hidden sm:inline">পরিচিতি</span>
            </button>
            {!isVip ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 block font-bold">ফ্রি ট্রায়াল কোটা</span>
                  <span className="text-xs font-black text-[#F9B637]">
                    {Math.min(200, totalQuestionsAnswered)} / 200 প্রশ্ন
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] text-slate-950 font-black text-xs shadow-lg shadow-[#FB6C00]/25 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>VIP আনলক (€49)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FB6C00]/20 border border-[#FB6C00]/30 text-[#FFDD9C] text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-[#F9B637]" />
                <span>VIP আনলকড (৭,১০০+ প্রশ্ন)</span>
              </div>
            )}
          </div>
        </div>

        {/* 6-Card Action Navigation */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {/* 1. Rounds Map (240 Rounds) */}
          <button
            onClick={() => setActiveTab('rounds')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'rounds'
                ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 shadow-[#FB6C00]/30 ring-2 ring-[#FFDD9C] scale-[1.02]'
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
                ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 shadow-[#FB6C00]/30 ring-2 ring-[#FFDD9C] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">মডেল টেস্ট</span>
              <span className="text-[10px] font-normal opacity-80 block">৩০ প্রশ্ন (২০ মি.)</span>
            </div>
          </button>

          {/* 3. Hotshot Exam Booster */}
          <button
            onClick={() => setActiveTab('hotshot')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'hotshot'
                ? 'bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] text-white shadow-[#E73F1E]/30 ring-2 ring-[#F9B637] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0 text-[#F9B637]" />
            <div className="text-left">
              <span className="block leading-tight text-[#FFDD9C]">🔥 হটশট ফাঁদ</span>
              <span className="text-[10px] font-normal opacity-80 block">সবচেয়ে কঠিন প্রশ্ন</span>
            </div>
          </button>

          {/* 4. Topics */}
          <button
            onClick={() => setActiveTab('topics')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'topics'
                ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 shadow-[#FB6C00]/30 ring-2 ring-[#FFDD9C] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">অধ্যায় অনুযায়ী</span>
              <span className="text-[10px] font-normal opacity-80 block">টপিক কুইজ</span>
            </div>
          </button>

          {/* 5. Vocabulary */}
          <button
            onClick={() => setActiveTab('vocab')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              activeTab === 'vocab'
                ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 shadow-[#FB6C00]/30 ring-2 ring-[#FFDD9C] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">শব্দার্থ ও অডিও</span>
              <span className="text-[10px] font-normal opacity-80 block">১২০+ শব্দকোষ</span>
            </div>
          </button>

          {/* 6. Mistakes */}
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`p-2 sm:p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md relative ${
              activeTab === 'mistakes'
                ? 'bg-gradient-to-r from-[#E73F1E] to-[#FB6C00] text-white shadow-[#E73F1E]/30 ring-2 ring-[#FFDD9C] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="leading-tight">ভুল প্রশ্ন</span>
                {mistakesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#E73F1E] text-white leading-tight">
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
