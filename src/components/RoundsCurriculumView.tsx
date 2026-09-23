import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Search, 
  GraduationCap
} from 'lucide-react';

interface RoundsCurriculumViewProps {
  currentRoundId: number;
  unlockedRound?: number;
  isVip?: boolean;
  onSelectRound: (roundId: number) => void;
  onTriggerEnrollment: (roundId: number) => void;
  completedRounds?: Record<number, { errors: number; passed: boolean }>;
}

// 20 Foundation Rounds with Specific Italian Titles and Bengali Translations
const FOUNDATION_ROUND_TOPICS: Record<number, { titleIt: string; titleBn: string }> = {
  1: { titleIt: 'Segnali di Pericolo Base', titleBn: 'বিপদজনক ট্রাফিক সংকেত' },
  2: { titleIt: 'Precedenze e Regola STOP', titleBn: 'স্টপ ও ডানদিকের অগ্রাধিকার' },
  3: { titleIt: 'Limiti di Velocità e Frenata', titleBn: 'গতিসীমা ও ব্রেকিং দূরত্ব' },
  4: { titleIt: 'Norme di Sosta e Fermata', titleBn: 'পার্কিং ও সাময়িক থামা' },
  5: { titleIt: 'Sorpasso in Curva e Dosso', titleBn: 'ওভারটেকিং ও বাঁকের নিয়ম' },
  6: { titleIt: 'Rotatorie, Tram e Binari', titleBn: 'গোলচত্বর ও ট্রাম অগ্রাধিকার' },
  7: { titleIt: 'Segnali di Obbligo Ministeriali', titleBn: 'বাধ্যতামূলক ট্রাফিক সংকেত' },
  8: { titleIt: 'Segnali di Divieto Ministeriali', titleBn: 'নিষেধাজ্ঞামূলক ট্রাফিক সংকেত' },
  9: { titleIt: 'Circolazione su Autostrade', titleBn: 'হাইওয়ে (Autostrada) নিয়মাবলি' },
  10: { titleIt: 'Uso dei Fari e Visibilità', titleBn: 'হেডলাইট ও দৃশ্যমানতার নিয়ম' },
  11: { titleIt: 'Guida in Stato di Ebbrezza e Punti', titleBn: 'অ্যালকোহল, ড্রাগস ও লাইসেন্স পয়েন্ট' },
  12: { titleIt: 'Primo Soccorso Stradale', titleBn: 'জরুরি প্রাথমিক চিকিৎসা ও দুর্ঘটনা' },
  13: { titleIt: 'Meccanica, Motore e Freni', titleBn: 'গাড়ির ইঞ্জিন, ব্রেক ও মেকানিক্স' },
  14: { titleIt: 'Ordine di Precedenza agli Incroci', titleBn: 'ট্রাফিক মোড়ে ক্রসিংয়ের ক্রম' },
  15: { titleIt: 'Guida Ecologica e Sicurezza Attiva', titleBn: 'পরিবেশবান্ধব ও নিরাপদ ড্রাইভিং' },
  16: { titleIt: 'Segnaletica Orizzontale e Semafori', titleBn: 'রাস্তার সাদা-হলুদ দাগ ও ট্রাফিক লাইট' },
  17: { titleIt: 'Pannelli Integrativi dei Segnali', titleBn: 'সম্পূরক সাইনবোর্ড ও ফলক' },
  18: { titleIt: 'Cinture di Sicurezza, Airbag e Casco', titleBn: 'সিটবেল্ট, এয়ারব্যাগ ও হেলমেট' },
  19: { titleIt: 'Patenti di Guida, Categorie ed Età', titleBn: 'লাইসেন্স ক্যাটাগরি ও নবাগতদের নিয়ম' },
  20: { titleIt: 'Simulazione Finale dei 20 Round', titleBn: 'ফাউন্ডেশন গ্র্যান্ড ফাইনাল মক টেস্ট' },
};

