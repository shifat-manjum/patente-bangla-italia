import React, { useState } from 'react';
import { AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import type { QuizQuestion } from '../data/quizData';
import { QuizCard } from './QuizCard';

interface MistakeReviewProps {
  mistakeIds: string[];
  onClearMistakes: () => void;
  onRemoveMistake: (id: string) => void;
  onGoToTopics: () => void;
}

export const MistakeReview: React.FC<MistakeReviewProps> = ({
  mistakeIds,
  onClearMistakes,
  onRemoveMistake,
  onGoToTopics,
}) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // Filter questions that are in mistakeIds
  const mistakeQuestions = QUIZ_QUESTIONS.filter((q) => mistakeIds.includes(q.id));

  const handleAnswer = (question: QuizQuestion, ans: boolean) => {
    setAnswers((prev) => ({ ...prev, [question.id]: ans }));
    if (ans === question.isCorrect) {
      // Corrected! Remove from mistakes after a brief delay
      setTimeout(() => {
        onRemoveMistake(question.id);
      }, 1200);
    }
  };

  if (mistakeQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6 glass-box rounded-3xl p-8 sm:p-12 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">
            কোনো ভুল প্রশ্ন জমে নেই! 🎉
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            আপনি পরীক্ষায় বা অনুশীলনে যে প্রশ্নগুলো ভুল করবেন, সেগুলো স্বয়ংক্রিয়ভাবে এখানে জমা হবে যাতে বারবার প্র্যাকটিস করে মুখস্থ করে নিতে পারেন।
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTopics}
          className="py-3 px-6 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs transition hover:scale-105 cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          কুইজ প্র্যাকটিস শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>ভুল হওয়া প্রশ্ন ব্যাংক (Revisione Errori)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আপনার ভুল প্রশ্নগুলো রিভিশন দিন ({mistakeQuestions.length}টি)
            </h1>
            <p className="text-slate-400 text-xs">
              সঠিক উত্তর দিলে প্রশ্নটি স্বয়ংক্রিয়ভাবে এই তালিকা থেকে মুছে যাবে।
            </p>
          </div>

          <button
            type="button"
            onClick={onClearMistakes}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>তালিকা খালি করুন</span>
          </button>
        </div>
      </div>

      {/* Mistake Questions List */}
      <div className="space-y-6">
        {mistakeQuestions.map((q, idx) => (
          <QuizCard
            key={q.id}
            question={q}
            index={idx}
            userAnswer={answers[q.id] ?? null}
            onAnswer={(val) => handleAnswer(q, val)}
            showInstantResult={true}
          />
        ))}
      </div>
    </div>
  );
};
