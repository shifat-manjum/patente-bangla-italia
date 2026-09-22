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
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 animate-fadeIn border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            কোনো ভুল প্রশ্ন জমে নেই! 🎉
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            আপনি পরীক্ষায় বা অনুশীলনে যে প্রশ্নগুলো ভুল করবেন, সেগুলো স্বয়ংক্রিয়ভাবে এখানে জমা হবে যাতে বারবার প্র্যাকটিস করে মুখস্থ করে নিতে পারেন।
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTopics}
          className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition hover:scale-105 cursor-pointer shadow-sm"
        >
          কুইজ প্র্যাকটিস শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-rose-200 dark:border-rose-900/60 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs font-black text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>ভুল হওয়া প্রশ্ন ব্যাংক (Revisione Errori)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              আপনার ভুল প্রশ্নগুলো রিভিশন দিন ({mistakeQuestions.length}টি)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              সঠিক উত্তর দিলে প্রশ্নটি স্বয়ংক্রিয়ভাবে এই তালিকা থেকে মুছে যাবে।
            </p>
          </div>

          <button
            type="button"
            onClick={onClearMistakes}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
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
