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
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6 bg-white rounded-3xl p-8 sm:p-12 animate-fadeIn border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            কোনো ভুল প্রশ্ন জমে নেই! 🎉
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            আপনি পরীক্ষায় বা অনুশীলনে যে প্রশ্নগুলো ভুল করবেন, সেগুলো স্বয়ংক্রিয়ভাবে এখানে জমা হবে যাতে বারবার প্র্যাকটিস করে মুখস্থ করে নিতে পারেন।
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTopics}
          className="py-3 px-6 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-xs transition hover:scale-105 cursor-pointer shadow-sm"
        >
          কুইজ প্র্যাকটিস শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-rose-200 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-black text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>ভুল হওয়া প্রশ্ন ব্যাংক (Revisione Errori)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              আপনার ভুল প্রশ্নগুলো রিভিশন দিন ({mistakeQuestions.length}টি)
            </h1>
            <p className="text-slate-600 text-xs">
              সঠিক উত্তর দিলে প্রশ্নটি স্বয়ংক্রিয়ভাবে এই তালিকা থেকে মুছে যাবে।
            </p>
          </div>

          <button
            type="button"
            onClick={onClearMistakes}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
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
