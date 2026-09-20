import React from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Play,
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export interface RoundInfo {
  id: number;
  titleBn: string;
  titleIt: string;
  topicBadge: string;
  questionsCount: number;
  isFree: boolean;
}

// Generate the 240 rounds structure
export const ALL_ROUNDS: RoundInfo[] = [
  { id: 1, titleBn: 'রাউন্ড ১: বিপদজনক ট্রাফিক সংকেত', titleIt: 'Segnali di Pericolo Base', topicBadge: '⚠️ সংকেত', questionsCount: 30, isFree: true },
  { id: 2, titleBn: 'রাউন্ড ২: স্টপ ও ডানদিকের অগ্রাধিকার', titleIt: 'Precedenze e STOP', topicBadge: '🛑 অগ্রাধিকার', questionsCount: 30, isFree: true },
  { id: 3, titleBn: 'রাউন্ড ৩: গতিসীমা ও ব্রেকিং দূরত্ব', titleIt: 'Velocità e Frenata', topicBadge: '⭕ গতিসীমা', questionsCount: 30, isFree: true },
  { id: 4, titleBn: 'রাউন্ড ৪: পার্কিং ও সাময়িক থামা', titleIt: 'Sosta e Fermata', topicBadge: '🚫 পার্কিং', questionsCount: 30, isFree: true },
  { id: 5, titleBn: 'রাউন্ড ৫: ওভারটেকিং ও বাঁকের নিয়ম', titleIt: 'Sorpasso in Curva', topicBadge: '⛔ ওভারটেক', questionsCount: 30, isFree: true },
  { id: 6, titleBn: 'রাউন্ড ৬: গোলচত্বর ও ট্রাম অগ্রাধিকার', titleIt: 'Rotatorie e Tram', topicBadge: '🚊 ট্রাম/মোড়', questionsCount: 30, isFree: true },
  { id: 7, titleBn: 'রাউন্ড ৭: ফ্রি ট্রায়াল ফাইনাল টেস্ট (২০০ প্রশ্ন)', titleIt: 'Test di Sbarramento', topicBadge: '🎯 ফাইনাল', questionsCount: 20, isFree: true },

  // VIP Rounds (Rounds 8 to 240)
  { id: 8, titleBn: 'রাউন্ড ৮: বাধ্যতামূলক ট্রাফিক সংকেত', titleIt: 'Segnali di Obbligo', topicBadge: '🔵 VIP', questionsCount: 30, isFree: false },
  { id: 9, titleBn: 'রাউন্ড ৯: হাইওয়ে (Autostrada) নিয়মাবলি', titleIt: 'Circolazione in Autostrada', topicBadge: '🛣️ VIP', questionsCount: 30, isFree: false },
  { id: 10, titleBn: 'রাউন্ড ১০: হেডলাইট ও কুয়াশার বাতির ব্যবহার', titleIt: 'Uso dei Fari e Visibilità', topicBadge: '💡 VIP', questionsCount: 30, isFree: false },
  { id: 11, titleBn: 'রাউন্ড ১১: অ্যালকোহল, ড্রাগস ও জরিমানা', titleIt: 'Alcol, Droga e Punti Patente', topicBadge: '🍷 VIP', questionsCount: 30, isFree: false },
  { id: 12, titleBn: 'রাউন্ড ১২: প্রাথমিক চিকিৎসা ও দুর্ঘটনা', titleIt: 'Primo Soccorso Stradale', topicBadge: '🚑 VIP', questionsCount: 30, isFree: false },
  { id: 13, titleBn: 'রাউন্ড ১৩: গাড়ির ইঞ্জিন ও যান্ত্রিক পার্টস', titleIt: 'Elementi del Veicolo e Freni', topicBadge: '⚙️ VIP', questionsCount: 30, isFree: false },
  { id: 14, titleBn: 'রাউন্ড ১৪: ট্রাফিক মোড়ে গাড়ির ক্রসিং ক্রম', titleIt: 'Ordine di Precedenza agli Incroci', topicBadge: '🚸 VIP', questionsCount: 30, isFree: false },
  { id: 15, titleBn: 'রাউন্ড ১৫: পরিবেশবান্ধব ও নিরাপদ ড্রাইভিং', titleIt: 'Guida Ecologica e Sicurezza', topicBadge: '🌿 VIP', questionsCount: 30, isFree: false },
  // Placeholder for rounds 16 to 240
  { id: 16, titleBn: 'রাউন্ড ১৬ - ২৪০: সম্পূর্ণ ২৩৫টি ফুল মক টেস্ট', titleIt: 'Tutti i 240 Quiz Ufficiali Ministeriali', topicBadge: '👑 7,100+ প্রশ্ন', questionsCount: 6800, isFree: false },
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Progression Banner */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <Award className="w-3.5 h-3.5" />
              <span>ধাপে ধাপে পাস করার রোডম্যাপ (২৪০টি রাউন্ড)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              লেভেল বাই লেভেল আনলক করুন
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              প্রতিটি রাউন্ডে ৩০টি কুইজ। সর্বোচ্চ ৩টি বা তার কম ভুল করলে পরবর্তী রাউন্ড আনলক হবে।
              এভাবে অনুশীলন করলে আসল পরীক্ষায় ফেল করার কোনো সুযোগ থাকবে না!
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shrink-0 w-full md:w-auto space-y-2">
            <div className="flex items-center justify-between gap-4 text-xs font-bold">
              <span className="text-slate-400">ফ্রি ট্রায়াল কোটা:</span>
              <span className="text-emerald-400">{Math.min(200, totalQuestionsAnswered)} / 200 প্রশ্ন</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalQuestionsAnswered / 200) * 100)}%` }}
              />
            </div>
            {!isVip && totalQuestionsAnswered >= 200 ? (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>VIP আনলক করুন (€49)</span>
              </button>
            ) : isVip ? (
              <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VIP মেম্বার আনলকড</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Rounds Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            রাউন্ড তালিকা (১ - ২৪০)
          </span>
          <span>সবুজ টিক = পাস • তালা = লক করা</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_ROUNDS.map((round) => {
            const isUnlocked = isVip ? true : (round.isFree && round.id <= unlockedRound);
            const roundResult = completedRounds[round.id];
            const isPassed = roundResult?.passed;
            const isCurrentActive = round.id === unlockedRound;

            return (
              <div
                key={round.id}
                className={`glass-box rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden ${
                  isCurrentActive
                    ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 bg-emerald-950/20'
                    : isUnlocked
                    ? 'border-white/10 hover:border-white/20'
                    : 'opacity-70 border-white/5 bg-slate-950/50'
                }`}
              >
                <div className="space-y-2">
                  {/* Top Bar: Badge + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-emerald-300 border border-white/10">
                      {round.topicBadge}
                    </span>

                    {isPassed ? (
                      <span className="flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>পাস ({roundResult.errors} ভুল)</span>
                      </span>
                    ) : roundResult ? (
                      <span className="flex items-center gap-1 text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>ফেল ({roundResult.errors} ভুল)</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Unlock className="w-3 h-3 text-emerald-400" />
                        <span>আনলক করা</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>লক করা</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-black text-white">{round.titleBn}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{round.titleIt}</p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {round.questionsCount}টি কুইজ
                  </span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onStartRound(round.id)}
                      className={`py-2 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                        isCurrentActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{roundResult ? 'পুনরায় প্র্যাকটিস' : 'শুরু করুন'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenPaywall}
                      className="py-2 px-4 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-400/30 transition cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>VIP আনলক (€49)</span>
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
