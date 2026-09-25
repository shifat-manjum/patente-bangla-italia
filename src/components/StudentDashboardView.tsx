import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Award, 
  Flame, 
  GraduationCap, 
  ArrowRight,
  Headphones
} from 'lucide-react';
import type { StudentProfile } from '../services/studentService';

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
  onContinueRound: (roundId: number) => void;
  onGoToCurriculum: () => void;
  onGoToTheory: () => void;
  onGoToExam: () => void;
  onGoToErrors: () => void;
  onOpenEnrollment: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  activeRound,
  completedRoundsCount,
  totalQuestionsSolved,
  errorCount,
  isVip = false,
  onContinueRound,
  onGoToCurriculum,
  onGoToTheory,
  onGoToExam,
  onGoToErrors,
}) => {
  const dynamicStreak = getDynamicStreak();
  const maxRounds = isVip ? 240 : 20;
  // Readiness score estimation based on actual progress
  const roundRatio = Math.min(1, completedRoundsCount / maxRounds);
  const questionsRatio = Math.min(1, totalQuestionsSolved / 150);
  const errorPenalty = totalQuestionsSolved > 20 ? Math.min(0.2, (errorCount / totalQuestionsSolved)) : 0;
  const readinessScore = Math.min(100, Math.max(10, Math.round((roundRatio * 0.65 + questionsRatio * 0.35 - errorPenalty) * 100)));

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Student Welcome & Quick Resume Hero (Adobe Mesh Ambient Style) */}
      <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#121625] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E52E2D]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Official Italian Patente B Academy</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {student?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your preparation for the Italian ministerial driving theory exam is in progress. Practice 15–20 minutes daily to secure a first-attempt pass.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onContinueRound(activeRound)}
                className="py-3 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-slate-950" />
                <span>Continue Round #{activeRound}</span>
              </button>

              <button
                type="button"
                onClick={onGoToExam}
                className="py-3 px-5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-300" />
                <span>Start Official Exam Simulation</span>
              </button>
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
                  className="text-white"
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

      {/* 4 Quick Stat Cards (Fully Dynamic & Interactive in Clean Obsidian / Daytime Crisp) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Solved Questions (Clickable to Curriculum) */}
        <div
          onClick={onGoToCurriculum}
          className="bg-white dark:bg-[#12161F] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm space-y-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition-all active:scale-[0.98] group"
          title="কুইজ প্র্যাকটিস করতে ক্লিক করুন"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Solved Questions</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalQuestionsSolved}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white font-bold group-hover:underline">
              অনুশীলন করুন ➔
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              {Math.floor(totalQuestionsSolved / 30)} সেট কুইজ
            </span>
          </div>
        </div>

        {/* 2. Completed Rounds (Clickable to Curriculum) */}
        <div
          onClick={onGoToCurriculum}
          className="bg-white dark:bg-[#12161F] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm space-y-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition-all active:scale-[0.98] group"
          title="রাউন্ড কারিকুলাম দেখতে ক্লিক করুন"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Completed Rounds</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {completedRoundsCount} <span className="text-sm font-bold text-slate-400 dark:text-slate-500">/ {maxRounds}</span>
          </p>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white font-bold group-hover:underline">
              সিলেবাস খুলুন ➔
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              {isVip ? '২৪০ একাডেমি' : 'ফাউন্ডেশন'}
            </span>
          </div>
        </div>

        {/* 3. Errors to Review (Clickable to Mistakes) */}
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
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white font-bold group-hover:underline">
              {errorCount > 0 ? 'ভুলগুলো শুধরান ➔' : 'কোনো ভুল নেই ✅'}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              ভুলের খাতা
            </span>
          </div>
        </div>

        {/* 4. Daily Streak (Clickable to Continue Round) */}
        <div
          onClick={() => onContinueRound(activeRound)}
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
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white font-bold group-hover:underline">
              রাউন্ড #{activeRound} শুরু ➔
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              দৈনিক টার্গেট
            </span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards (App Hub in Adaptive Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 240 Rounds */}
        <div 
          onClick={onGoToCurriculum}
          className="bg-white dark:bg-[#12161F] rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition cursor-pointer flex flex-col justify-between group shadow-xs dark:shadow-sm"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition">
              240 Rounds Course Syllabus
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Foundation Assessment (Rounds 1–20) and complete chapter-by-chapter curriculum according to the Italian Highway Code.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white gap-1">
            <span>Explore Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Theory Summaries */}
        <div 
          onClick={onGoToTheory}
          className="bg-white dark:bg-[#12161F] rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition cursor-pointer flex flex-col justify-between group shadow-xs dark:shadow-sm"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition">
              Theory Summaries (25 Chapters)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              3 Golden Rules per chapter in Italian and Bengali + common exam trap keywords. Master rules in 90 seconds.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white gap-1">
            <span>Read Cheat Sheets</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Oral Audio Exam Mode */}
        <div 
          onClick={onGoToExam}
          className="bg-white dark:bg-[#12161F] rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-[#151B27] transition cursor-pointer flex flex-col justify-between group shadow-xs dark:shadow-sm"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition">
              Official Oral Exam Simulation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Exact replica of the Motorizzazione Civile test with headphone audio pronunciation (30 questions, 20 mins, max 3 errors).
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white gap-1">
            <span>Launch Simulation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
