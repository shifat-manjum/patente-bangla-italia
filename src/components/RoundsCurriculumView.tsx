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
  onSelectRound: (roundId: number) => void;
  onTriggerEnrollment: (roundId: number) => void;
  completedRounds?: Record<number, { errors: number; passed: boolean }>;
}

export const RoundsCurriculumView: React.FC<RoundsCurriculumViewProps> = ({
  currentRoundId,
  onSelectRound,
  onTriggerEnrollment,
  completedRounds = {},
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'free' | 'pro' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Total 240 rounds
  const totalRounds = 240;
  const rounds = Array.from({ length: totalRounds }, (_, i) => {
    const id = i + 1;
    const isFree = id <= 20;
    const result = completedRounds[id];
    
    // Topic mapping by block
    let topicEn = 'Danger Road Signs (Segnali di Pericolo)';
    let topicIt = 'Segnali di Pericolo Base';
    if (id > 20 && id <= 40) {
      topicEn = 'Priority & Intersections (Precedenze e Incroci)';
      topicIt = 'Precedenze e Incroci';
    } else if (id > 40 && id <= 60) {
      topicEn = 'Prohibitory Road Signs (Segnali di Divieto)';
      topicIt = 'Segnali di Divieto';
    } else if (id > 60 && id <= 80) {
      topicEn = 'Mandatory Road Signs (Segnali di Obbligo)';
      topicIt = 'Segnali di Obbligo';
    } else if (id > 80 && id <= 120) {
      topicEn = 'Speed Limits & Safety Distance (Velocità e Distanza)';
      topicIt = 'Velocità e Distanza di Sicurezza';
    } else if (id > 120 && id <= 160) {
      topicEn = 'Parking, Stopping & Overtaking (Sosta e Sorpasso)';
      topicIt = 'Sosta, Fermata e Sorpasso';
    } else if (id > 160 && id <= 200) {
      topicEn = 'Motorways & First Aid (Autostrada e Primo Soccorso)';
      topicIt = 'Autostrada e Dispositivi di Sicurezza';
    } else if (id > 200) {
      topicEn = 'Official Ministerial Master Simulation';
      topicIt = 'Scheda Ministeriale Master';
    }

    return {
      id,
      isFree,
      topicEn,
      topicIt,
      result,
    };
  });

  const filteredRounds = rounds.filter((r) => {
    if (filterTab === 'free' && !r.isFree) return false;
    if (filterTab === 'pro' && r.isFree) return false;
    if (filterTab === 'passed' && !r.result?.passed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = String(r.id) === q || `round ${r.id}`.includes(q);
      const matchTopic = r.topicEn.toLowerCase().includes(q) || r.topicIt.toLowerCase().includes(q);
      return matchNum || matchTopic;
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
            <span>Official Driving Academy Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            240 Rounds Course Syllabus
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Rounds 1 to 20 are available for unrestricted Foundation Assessment. Each round includes 30 official ministerial questions with clear Bengali meaning and oral headphone audio simulation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
            <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20">
              🟢 Foundation Assessment: <span className="text-emerald-300">Rounds 1 – 20 (Free)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20">
              🎓 Complete Syllabus: <span className="text-blue-300">Rounds 21 – 240 (Enrolled)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20">
              ✅ Passed Rounds: <span className="text-amber-300">{passedCount} / 240</span>
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
            placeholder="Search round number or topic (e.g. Round 5, Precedenze, Speed)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `All Rounds (${totalRounds})` },
            { id: 'free', label: `Foundation (${freeRoundsCount} Free)` },
            { id: 'pro', label: `Complete Syllabus (220)` },
            { id: 'passed', label: `Passed (${passedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rounds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRounds.map((round) => {
          const isCurrent = round.id === currentRoundId;
          const isPassed = round.result?.passed === true;

          return (
            <div
              key={round.id}
              className={`rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
                isCurrent
                  ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-400 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900 shadow-sm'
                  : isPassed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 hover:border-emerald-400'
                  : round.isFree
                  ? 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs'
                  : 'bg-slate-50/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="space-y-2.5">
                {/* Card Top: Round Badge & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                      round.isFree
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {round.isFree ? '🟢 Foundation Assessment' : '🎓 Complete Syllabus'}
                  </span>

                  {isPassed ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{30 - (round.result?.errors ?? 0)}/30 Passed</span>
                    </span>
                  ) : !round.isFree ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700/80 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3" />
                      <span>Enrolled</span>
                    </span>
                  ) : null}
                </div>

                {/* Round Title & Topic */}
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    Round #{round.id}
                  </h3>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 pt-0.5">
                    {round.topicEn}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {round.topicIt}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-3">
                {round.isFree ? (
                  <button
                    type="button"
                    onClick={() => onSelectRound(round.id)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95 ${
                      isCurrent
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isPassed
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrent ? 'Currently Active' : isPassed ? 'Practice Again' : 'Start Round'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onTriggerEnrollment(round.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Academy Enrollment</span>
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