// Generator for Pro Syllabus Rounds 21 to 240
const getProRoundTopic = (roundId: number): { titleIt: string; titleBn: string } => {
  if (roundId <= 40) {
    return {
      titleIt: `Precedenze e Incroci Stradali - Scheda #${roundId}`,
      titleBn: 'অগ্রাধিকারের জটিল নিয়ম ও চৌরাস্তা',
    };
  } else if (roundId <= 60) {
    return {
      titleIt: `Segnali di Divieto Ministeriali - Scheda #${roundId}`,
      titleBn: 'নিষেধাজ্ঞামূলক ট্রাফিক সংকেত',
    };
  } else if (roundId <= 80) {
    return {
      titleIt: `Segnali di Obbligo e Precedenza - Scheda #${roundId}`,
      titleBn: 'বাধ্যতামূলক নির্দেশ ও ট্রাফিক সাইন',
    };
  } else if (roundId <= 100) {
    return {
      titleIt: `Velocità e Distanza di Sicurezza - Scheda #${roundId}`,
      titleBn: 'গতি নিয়ন্ত্রণ ও নিরাপদ দূরত্ব',
    };
  } else if (roundId <= 120) {
    return {
      titleIt: `Norme di Sorpasso e Circolazione - Scheda #${roundId}`,
      titleBn: 'ওভারটেকিং ও সঠিক লেনে চলাচলের নিয়ম',
    };
  } else if (roundId <= 140) {
    return {
      titleIt: `Sosta, Fermata e Dispositivi - Scheda #${roundId}`,
      titleBn: 'পার্কিং, সাময়িক থামা ও লাইটের ব্যবহার',
    };
  } else if (roundId <= 160) {
    return {
      titleIt: `Autostrade e Strade Extraurbane - Scheda #${roundId}`,
      titleBn: 'হাইওয়ে, এক্সপ্রেসওয়ে ও জরুরি লেন',
    };
  } else if (roundId <= 180) {
    return {
      titleIt: `Sicurezza Attiva e Passiva - Scheda #${roundId}`,
      titleBn: 'নিরাপত্তা ব্যবস্থা, হেলমেট ও সিটবেল্ট',
    };
  } else if (roundId <= 200) {
    return {
      titleIt: `Primo Soccorso ed Emergenze - Scheda #${roundId}`,
      titleBn: 'দুর্ঘটনায় প্রাথমিক চিকিৎসা ও সতর্কতা',
    };
  } else if (roundId <= 220) {
    return {
      titleIt: `Meccanica del Veicolo e Patente - Scheda #${roundId}`,
      titleBn: 'গাড়ির ব্রেক, টায়ার, ডকুমেন্টস ও লাইসেন্স',
    };
  } else {
    return {
      titleIt: `Scheda Ministeriale Master - Scheda #${roundId}`,
      titleBn: 'মন্ত্রণালয়ের অফিশিয়াল মাস্টার পরীক্ষা',
    };
  }
};

