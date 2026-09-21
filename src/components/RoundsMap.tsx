import React from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Play,
  Award,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Flag
} from 'lucide-react';

export interface RoundInfo {
  id: number;
  titleBn: string;
  titleIt: string;
  topicBadgeBn: string;
  topicBadgeIt: string;
  questionsCount: number;
  isFree: boolean;
}

// Generate the 240 rounds structure with bilingual badges & balanced titles
export const ALL_ROUNDS: RoundInfo[] = [
  {
    id: 1,
    titleBn: 'রাউন্ড ১: বিপদজনক ট্রাফিক সংকেত',
    titleIt: 'Round 1: Segnali di Pericolo Base',
    topicBadgeBn: '⚠️ সংকেত',
    topicBadgeIt: 'Segnali di Pericolo',
    questionsCount: 30,
    isFree: true,
  },
  {
    id: 2,
    titleBn: 'রাউন্ড ২: স্টপ ও ডানদিকের অগ্রাধিকার',
    titleIt: 'Round 2: Precedenze e Regola STOP',
    topicBadgeBn: '🛑 অগ্রাধিকার',
    topicBadgeIt: 'Precedenze e Incroci',
    questionsCount: 30,
    isFree: true,
  },
  {
    id: 3,
    titleBn: 'রাউন্ড ৩: গতিসীমা ও ব্রেকিং দূরত্ব',
    titleIt: 'Round 3: Limiti di Velocità e Frenata',
    topicBadgeBn: '⭕ গতিসীমা',
    topicBadgeIt: 'Limiti di Velocità',
    questionsCount: 30,
    isFree: true,
  },
  {
    id: 4,
    titleBn: 'রাউন্ড ৪: পার্কিং ও সাময়িক থামা',
    titleIt: 'Round 4: Norme di Sosta e Fermata',
    topicBadgeBn: '🚫 পার্কিং',
    topicBadgeIt: 'Sosta e Fermata',
    questionsCount: 30,
    isFree: true,
  },
  {
    id: 5,
    titleBn: 'রাউন্ড ৫: ওভারটেকিং ও বাঁকের নিয়ম',
    titleIt: 'Round 5: Sorpasso in Curva e Dosso',
    topicBadgeBn: '⛔ ওভারটেক',
    topicBadgeIt: 'Regole sul Sorpasso',
    questionsCount: 30,
    isFree: true,
  },
  {
    id: 6,
    titleBn: 'রাউন্ড ৬: গোলচত্বর ও ট্রাম অগ্রাধিকার',
    titleIt: 'Round 6: Rotatorie, Tram e Binari',
    topicBadgeBn: '🚊 ট্রাম ও মোড়',
    topicBadgeIt: 'Rotatorie e Tram',
    questionsCount: 30,
    isFree: true,
  },
  {
    id: 7,
    titleBn: 'রাউন্ড ৭: ফ্রি ট্রায়াল ফাইনাল টেস্ট (২০০ প্রশ্ন)',
    titleIt: 'Round 7: Test di Sbarramento Finale',
    topicBadgeBn: '🎯 ফাইনাল মক',
    topicBadgeIt: 'Esame di Prova',
    questionsCount: 20,
    isFree: true,
  },

  // VIP Rounds (Rounds 8 to 240)
  {
    id: 8,
    titleBn: 'রাউন্ড ৮: বাধ্যতামূলক ট্রাফিক সংকেত',
    titleIt: 'Round 8: Segnali di Obbligo Ministeriali',
    topicBadgeBn: '🔵 সংকেত',
    topicBadgeIt: 'Segnali di Obbligo',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 9,
    titleBn: 'রাউন্ড ৯: হাইওয়ে (Autostrada) নিয়মাবলি',
    titleIt: 'Round 9: Circolazione su Autostrade',
    topicBadgeBn: '🛣️ হাইওয়ে',
    topicBadgeIt: 'Autostrade e Tangenziali',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 10,
    titleBn: 'রাউন্ড ১০: হেডলাইট ও কুয়াশার বাতির ব্যবহার',
    titleIt: 'Round 10: Uso dei Fari e Visibilità',
    topicBadgeBn: '💡 বাতি ও দৃশ্যমানতা',
    topicBadgeIt: 'Uso dei Fari e Dispositivi',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 11,
    titleBn: 'রাউন্ড ১১: অ্যালকোহল, ড্রাগস ও জরিমানা',
    titleIt: 'Round 11: Guida in Stato di Ebbrezza e Punti',
    topicBadgeBn: '🍷 জরিমানা ও পয়েন্ট',
    topicBadgeIt: 'Alcol, Droga e Punti Patente',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 12,
    titleBn: 'রাউন্ড ১২: প্রাথমিক চিকিৎসা ও দুর্ঘটনা',
    titleIt: 'Round 12: Primo Soccorso Stradale e Urgenze',
    topicBadgeBn: '🚑 ফার্স্ট এইড',
    topicBadgeIt: 'Primo Soccorso e Emergenze',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 13,
    titleBn: 'রাউন্ড ১৩: গাড়ির ইঞ্জিন ও যান্ত্রিক পার্টস',
    titleIt: 'Round 13: Meccanica, Motore e Freni',
    topicBadgeBn: '⚙️ যান্ত্রিক পার্টস',
    topicBadgeIt: 'Dispositivi del Veicolo',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 14,
    titleBn: 'রাউন্ড ১৪: ট্রাফিক মোড়ে গাড়ির ক্রসিং ক্রম',
    titleIt: 'Round 14: Ordine di Precedenza agli Incroci',
    topicBadgeBn: '🚸 মোড়ের ক্রম',
    topicBadgeIt: 'Incroci Complessi',
    questionsCount: 30,
    isFree: false,
  },
  {
    id: 15,
    titleBn: 'রাউন্ড ১৫: পরিবেশবান্ধব ও নিরাপদ ড্রাইভিং',
    titleIt: 'Round 15: Guida Ecologica e Sicurezza Attiva',
    topicBadgeBn: '🌿 পরিবেশ ও সুরক্ষা',
    topicBadgeIt: 'Ambiente e Inquinamento',
    questionsCount: 30,
    isFree: false,
  },
  // Full database simulation for rounds 16 to 240
  {
    id: 16,
    titleBn: 'রাউন্ড ১৬ - ২৪০: সম্পূর্ণ ২৩৫টি ফুল মক টেস্ট',
    titleIt: 'Round 16 - 240: Tutti i 7.100+ Quiz Ministeriali',
    topicBadgeBn: '👑 সম্পূর্ণ কুইজ ব্যাংক',
    topicBadgeIt: 'Tutti i 240 Round Ufficiali',
    questionsCount: 6800,
    isFree: false,
  },
];

