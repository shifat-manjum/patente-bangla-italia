import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Search, 
  GraduationCap
} from 'lucide-react';
import { getRoundTopic } from '../data/roundCurriculumData';

interface RoundsCurriculumViewProps {
  currentRoundId: number;
  unlockedRound?: number;
  isVip?: boolean;
  onSelectRound: (roundId: number) => void;
  onTriggerEnrollment: (roundId: number) => void;
  completedRounds?: Record<number, { errors: number; passed: boolean }>;
}

export const RoundsCurriculumView: React.FC<RoundsCurriculumViewProps> = ({
  currentRoundId: _currentRoundId,
  unlockedRound: _unlockedRound,
  isVip = false,
  onSelectRound,
  onTriggerEnrollment,
  completedRounds = {},
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'free' | 'pro' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Total 240 rounds
  const totalRounds = 240;
  // Strict sequential unlock: round N+1 is unlocked only if rounds 1..N have been completed and passed.
  let sequentialUnlocked = 1;
  while (completedRounds[sequentialUnlocked]?.passed === true && sequentialUnlocked < totalRounds) {
    sequentialUnlocked++;
  }
  const effectiveUnlocked = sequentialUnlocked;

  const rounds = Array.from({ length: totalRounds }, (_, i) => {
    const id = i + 1;
    const isFree = id <= 20;
    const result = completedRounds[id];
    
    // Resolve unique official Italian and Bangla topic for every round 1 to 240
    const topic = getRoundTopic(id);

    return {
      id,
      isFree,
      titleIt: topic.titleIt,
      titleBn: topic.titleBn,
      badgeIt: topic.badgeIt,
      badgeBn: topic.badgeBn,
      category: topic.category,
      result,
    };
  });

  const filteredRounds = rounds.filter((r) => {
    if (filterTab === 'free' && !r.isFree) return false;
    if (filterTab === 'pro' && r.isFree) return false;
    if (filterTab === 'passed' && !r.result?.passed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = String(r.id) === q || `round ${r.id}`.includes(q) || `রাউন্ড ${r.id}`.includes(q);
      const matchTopicIt = r.titleIt.toLowerCase().includes(q) || (r.badgeIt && r.badgeIt.toLowerCase().includes(q));
      const matchTopicBn = r.titleBn.toLowerCase().includes(q) || (r.badgeBn && r.badgeBn.toLowerCase().includes(q));
      return matchNum || matchTopicIt || matchTopicBn;
    }

    return true;
  });

  const freeRoundsCount = 20;
  const passedCount = Object.values(completedRounds).filter(r => r.passed).length;

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Academic Banner (Adobe Mesh Ambient Style) */}
      <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E52E2D]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#FB6C00]/12 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
            <GraduationCap className="w-4 h-4 text-white" />
            <span>অফিসিয়াল ইতালিয়ান ড্রাইভিং লাইসেন্স সিলেবাস (Corso Ufficiale)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ২৪০ রাউন্ডের সম্পূর্ণ সিলেবাস (240 Schede Quiz)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। ১ থেকে ২০ রাউন্ড সবার জন্য সম্পূর্ণ ফ্রি।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              🟢 বর্তমান আনলক: <span className="text-white font-black">রাউন্ড #{effectiveUnlocked}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              🎓 একাডেমি প্রো: <span className="text-slate-100 font-black">রাউন্ড ২১–২৪০ (€৪৯ • পাস করা পর্যন্ত এক্সেস)</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              ✅ পাস করা রাউন্ড: <span className="text-white font-black">{passedCount} / ২৪০</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রাউন্ড নম্বর বা অধ্যায় খুঁজুন (যেমন: Round 5, Precedenze, Segnali)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/20 transition shadow-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `সব রাউন্ড (${totalRounds})` },
            { id: 'free', label: `ফ্রি ফাউন্ডেশন (${freeRoundsCount})` },
            { id: 'pro', label: `একাডেমি প্রো (২২০)` },
            { id: 'passed', label: `পাস হয়েছে (${passedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black shadow-md'
                  : 'bg-white dark:bg-[#12161F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#181F2C] border border-slate-200 dark:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modern 240 Rounds Grid (Clean Adaptive Cards with Italian First, then Bangla) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredRounds.map((round) => {
          const isPassed = round.result?.passed === true;
          // Sequential unlocking for ALL students (paid and unpaid):
          // A round is accessible only if it is at or below the student's highest reached unlocked round
          const isUnlocked = round.id <= effectiveUnlocked;
          const isCurrent = round.id === effectiveUnlocked;
          const isPaidSyllabus = round.id > 20 && !isVip;

          return (
            <div
              key={round.id}
              className={`rounded-2xl border p-5 sm:p-5.5 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl relative flex flex-col justify-between min-h-[225px] ${
                isCurrent
                  ? 'bg-white dark:bg-[#161C28] border-slate-900/30 dark:border-white/40 ring-2 ring-slate-900/20 dark:ring-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(229,46,45,0.25)]'
                  : isPassed
                  ? 'bg-white dark:bg-[#12161F] border-emerald-500/30 dark:border-white/20 hover:border-emerald-500/50 dark:hover:border-white/30 shadow-xs'
                  : isUnlocked
                  ? 'bg-white dark:bg-[#12161F] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 shadow-xs'
                  : 'bg-slate-50 dark:bg-[#0E121A] border-slate-200 dark:border-white/5 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Header: Round Pill & Live Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                        isCurrent
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : round.isFree
                          ? 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200 border border-slate-200 dark:border-white/15'
                          : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {round.id < 10 ? `0${round.id}` : round.id}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-slate-200">
                      Round #{round.id}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isPassed ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{30 - (round.result?.errors ?? 0)}/৩০ পাস</span>
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
                      <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span>{isPaidSyllabus ? '€৪৯ একাডেমি' : 'লক করা'}</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full border border-slate-300 dark:border-white/20 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#FB6C00] dark:bg-[#E52E2D]" />
                      <span>রানিং রাউন্ড</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
                      {round.isFree ? 'ফ্রি রাউন্ড' : 'প্রো সিলেবাস'}
                    </span>
                  )}
                </div>

                {/* Card Title: Category Badge + Italian First, then Bengali */}
                <div className="pt-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      {round.badgeBn}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      • {round.badgeIt}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-[17px] font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                    {round.titleIt}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-bold text-slate-600 dark:text-slate-300 pt-0.5 leading-snug">
                    {round.titleBn}
                  </p>
                </div>

                {/* Exam Specs (Bangla) */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    ৩০টি প্রশ্ন
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    ২০ মিনিট
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    সর্বোচ্চ ৩ ভুল
                  </span>
                </div>
              </div>

              {/* Action Button (Bangla & Italian) */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-3">
                {isPaidSyllabus ? (
                  <button
                    type="button"
                    onClick={() => onTriggerEnrollment(round.id)}
                    className="w-full py-2.5 px-3 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:opacity-90 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>একাডেমিতে ভর্তি হন (Iscriviti - €৪৯)</span>
                  </button>
                ) : !isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => alert(`🔒 রাউন্ড #${round.id} এখনও আনলক হয়নি। দয়া করে প্রথমে পূর্ববর্তী রাউন্ড #${round.id - 1} সফলভাবে পাস করুন (সর্বোচ্চ ৩টি ভুল)।`)}
                    className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 transition cursor-pointer"
                    title={`রাউন্ড #${round.id - 1} পাস করে আনলক করুন`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>রাউন্ড #{round.id - 1} পাস করে আনলক করুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectRound(round.id)}
                    className={`w-full py-2.5 px-3 rounded-full font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 ${
                      isCurrent
                        ? 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-md ring-2 ring-slate-900/20 dark:ring-white/30'
                        : isPassed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border border-slate-200 dark:border-white/20'
                        : 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isCurrent 
                        ? 'পরীক্ষা শুরু করুন (Inizia Round)' 
                        : isPassed 
                        ? 'আবার অনুশীলন করুন (Ripeti Quiz)' 
                        : 'কুইজ শুরু করুন (Inizia Round)'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
