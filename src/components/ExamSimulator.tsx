import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import type { QuizQuestion } from '../data/quizData';
import { getQuestionsForRound, ALL_200_QUESTIONS } from '../data/roundQuestions';
import { QuizCard } from './QuizCard';

interface ExamSimulatorProps {
  onSaveMistakes: (questionIds: string[]) => void;
  onGoToTopics: () => void;
  roundId?: number | null;
  onBackToRounds?: () => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  onSaveMistakes,
  onGoToTopics,
  roundId,
  onBackToRounds
}) => {
  // Select questions based on round or general mock test
  const generateExamQuestions = (): QuizQuestion[] => {
    if (roundId) {
      return getQuestionsForRound(roundId);
    }
    // General Mock test: pick 30 random questions from ALL_200_QUESTIONS
    const shuffled = [...ALL_200_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 30);
  };

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60); // 20 minutes
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // When roundId changes, reset and auto-start or prepare round questions
  useEffect(() => {
    if (roundId) {
      setQuestions(getQuestionsForRound(roundId));
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeftSeconds(20 * 60);
      setIsSubmitted(false);
      setIsStarted(true);
    }
  }, [roundId]);

  const startNewExam = () => {
    setQuestions(generateExamQuestions());
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeftSeconds(20 * 60);
    setIsSubmitted(false);
    setIsStarted(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!isStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isSubmitted]);

  const handleAnswer = (val: boolean) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: val }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);

    // Calculate mistakes
    const mistakeIds: string[] = [];
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns === undefined || userAns !== q.isCorrect) {
        mistakeIds.push(q.id);
      }
    });

    onSaveMistakes(mistakeIds);

    const errorCount = mistakeIds.length;
    if (errorCount <= 3) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalAnswered = Object.keys(answers).length;
  const currentQuestion = questions[currentIdx];

  // Calculate results if submitted
  const errorCount = questions.reduce((acc, q, idx) => {
    const userAns = answers[idx];
    return userAns !== q.isCorrect ? acc + 1 : acc;
  }, 0);
  const isPassed = errorCount <= 3;

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Intro Banner */}
        <div className="glass-box rounded-3xl p-6 sm:p-10 space-y-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              সিমুলেশন পরীক্ষা (Simulazione Esame Patente B)
            </h1>
            <p className="text-slate-400 text-sm">
              ইতালির মোটরিজ্জাসিওনে (Motorizzazione)-র হুবহু অফিশিয়াল নিয়মে ৩০টি প্রশ্নের পরীক্ষা।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">মোট প্রশ্ন:</span>
              <span className="text-lg font-black text-white">৩০টি কুইজ</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">সময় সীমা:</span>
              <span className="text-lg font-black text-emerald-400">২০ মিনিট</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-slate-400 font-bold block">পাস করার শর্ত:</span>
              <span className="text-lg font-black text-white">সর্বোচ্চ ৩টি ভুল</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 max-w-2xl mx-auto text-xs text-slate-300 text-left">
            💡 <strong>আমাদের বিশেষ সুবিধা:</strong> পরীক্ষার সময় বা পরীক্ষা শেষে প্রতিটি প্রশ্নের নিচে <strong>[বাংলা অর্থ ও বিস্তারিত ব্যাখ্যা]</strong> দেখতে পারবেন, যাতে বুঝতে পারেন কেন ভুল হলো।
          </div>

          <button
            type="button"
            onClick={startNewExam}
            className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            পরীক্ষা শুরু করুন (Inizia Esame) 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Status Bar: Timer + Progress */}
      <div className="glass-box rounded-3xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        {/* Round or Mock Test Label */}
        <div className="flex items-center gap-3">
          {onBackToRounds && (
            <button
              type="button"
              onClick={onBackToRounds}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="রাউন্ড তালিকায় ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">রাউন্ড তালিকা</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/30">
              {roundId ? `রাউন্ড #${roundId}` : 'মডেল টেস্ট'}
            </span>
            <span className="text-xs text-slate-300 font-bold hidden md:inline">
              {roundId ? `লেভেল ${roundId} পরীক্ষা` : '৩০টি অফিসিয়াল প্রশ্ন (২০ মিনিট)'}
            </span>
          </div>
        </div>

        {/* Timer & Answered Count */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl flex items-center gap-2 font-black text-sm ${
              timeLeftSeconds < 180
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                : timeLeftSeconds < 360
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-base tracking-wider font-mono">{timeFormatted}</span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            উত্তর: <strong className="text-white">{totalAnswered} / {questions.length}</strong>
          </span>
        </div>

        {/* Submit or Reset button */}
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmitExam}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            পরীক্ষা জমা দিন (Consegna)
          </button>
        ) : (
          <button
            type="button"
            onClick={startNewExam}
            className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 flex items-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>নতুন পরীক্ষা</span>
          </button>
        )}
      </div>

      {/* Results Banner if submitted */}
      {isSubmitted && (
        <div
          className={`glass-box rounded-3xl p-6 sm:p-8 space-y-4 text-center border ${
            isPassed ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-rose-500/40 bg-rose-950/30'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white">
            {isPassed ? (
              <div className="w-full h-full bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-full h-full bg-rose-500 rounded-2xl flex items-center justify-center text-white">
                <XCircle className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              {isPassed ? '🎉 অভিনন্দন! আপনি পাস করেছেন (IDONEO)' : '❌ দুঃখিত! আপনি ফেল করেছেন (BOCCIATO)'}
            </h2>
            <p className="text-xs text-slate-300">
              মোট ভুল হয়েছে: <strong className={isPassed ? 'text-emerald-400' : 'text-rose-400'}>{errorCount}টি</strong> (পাস করার জন্য সর্বোচ্চ ৩টি ভুল গ্রহণযোগ্য)।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startNewExam}
              className="py-2.5 px-5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs transition hover:scale-105 cursor-pointer"
            >
              আবার পরীক্ষা দিন
            </button>
            <button
              type="button"
              onClick={onGoToTopics}
              className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 transition cursor-pointer"
            >
              অধ্যায়ভিত্তিক প্র্যাকটিস করুন
            </button>
          </div>
        </div>
      )}

      {/* 30-Question Matrix Navigator */}
      <div className="glass-box rounded-3xl p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>প্রশ্ন নির্বাচন করুন (1 - 30):</span>
          <span className="text-[11px]">
            {isSubmitted ? 'সবুজ = সঠিক • লাল = ভুল' : 'সাদা = উত্তর দেওয়া হয়েছে'}
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {questions.map((q, idx) => {
            const hasAnswered = answers[idx] !== undefined;
            const isUserRight = isSubmitted && answers[idx] === q.isCorrect;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-10 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                  currentIdx === idx ? 'ring-2 ring-emerald-400 scale-105' : ''
                } ${
                  isSubmitted
                    ? isUserRight
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-rose-500 text-white font-black'
                    : hasAnswered
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Card */}
      {currentQuestion && (
        <QuizCard
          question={currentQuestion}
          index={currentIdx}
          userAnswer={answers[currentIdx] ?? null}
          onAnswer={handleAnswer}
          showInstantResult={isSubmitted}
          isExamSubmitted={isSubmitted}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পূর্ববর্তী প্রশ্ন</span>
        </button>

        <span className="text-xs font-bold text-slate-400">
          {currentIdx + 1} / 30
        </span>

        <button
          type="button"
          disabled={currentIdx === questions.length - 1}
          onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
          className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <span>পরবর্তী প্রশ্ন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