export const RoundsCurriculumView: React.FC<RoundsCurriculumViewProps> = ({
  currentRoundId,
  unlockedRound = 1,
  isVip = false,
  onSelectRound,
  onTriggerEnrollment,
  completedRounds = {},
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'free' | 'pro' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Total 240 rounds
  const totalRounds = 240;
  const effectiveUnlocked = unlockedRound ?? currentRoundId ?? 1;

  const rounds = Array.from({ length: totalRounds }, (_, i) => {
    const id = i + 1;
    const isFree = id <= 20;
    const result = completedRounds[id];
    
    // Resolve Italian and Bangla topic
    const topic = id <= 20 ? FOUNDATION_ROUND_TOPICS[id] : getProRoundTopic(id);

    return {
      id,
      isFree,
      titleIt: topic.titleIt,
      titleBn: topic.titleBn,
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
      const matchTopicIt = r.titleIt.toLowerCase().includes(q);
      const matchTopicBn = r.titleBn.toLowerCase().includes(q);
      return matchNum || matchTopicIt || matchTopicBn;
    }

    return true;
  });

  const freeRoundsCount = 20;
  const passedCount = Object.values(completedRounds).filter(r => r.passed).length;

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/30 text-xs font-bold text-blue-200">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>অফিসিয়াল ইতালিয়ান ড্রাইভিং লাইসেন্স সিলেবাস (Corso Ufficiale)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            ২৪০ রাউন্ডের সম্পূর্ণ সিলেবাস (240 Schede Quiz)
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। ১ থেকে ২০ রাউন্ড সবার জন্য সম্পূর্ণ ফ্রি।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              🟢 বর্তমান আনলক: <span className="text-emerald-300">রাউন্ড #{effectiveUnlocked}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              🎓 একাডেমি প্রো: <span className="text-blue-300">রাউন্ড ২১–২৪০ (লাইফটাইম €৪৯)</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              ✅ পাস করা রাউন্ড: <span className="text-amber-300">{passedCount} / ২৪০</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রাউন্ড নম্বর বা অধ্যায় খুঁজুন (যেমন: Round 5, Precedenze, Segnali)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modern 240 Rounds Grid (Redesigned UI Cards with Italian First, then Bangla) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredRounds.map((round) => {
          const isPassed = round.result?.passed === true;
          const isUnlocked = round.id <= effectiveUnlocked || (isVip && round.id <= 240);
          const isCurrent = round.id === effectiveUnlocked;
          const isPaidSyllabus = round.id > 20 && !isVip;

          return (
            <div
              key={round.id}
              className={`rounded-2xl border p-5 sm:p-5.5 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative flex flex-col justify-between min-h-[225px] ${
                isCurrent
                  ? 'bg-gradient-to-b from-blue-50/95 to-white dark:from-blue-950/40 dark:to-slate-900 border-blue-400 dark:border-blue-500 ring-2 ring-blue-400/30 shadow-md'
                  : isPassed
                  ? 'bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-900 border-emerald-300 dark:border-emerald-800 hover:border-emerald-400'
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs'
                  : 'bg-slate-50/90 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 opacity-90'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Header: Round Pill & Live Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : round.isFree
                          ? 'bg-slate-900 dark:bg-slate-700 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {round.id < 10 ? `0${round.id}` : round.id}
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      Round #{round.id}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isPassed ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{30 - (round.result?.errors ?? 0)}/৩০ পাস</span>
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/80 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                      <Lock className="w-3 h-3" />
                      <span>{isPaidSyllabus ? '€৪৯ একাডেমি' : 'লক করা'}</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/70 px-2.5 py-1 rounded-lg border border-blue-300 dark:border-blue-800 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>রানিং রাউন্ড</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {round.isFree ? 'ফ্রি রাউন্ড' : 'প্রো সিলেবাস'}
                    </span>
                  )}
                </div>

                {/* Card Title: Italian First, then Bengali */}
                <div className="pt-1">
                  <h3 className="text-base sm:text-[17px] font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                    {round.titleIt}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-bold text-blue-600 dark:text-blue-400 pt-1 leading-snug">
                    {round.titleBn}
                  </p>
                </div>

                {/* Exam Specs (Bangla) */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80">
                    ৩০টি প্রশ্ন
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80">
                    ২০ মিনিট
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80">
                    সর্বোচ্চ ৩ ভুল
                  </span>
                </div>
              </div>

              {/* Action Button (Bangla & Italian) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-3">
                {isPaidSyllabus ? (
                  <button
                    type="button"
                    onClick={() => onTriggerEnrollment(round.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>একাডেমিতে ভর্তি হন (Iscriviti - €৪৯)</span>
                  </button>
                ) : !isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => alert(`🔒 রাউন্ড #${round.id} এখনও আনলক হয়নি। দয়া করে প্রথমে পূর্ববর্তী রাউন্ড #${round.id - 1} সফলভাবে পাস করুন (সর্বোচ্চ ৩টি ভুল)।`)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    title={`রাউন্ড #${round.id - 1} পাস করে আনলক করুন`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>রাউন্ড #{round.id - 1} পাস করে আনলক করুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectRound(round.id)}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95 ${
                      isCurrent
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 ring-2 ring-blue-300 dark:ring-blue-800'
                        : isPassed
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
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
