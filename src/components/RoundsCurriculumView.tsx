import React, { useState, useMemo, memo } from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  Search,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getRoundTopic } from '../data/roundCurriculumData';

interface RoundsCurriculumViewProps {
  currentRoundId: number;
  unlockedRound?: number;
  isVip?: boolean;
  freeRoundsLimit?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
  onSelectRound: (roundId: number) => void;
  onTriggerEnrollment: (roundId: number) => void;
  completedRounds?: Record<number, { errors: number; passed: boolean }>;
}

interface RoundItem {
  id: number;
  isFree: boolean;
  titleIt: string;
  titleBn: string;
  badgeIt: string;
  badgeBn: string;
  category: string;
  result?: { errors: number; passed: boolean };
}

interface RoundCardProps {
  round: RoundItem;
  isUnlocked: boolean;
  isCurrent: boolean;
  isPaidSyllabus: boolean;
  academyPriceEur: number;
  onSelectRound: (roundId: number) => void;
  onTriggerEnrollment: (roundId: number) => void;
}

const RoundCard = memo<RoundCardProps>(
  ({
    round,
    isUnlocked,
    isCurrent,
    isPaidSyllabus,
    academyPriceEur,
    onSelectRound,
    onTriggerEnrollment,
  }) => {
    const isPassed = round.result?.passed === true;

    return (
      <div
        className={`round-card-deferred rounded-2xl border p-5 relative flex flex-col justify-between min-h-[220px] ${
          isCurrent
            ? 'bg-white dark:bg-[#161C28] border-[#FB6C00]"'
            : isPassed
            ? 'bg-white dark:bg-[#12161F] border-emerald-500/35'
            : isUnlocked
            ? 'bg-white dark:bg-[#12161F] border-slate-200 dark:border-[#1E2638]'
            : 'bg-slate-50 dark:bg-[#0E121A] border-slate-200 dark:border-[#181F2E]'
        }`}
      >
        <div className="space-y-3">
          {/* Card Top Header: Round Pill & Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-[#FB6C00] text-white'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : round.isFree
                    ? 'bg-slate-100 text-slate-800 dark:bg-[#1C2333] dark:text-slate-200 border border-slate-200 dark:border-[#2A344B]'
                    : 'bg-slate-100 text-slate-600 dark:bg-[#161C28] dark:text-slate-400 border border-slate-200 dark:border-[#232C40]'
                }`}
              >
                {round.id < 10 ? `0${round.id}` : round.id}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-slate-200">
                Round #{round.id}
              </span>
            </div>

            {isPassed ? (
              <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{30 - (round.result?.errors ?? 0)}/৩০ পাস</span>
              </span>
            ) : isCurrent ? (
              <span className="flex items-center gap-1.5 text-[11px] font-black text-white bg-[#FB6C00] px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>রানিং রাউন্ড</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-black text-white bg-[#E52E2D] px-2.5 py-1 rounded-full">
                {!isUnlocked && <Lock className="w-3 h-3 text-white/90" />}
                <span>{round.isFree ? 'ফ্রি রাউন্ড' : 'পেইড রাউন্ড'}</span>
              </span>
            )}
          </div>

          {/* Card Title */}
          <div className="pt-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1C2333] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2A344B]">
                {round.badgeBn}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
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

          {/* Exam Specs */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10.5px] font-bold text-slate-600 dark:text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1C2333] border border-slate-200 dark:border-[#2A344B] text-slate-700 dark:text-slate-200">
              ৩০টি প্রশ্ন
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1C2333] border border-slate-200 dark:border-[#2A344B] text-slate-700 dark:text-slate-200">
              ২০ মিনিট
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1C2333] border border-slate-200 dark:border-[#2A344B] text-slate-700 dark:text-slate-200">
              সর্বোচ্চ ৩ ভুল
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#1E2638] mt-3">
          {isPaidSyllabus ? (
            <button
              type="button"
              onClick={() => onTriggerEnrollment(round.id)}
              className="w-full py-2.5 px-3 rounded-full bg-[#FB6C00] hover:bg-[#e55e00] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>একাডেমিতে ভর্তি হন (Iscriviti - €{academyPriceEur})</span>
            </button>
          ) : !isUnlocked ? (
            <button
              type="button"
              onClick={() =>
                alert(
                  `🔒 রাউন্ড #${round.id} এখনও আনলক হয়নি। দয়া করে প্রথমে পূর্ববর্তী রাউন্ড #${round.id - 1} সফলভাবে পাস করুন (সর্বোচ্চ ৩টি ভুল)।`
                )
              }
              className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#161C28] dark:hover:bg-[#1E2638] text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 dark:border-[#2A344B] cursor-pointer"
              title={`রাউন্ড #${round.id - 1} পাস করে আনলক করুন`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>রাউন্ড #{round.id - 1} পাস করে আনলক করুন</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectRound(round.id)}
              className={`w-full py-2.5 px-3 rounded-full font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                isPassed
                  ? 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-[#1C2333] dark:hover:bg-[#263044] dark:text-white border border-slate-700 dark:border-[#33415C]'
                  : 'bg-[#FB6C00] hover:bg-[#e55e00] text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
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
  }
);

RoundCard.displayName = 'RoundCard';

const ROUNDS_PER_PAGE = 36;

export const RoundsCurriculumView: React.FC<RoundsCurriculumViewProps> = ({
  currentRoundId: _currentRoundId,
  unlockedRound: _unlockedRound,
  isVip = false,
  freeRoundsLimit = 20,
  academyPriceEur = 49,
  regularPriceEur = 120,
  onSelectRound,
  onTriggerEnrollment,
  completedRounds = {},
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'free' | 'pro' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const effectiveFreeLimit = Math.min(240, Math.max(0, freeRoundsLimit));
  const totalRounds = 240;

  const safeCompleted = completedRounds || {};
  const effectiveUnlocked = useMemo(() => {
    let sequentialUnlocked = 1;
    while (safeCompleted[sequentialUnlocked]?.passed === true && sequentialUnlocked < totalRounds) {
      sequentialUnlocked++;
    }
    const keys = Object.keys(safeCompleted)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= totalRounds);
    if (keys.length === 0) return sequentialUnlocked;
    const highest = Math.max(...keys);
    const highestNext = safeCompleted[highest]?.passed ? Math.min(totalRounds, highest + 1) : highest;
    return Math.max(sequentialUnlocked, highestNext);
  }, [safeCompleted]);

  const rounds = useMemo<RoundItem[]>(() => {
    return Array.from({ length: totalRounds }, (_, i) => {
      const id = i + 1;
      const isFree = id <= effectiveFreeLimit;
      const result = safeCompleted[id];
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
  }, [effectiveFreeLimit, safeCompleted]);

  const filteredRounds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rounds.filter((r) => {
      if (filterTab === 'free' && !r.isFree) return false;
      if (filterTab === 'pro' && r.isFree) return false;
      if (filterTab === 'passed' && !r.result?.passed) return false;

      if (q) {
        const matchNum =
          String(r.id) === q ||
          `round ${r.id}`.includes(q) ||
          `রাউন্ড ${r.id}`.includes(q);
        const matchTopicIt =
          r.titleIt.toLowerCase().includes(q) ||
          (r.badgeIt && r.badgeIt.toLowerCase().includes(q));
        const matchTopicBn =
          r.titleBn.toLowerCase().includes(q) ||
          (r.badgeBn && r.badgeBn.toLowerCase().includes(q));
        return matchNum || matchTopicIt || matchTopicBn;
      }

      return true;
    });
  }, [rounds, filterTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRounds.length / ROUNDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const visibleRounds = useMemo(() => {
    const startIdx = (safePage - 1) * ROUNDS_PER_PAGE;
    return filteredRounds.slice(startIdx, startIdx + ROUNDS_PER_PAGE);
  }, [filteredRounds, safePage]);

  const freeRoundsCount = effectiveFreeLimit;
  const proRoundsCount = Math.max(0, totalRounds - effectiveFreeLimit);
  const passedCount = useMemo(
    () => Object.values(safeCompleted).filter((r) => r?.passed).length,
    [safeCompleted]
  );

  const handleFilterChange = (tab: 'all' | 'free' | 'pro' | 'passed') => {
    setFilterTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
            <GraduationCap className="w-4 h-4 text-white" />
            <span>অফিসিয়াল ইতালিয়ান ড্রাইভিং লাইসেন্স সিলেবাস (Corso Ufficiale)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ২৪০ রাউন্ডের সম্পূর্ণ সিলেবাস (240 Schede Quiz)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {effectiveFreeLimit === 0
              ? 'ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। একাডেমি মেম্বারশিপে সম্পূর্ণ ২৪০টি রাউন্ড আনলক থাকে।'
              : effectiveFreeLimit >= 240
              ? 'ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। সব ২৪০ রাউন্ড সবার জন্য উন্মুক্ত।'
              : `ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। ১ থেকে ${effectiveFreeLimit} রাউন্ড সবার জন্য সম্পূর্ণ ফ্রি।`}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              🟢 বর্তমান আনলক: <span className="text-white font-black">রাউন্ড #{effectiveUnlocked}</span>
            </div>
            {effectiveFreeLimit < 240 && (
              <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
                🎓 একাডেমি প্রো:{' '}
                <span className="text-slate-100 font-black">
                  রাউন্ড {effectiveFreeLimit + 1}–২৪০ (€{academyPriceEur}
                  {regularPriceEur > academyPriceEur ? ` / ছাড়ের পূর্বে €${regularPriceEur}` : ''} • পাস করা পর্যন্ত এক্সেস)
                </span>
              </div>
            )}
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              ✅ পাস করা রাউন্ড: <span className="text-white font-black">{passedCount} / ২৪০</span>
            </div>
            {!isVip && (
              <button
                type="button"
                onClick={() => onTriggerEnrollment(Math.max(effectiveUnlocked, effectiveFreeLimit + 1))}
                className="px-4 py-1.5 rounded-full bg-[#FB6C00] hover:bg-[#e55e00] text-white font-black text-xs cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span>💳 Pay Now (€{academyPriceEur}) / ভর্তি হন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pro Academy Enrollment Banner for Non-VIP students */}
      {!isVip && effectiveFreeLimit < 240 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12161F] border border-orange-500/30 text-slate-900 dark:text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FB6C00] flex items-center justify-center text-white shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                সম্পূর্ণ ২৪০টি রাউন্ড আনলক করতে চান?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                অফিসিয়াল একাডেমি প্রো মেম্বারশিপে লাইফটাইম এক্সেস, ৭,১৬৫টি কুইজ, অডিও উচ্চারণ ও আনলিমিটেড মক টেস্ট সুবিধা পান।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTriggerEnrollment(effectiveFreeLimit + 1)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FB6C00] hover:bg-[#e55e00] text-white font-black text-xs sm:text-sm shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-white" />
            <span>💳 Pay Now (€{academyPriceEur}) / এখনই ভর্তি হন</span>
          </button>
        </div>
      )}

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="রাউন্ড নম্বর বা অধ্যায় খুঁজুন (যেমন: Round 5, Precedenze, Segnali)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#1E2638] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#FB6C00]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `সব রাউন্ড (${totalRounds})` },
            { id: 'free', label: `ফ্রি রাউন্ড (${freeRoundsCount})` },
            { id: 'pro', label: `পেইড রাউন্ড (${proRoundsCount})` },
            { id: 'passed', label: `পাস হয়েছে (${passedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-[#FB6C00] text-white font-black'
                  : 'bg-white dark:bg-[#12161F] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181F2C] border border-slate-200 dark:border-[#1E2638]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Range Jump Bar (Keeps DOM ultra-lightweight at 36 cards/page for 120fps scrolling!) */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#12161F] p-3 rounded-2xl border border-slate-200 dark:border-[#1E2638]">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const startR = filteredRounds[(pageNum - 1) * ROUNDS_PER_PAGE]?.id ?? 1;
              const endR =
                filteredRounds[Math.min(filteredRounds.length - 1, pageNum * ROUNDS_PER_PAGE - 1)]
                  ?.id ?? totalRounds;
              const isActive = safePage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FB6C00] text-white'
                      : 'bg-slate-100 dark:bg-[#1A2130] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#232C40]'
                  }`}
                >
                  রাউন্ড {startR}–{endR}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#1A2130] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              title="Previous Rounds"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
              পৃষ্ঠা {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#1A2130] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              title="Next Rounds"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Rounds Grid (36 Memoized Cards per Page = Instant Render & 120Hz Smooth Scroll) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {visibleRounds.map((round) => {
          const isUnlocked = isVip || round.id <= effectiveUnlocked;
          const isCurrent = round.id === effectiveUnlocked;
          const isPaidSyllabus = round.id > effectiveFreeLimit && !isVip;

          return (
            <RoundCard
              key={round.id}
              round={round}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              isPaidSyllabus={isPaidSyllabus}
              academyPriceEur={academyPriceEur}
              onSelectRound={onSelectRound}
              onTriggerEnrollment={onTriggerEnrollment}
            />
          );
        })}
      </div>

      {/* Bottom Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#1E2638] text-xs font-black text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী রাউন্ড</span>
          </button>
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 px-3">
            পৃষ্ঠা {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-[#FB6C00] hover:bg-[#e55e00] text-xs font-black text-white disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            <span>পরবর্তী রাউন্ড</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
