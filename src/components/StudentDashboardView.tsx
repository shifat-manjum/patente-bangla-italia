import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  Flame, 
  GraduationCap, 
  MessageCircle,
} from 'lucide-react';
import type { StudentProfile } from '../services/studentService';
import { WHATSAPP_GROUP_URL } from '../config/constants';
import { trackWhatsAppJoin } from '../services/analytics';

const getDynamicStreak = (): number => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('patente_last_study_date');
    const saved = localStorage.getItem('patente_study_streak');
    const streak = saved ? parseInt(saved, 10) : 1;

    if (!lastDate) {
      localStorage.setItem('patente_last_study_date', today);
      localStorage.setItem('patente_study_streak', '1');
      return 1;
    }

    if (lastDate === today) {
      return Math.max(1, streak);
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday) {
      return Math.max(1, streak);
    }

    return 1;
  } catch {
    return 1;
  }
};

interface StudentDashboardViewProps {
  student: StudentProfile | null;
  activeRound: number;
  completedRoundsCount: number;
  totalQuestionsSolved: number;
  errorCount: number;
  isVip?: boolean;
  freeRoundsLimit?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
  onContinueRound: (roundId: number) => void;
  onGoToCurriculum: () => void;
  onGoToTheory: () => void;
  onGoToExam: () => void;
  onGoToErrors: () => void;
  onOpenEnrollment: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  activeRound: _activeRound,
  completedRoundsCount,
  totalQuestionsSolved,
  errorCount,
  isVip = false,
  freeRoundsLimit = 20,
  academyPriceEur: _academyPriceEur,
  regularPriceEur: _regularPriceEur,
  onContinueRound,
  onGoToCurriculum,
  onGoToTheory: _onGoToTheory,
  onGoToExam,
  onGoToErrors,
  onOpenEnrollment,
}) => {
  const dynamicStreak = getDynamicStreak();
  const maxRounds = isVip ? 240 : Math.min(240, Math.max(0, freeRoundsLimit));

  // Readiness score estimation based on actual progress
  const roundProgress = (completedRoundsCount / maxRounds) * 60;
  const questionProgress = Math.min(30, (totalQuestionsSolved / 1500) * 30);
  const accuracyPenalty = Math.min(20, errorCount * 0.5);
  const readinessScore = Math.min(
    99,
    Math.max(15, Math.round(roundProgress + questionProgress - accuracyPenalty + 10))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn text-left">
      {/* Student Welcome & Action Center Hero */}
      <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
                <GraduationCap className="w-4 h-4 text-[#FB6C00]" />
                <span>Official Italian Patente B Academy</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {student?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Your preparation for the Italian ministerial driving theory exam is in progress. Practice 15–20 minutes daily to secure a first-attempt pass.
            </p>

            {/* 4 Action Buttons in ONE Row - Same Format & Signature Orange */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
              {/* 1. Start Practicing (Directly loads Round 1) */}
              <button
                type="button"
                onClick={() => onContinueRound(1)}
                className="py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-[#E73F1E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FB6C00]/25 transition active:scale-95 cursor-pointer text-center"
                title="রাউন্ড ১ অনুশীলন শুরু করুন"
              >
                <Play className="w-4 h-4 fill-current text-white shrink-0" />
                <span className="truncate">Start Practicing</span>
              </button>

              {/* 2. Start Official Exam Simulation */}
              <button
                type="button"
                onClick={onGoToExam}
                className="py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-[#E73F1E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FB6C00]/25 transition active:scale-95 cursor-pointer text-center"
                title="অফিশিয়াল ২০ মিনিটের মক টেস্ট শুরু করুন"
              >
                <Clock className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Start Official Exam Simulation</span>
              </button>

              {/* 3. একাডেমিতে ভর্তি হন */}
              <button
                type="button"
                onClick={onOpenEnrollment}
                className="py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-[#E73F1E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FB6C00]/25 transition active:scale-95 cursor-pointer text-center"
                title="কোর্স প্ল্যান ও মেম্বারশিপ দেখুন"
              >
                <GraduationCap className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">একাডেমিতে ভর্তি হন</span>
              </button>

              {/* 4. WhatsApp Group */}
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppJoin('dashboard_hero_button')}
                className="py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-[#E73F1E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FB6C00]/25 transition active:scale-95 cursor-pointer text-center"
                title="অফিসিয়াল WhatsApp স্টুডেন্ট গ্রুপে যুক্ত হোন"
              >
                <MessageCircle className="w-4 h-4 text-white fill-current shrink-0" />
                <span className="truncate">WhatsApp Group</span>
              </a>
            </div>
          </div>

          {/* Exam Readiness Radial Meter */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center min-w-[200px] shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/15"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#FB6C00]"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">{readinessScore}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Readiness</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-200 pt-3">
              Official Exam Pass Probability
            </p>
            <span className="text-[11px] text-slate-400 font-semibold">
              {readinessScore > 75 ? 'Excellent Progress!' : 'Keep practicing daily'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Minimalist Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Solved Questions */}
        <div
          onClick={onGoToCurriculum}
          className="bg-white dark:bg-[#12161F] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm space-y-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition-all active:scale-[0.98] group"
          title="কুইজ প্র্যাকটিস করতে ক্লিক করুন"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Solved Questions</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalQuestionsSolved}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-[#FB6C00] font-bold group-hover:underline">
              অনুশীলন করুন ➔
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              {Math.floor(totalQuestionsSolved / 30)} সেট কুইজ
            </span>
          </div>
        </div>

        {/* 2. Completed Rounds */}
        <div
          onClick={onGoToCurriculum}
          className="bg-white dark:bg-[#12161F] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm space-y-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition-all active:scale-[0.98] group"
          title="রাউন্ড কারিকুলাম দেখতে ক্লিক করুন"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Completed Rounds</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 text-[#FB6C00]" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {completedRoundsCount} <span className="text-sm font-bold text-slate-400 dark:text-slate-500">/ {maxRounds}</span>
          </p>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-[#FB6C00] font-bold group-hover:underline">
              সিলেবাস খুলুন ➔
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              {isVip ? '২৪০ একাডেমি' : 'ফাউন্ডেশন'}
            </span>
          </div>
        </div>

        {/* 3. Errors to Review */}
        <div 
          onClick={onGoToErrors}
          className="bg-white dark:bg-[#12161F] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm space-y-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition-all active:scale-[0.98] group"
          title="ভুলের খাতা দেখতে ক্লিক করুন"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Error Review</span>
            <div className="p-2 rounded-xl bg-[#E52E2D]/10 dark:bg-[#E52E2D]/15 border border-[#E52E2D]/20 dark:border-[#E52E2D]/30 text-[#E52E2D] group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {errorCount}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-[#E73F1E] font-bold group-hover:underline">
              {errorCount > 0 ? 'ভুলগুলো শুধরান ➔' : 'কোনো ভুল নেই ✅'}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              ভুলের খাতা
            </span>
          </div>
        </div>

        {/* 4. Daily Streak */}
        <div
          onClick={() => onContinueRound(1)}
          className="bg-white dark:bg-[#12161F] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm space-y-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition-all active:scale-[0.98] group"
          title="ধারাবাহিক অনুশীলন করতে ক্লিক করুন"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Study Streak</span>
            <div className="p-2 rounded-xl bg-[#FB6C00]/10 dark:bg-[#FB6C00]/15 border border-[#FB6C00]/20 dark:border-[#FB6C00]/30 text-[#FB6C00] group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {dynamicStreak} {dynamicStreak === 1 ? 'Day' : 'Days'} 🔥
          </p>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-[#FB6C00] font-bold group-hover:underline">
              অনুশীলন শুরু ➔
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              দৈনিক টার্গেট
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
