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

interface StudentDashboardViewProps {
  student: StudentProfile | null;
  activeRound: number;
  completedRoundsCount: number;
  totalQuestionsSolved: number;
  errorCount: number;
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
  onContinueRound,
  onGoToCurriculum,
  onGoToTheory,
  onGoToExam,
  onGoToErrors,
}) => {
  // Readiness score estimation
  const readinessScore = Math.min(100, Math.round((completedRoundsCount / 20) * 80 + (totalQuestionsSolved > 100 ? 20 : 10)));

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Student Welcome & Quick Resume Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/30 text-xs font-bold text-blue-200">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Official Italian Patente B Academy</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {student?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Your preparation for the Italian ministerial driving theory exam is in progress. Practice 15–20 minutes daily to secure a first-attempt pass.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onContinueRound(activeRound)}
                className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2 transition cursor-pointer shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Round #{activeRound}</span>
              </button>

              <button
                type="button"
                onClick={onGoToExam}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition cursor-pointer"
              >
                <Clock className="w-4 h-4 text-blue-300" />
                <span>Start Official Exam Simulation</span>
              </button>
            </div>
          </div>

          {/* Exam Readiness Radial Meter */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center min-w-[200px] shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
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
                <span className="text-[10px] text-blue-200 uppercase font-bold">Readiness</span>
              </div>
            </div>

            <p className="text-xs font-bold text-blue-100 pt-3">
              Official Exam Pass Probability
            </p>
            <span className="text-[11px] text-emerald-300 font-semibold">
              {readinessScore > 75 ? 'Excellent Progress!' : 'Keep practicing daily'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Solved Questions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Solved Questions</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {totalQuestionsSolved}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Official 30-Question Sets
          </span>
        </div>

        {/* Foundation Rounds Completed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Completed Rounds</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {completedRoundsCount} <span className="text-sm font-bold text-slate-400">/ 20</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">
            Foundation Assessment
          </span>
        </div>

        {/* Errors to Review */}
        <div 
          onClick={onGoToErrors}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 cursor-pointer hover:border-rose-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Error Review</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {errorCount}
          </p>
          <span className="text-[11px] text-rose-600 font-bold hover:underline">
            Review Mistakes ➔
          </span>
        </div>

        {/* Daily Streak */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Study Streak</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            3 Days 🔥
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            Consistent Daily Practice
          </span>
        </div>
      </div>

      {/* Feature Navigation Cards (App Hub) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 240 Rounds */}
        <div 
          onClick={onGoToCurriculum}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition">
              240 Rounds Course Syllabus
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Foundation Assessment (Rounds 1–20) and complete chapter-by-chapter curriculum according to the Italian Highway Code.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-black text-blue-700 gap-1">
            <span>Explore Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Theory Summaries */}
        <div 
          onClick={onGoToTheory}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition">
              Theory Summaries (25 Chapters)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              3 Golden Rules per chapter in Italian and Bengali + common exam trap keywords. Master rules in 90 seconds.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-black text-emerald-700 gap-1">
            <span>Read Cheat Sheets</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Oral Audio Exam Mode */}
        <div 
          onClick={onGoToExam}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition">
              Official Oral Exam Simulation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exact replica of the Motorizzazione Civile test with headphone audio pronunciation (30 questions, 20 mins, max 3 errors).
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-black text-purple-700 gap-1">
            <span>Launch Simulation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