interface RoundsMapProps {
  unlockedRound: number;
  completedRounds: Record<number, { errors: number; passed: boolean }>;
  onStartRound: (roundId: number) => void;
  onOpenPaywall: () => void;
  isVip: boolean;
  totalQuestionsAnswered: number;
}

export const RoundsMap: React.FC<RoundsMapProps> = ({
  unlockedRound,
  completedRounds,
  onStartRound,
  onOpenPaywall,
  isVip,
  totalQuestionsAnswered,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
      {/* Top Progression Banner */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#FB6C00]/30 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#E73F1E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E73F1E]/15 border border-[#FB6C00]/30 text-xs font-black text-[#FFDD9C]">
              <Award className="w-4 h-4 text-[#F9B637]" />
              <span>ধাপে ধাপে পাস করার রোডম্যাপ • Mappa dei 240 Round</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              লেভেল বাই লেভেল আনলক করুন
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              প্রতিটি রাউন্ডে ৩০টি অফিশিয়াল কুইজ। সর্বোচ্চ ৩টি বা তার কম ভুল করলেই পরবর্তী রাউন্ড সঙ্গে সঙ্গে আনলক হয়ে যাবে!
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="p-5 rounded-2xl bg-[#141012]/95 border border-[#FFDD9C]/20 shrink-0 w-full md:w-80 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">ফ্রি ট্রায়াল কোটা:</span>
              <span className="text-[#F9B637] font-mono text-sm font-black">
                {Math.min(200, totalQuestionsAnswered)} / 200 প্রশ্ন
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden ring-1 ring-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalQuestionsAnswered / 200) * 100)}%` }}
              />
            </div>
            {!isVip && totalQuestionsAnswered >= 200 ? (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FB6C00]/25 hover:opacity-90"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>VIP আনলক করুন (€49)</span>
              </button>
            ) : isVip ? (
              <div className="text-xs font-black text-[#FFDD9C] flex items-center justify-center gap-1.5 py-1 bg-[#FB6C00]/15 rounded-xl border border-[#FB6C00]/30">
                <ShieldCheck className="w-4 h-4 text-[#F9B637]" />
                <span>লাইফটাইম VIP মেম্বার আনলকড</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 text-center">
                ২০০ প্রশ্ন পর্যন্ত সম্পূর্ণ ফ্রি ট্রায়াল সুযোগ
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Rounds Section with Bigger Eye-Catching Header */}
      <div className="space-y-6">
        <div className="glass-box rounded-2xl p-5 border border-[#FFDD9C]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Flag className="w-6 h-6 text-[#FB6C00] shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                রাউন্ড তালিকা (১ - ২৪০) • <span className="text-[#FB6C00]">Lista dei Round</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              ধারাবাহিকভাবে রাউন্ডগুলো সম্পূর্ণ করুন। পরীক্ষায় পাস করতে সকল রাউন্ডে সবুজ টিক অর্জন করুন!
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300 shrink-0 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center gap-1 text-[#F9B637]">
              <CheckCircle2 className="w-3.5 h-3.5" /> পাস
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#E73F1E]">
              <Lock className="w-3.5 h-3.5" /> লক করা
            </span>
          </div>
        </div>

        {/* Rounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ALL_ROUNDS.map((round) => {
            const isUnlocked = isVip ? true : (round.isFree && round.id <= unlockedRound);
            const roundResult = completedRounds[round.id];
            const isPassed = roundResult?.passed;
            const isCurrentActive = round.id === unlockedRound;

            return (
              <div
                key={round.id}
                className={`glass-box rounded-3xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 relative overflow-hidden ${
                  isCurrentActive
                    ? 'border-[#FB6C00]/80 ring-2 ring-[#FB6C00]/40 bg-[#FB6C00]/10 shadow-xl shadow-[#FB6C00]/15 scale-[1.01]'
                    : isUnlocked
                    ? 'border-[#FFDD9C]/15 hover:border-[#FB6C00]/50 hover:bg-[#181316]/90 shadow-lg'
                    : 'opacity-75 border-white/5 bg-[#120f11]/60'
                }`}
              >
                {/* Background glow for current active round */}
                {isCurrentActive && (
                  <div className="absolute top-0 right-0 w-36 h-36 bg-[#FB6C00]/15 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="space-y-3 relative z-10">
                  {/* Top Bar: Bilingual Badge + Unlock/Pass Status */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Bilingual Topic Badge: Bangla + Italian */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#E73F1E]/20 text-[#FFDD9C] border border-[#FB6C00]/40 shadow-sm">
                      <span>{round.topicBadgeBn}</span>
                      <span className="text-[#F9B637] font-normal">|</span>
                      <span className="italic font-bold text-white">{round.topicBadgeIt}</span>
                    </div>

                    {/* Status Badge */}
                    {isPassed ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-[#FFDD9C] bg-[#F9B637]/20 px-3 py-1 rounded-full border border-[#F9B637]/40 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#F9B637]" />
                        <span>পাস ({roundResult.errors} ভুল)</span>
                      </span>
                    ) : roundResult ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-rose-200 bg-[#E73F1E]/25 px-3 py-1 rounded-full border border-[#E73F1E]/40 shadow-sm">
                        <XCircle className="w-4 h-4 text-[#E73F1E]" />
                        <span>অনুত্তীর্ণ ({roundResult.errors} ভুল)</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-black text-[#F9B637] flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>আনলক করা</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#FFDD9C] flex items-center gap-1.5 bg-[#E73F1E]/15 px-2.5 py-1 rounded-full border border-[#FB6C00]/30">
                        <Lock className="w-3.5 h-3.5 text-[#FB6C00]" />
                        <span>লক করা (VIP)</span>
                      </span>
                    )}
                  </div>

                  {/* Balanced Titles (Bangla & Italian equal prominence) */}
                  <div className="space-y-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight">
                      {round.titleBn}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-[#F9B637] tracking-tight leading-snug">
                      {round.titleIt}
                    </p>
                  </div>

                  {/* Quick Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-300 font-medium pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FB6C00]" />
                      {round.questionsCount}টি কুইজ (30 Quiz)
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">
                      সর্বোচ্চ ৩টি ভুল পাস
                    </span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
                  <span className="text-xs font-bold text-slate-400">
                    {round.isFree ? (
                      <span className="text-[#F9B637] font-black">বিনামূল্যে ট্রায়াল</span>
                    ) : isVip ? (
                      <span className="text-[#FFDD9C] font-black">VIP সক্রিয়</span>
                    ) : (
                      <span className="text-[#FB6C00] font-bold">VIP মেম্বারশিপ প্রয়োজন</span>
                    )}
                  </span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onStartRound(round.id)}
                      className={`py-2 px-4 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-md ${
                        isPassed
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                          : isCurrentActive
                          ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] hover:opacity-95 text-slate-950 shadow-[#FB6C00]/30 scale-[1.02]'
                          : 'bg-[#FB6C00]/20 hover:bg-[#FB6C00]/30 text-[#FFDD9C] border border-[#FB6C00]/30'
                      }`}
                    >
                      {isPassed ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>পুনরায় দিন • Ripeti</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>শুরু করুন • Inizia</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenPaywall}
                      className="py-2 px-4 rounded-xl bg-[#E73F1E]/20 hover:bg-[#E73F1E]/30 text-[#FFDD9C] border border-[#E73F1E]/30 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>আনলক করুন (€49)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
