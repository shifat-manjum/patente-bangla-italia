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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top Line: Brand & VIP Upgrade Action */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E73F1E] via-[#FB6C00] to-[#F9B637] p-0.5 shadow-md shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sm font-black text-slate-900 shadow-inner">
                🇮🇹🇧🇩
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                  Patente<span className="text-[#FB6C00]">Bangla</span>
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-orange-50 text-[#FB6C00] border border-orange-200">
                  AUTOSCUOLA 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                ইতালিয়ান ড্রাইভিং লাইসেন্স স্কুল কুইজ • সহজ বাংলা ব্যাখ্যা ও অডিও
              </p>
            </div>
          </div>

          {/* Right Status / Paywall / About Us Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenAbout}
              className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="আমাদের সম্পর্কে ও প্রতিষ্ঠাতা"
            >
              <Info className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span className="hidden sm:inline">পরিচিতি</span>
            </button>
            {!isVip ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-500 block font-bold">ফ্রি ট্রায়াল কোটা</span>
                  <span className="text-xs font-black text-[#FB6C00]">
                    {Math.min(200, totalQuestionsAnswered)} / 200 প্রশ্ন
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-white font-black text-xs shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current text-white" />
                  <span>VIP আনলক (€49)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              activeTab === 'rounds'
                ? 'bg-[#FB6C00] text-white shadow-orange-500/20 ring-2 ring-orange-200 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none text-[11px] sm:text-xs">২৪০ রাউন্ড</span>
              <span className="text-[9px] opacity-80 block leading-tight font-normal">240 Round</span>
            </div>
          </button>

          {/* 2. Official Exam Simulator */}
          <button
            onClick={() => setActiveTab('exam')}
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              activeTab === 'exam'
                ? 'bg-[#FB6C00] text-white shadow-orange-500/20 ring-2 ring-orange-200 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none text-[11px] sm:text-xs">সিমুলেশন টেস্ট</span>
              <span className="text-[9px] opacity-80 block leading-tight font-normal">Esame Ufficiale</span>
            </div>
          </button>

          {/* 3. Hotshot Trap Exam (Trabocchetti) */}
          <button
            onClick={() => setActiveTab('hotshot')}
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              activeTab === 'hotshot'
                ? 'bg-[#FB6C00] text-white shadow-orange-500/20 ring-2 ring-orange-200 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0 text-[#E73F1E]" />
            <div className="text-left">
              <span className="block leading-none text-[11px] sm:text-xs">হটশট ফাঁদ প্রশ্ন</span>
              <span className="text-[9px] opacity-80 block leading-tight font-normal">Trabocchetti</span>
            </div>
          </button>

          {/* 4. Topic Practice (By Chapter) */}
          <button
            onClick={() => setActiveTab('topics')}
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              activeTab === 'topics'
                ? 'bg-[#FB6C00] text-white shadow-orange-500/20 ring-2 ring-orange-200 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none text-[11px] sm:text-xs">টপিক কুইজ</span>
              <span className="text-[9px] opacity-80 block leading-tight font-normal">Per Argomento</span>
            </div>
          </button>

          {/* 5. Vocabulary & Pronunciation */}
          <button
            onClick={() => setActiveTab('vocab')}
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              activeTab === 'vocab'
                ? 'bg-[#FB6C00] text-white shadow-orange-500/20 ring-2 ring-orange-200 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none text-[11px] sm:text-xs">শব্দকোষ ও অডিও</span>
              <span className="text-[9px] opacity-80 block leading-tight font-normal">Dizionario Audio</span>
            </div>
          </button>

          {/* 6. Mistakes Bank */}
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`p-2 sm:p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer relative shadow-sm ${
              activeTab === 'mistakes'
                ? 'bg-[#FB6C00] text-white shadow-orange-500/20 ring-2 ring-orange-200 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none text-[11px] sm:text-xs">ভুল প্রশ্ন ব্যাংক</span>
              <span className="text-[9px] opacity-80 block leading-tight font-normal">I Miei Errori</span>
            </div>
            {mistakesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#E73F1E] text-white shadow-sm">
                {mistakesCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
