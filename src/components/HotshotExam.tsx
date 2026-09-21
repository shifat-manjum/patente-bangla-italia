import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Volume2,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { HOTSHOT_QUESTIONS } from '../data/hotshotQuestions';
import { RoadSign } from './RoadSign';

interface HotshotExamProps {
  onRecordMistake?: (id: string) => void;
}

export const HotshotExam: React.FC<HotshotExamProps> = ({ onRecordMistake }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  const currentQ = HOTSHOT_QUESTIONS[currentIndex];
  const hasAnsweredCurrent = userAnswers[currentIndex] !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && userAnswers[currentIndex] === currentQ.isCorrect;

  const handleAnswer = (choice: boolean) => {
    if (hasAnsweredCurrent) return;

    setUserAnswers((prev) => ({ ...prev, [currentIndex]: choice }));
    setShowExplanation(true);

    if (choice !== currentQ.isCorrect && onRecordMistake) {
      onRecordMistake(currentQ.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < HOTSHOT_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setIsExamCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsExamCompleted(false);
  };

  const speakItalian = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([idx, ans]) => HOTSHOT_QUESTIONS[Number(idx)].isCorrect === ans
  ).length;
  const wrongCount = totalAnswered - correctCount;

  if (isExamCompleted) {
    return (
      <div className="max-w-2xl mx-auto glass-box rounded-3xl p-8 text-center space-y-6 animate-fadeIn border border-emerald-500/20 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-amber-500/30">
          <Flame className="w-8 h-8 fill-current" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white">হটশট অনুশীলন সমাপ্ত!</h2>
          <p className="text-sm text-slate-300">
            আপনি অফিশিয়াল কুইজের সবচেয়ে কঠিন ২০টি ফাঁদ প্রশ্ন অনুশীলন করলেন।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="glass-box rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
            <span className="text-xs font-bold text-emerald-400 block">সঠিক উত্তর</span>
            <span className="text-3xl font-black text-white">{correctCount}</span>
          </div>
          <div className="glass-box rounded-2xl p-4 border border-rose-500/30 bg-rose-950/20">
            <span className="text-xs font-bold text-rose-400 block">ভুল উত্তর</span>
            <span className="text-3xl font-black text-white">{wrongCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 mx-auto shadow-lg shadow-emerald-500/25"
        >
          <RotateCcw className="w-4 h-4" />
          <span>পুনরায় শুরু করুন (Ricomincia)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-amber-500/25 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-black text-amber-300">
              <Flame className="w-4 h-4 fill-current text-amber-400" />
              <span>হটশট প্রশ্ন ব্যাংক • Quiz Trabocchetto Più Sbagliati</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              পরীক্ষার সবচেয়ে বেশি ভুল হওয়া প্রশ্ন
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              এই প্রশ্নগুলো কুইজে শিক্ষার্থীদের সবচেয়ে বেশি বোকা বানায়। বাংলা ব্যাখ্যা ও ফাঁদ শনাক্ত করে পরীক্ষায় শতভাগ প্রস্তুত হোন!
            </p>
          </div>

          <div className="shrink-0 text-right bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-400 font-bold block">প্রশ্ন অগ্রগতি</span>
            <span className="text-sm font-black text-white font-mono">
              {currentIndex + 1} / {HOTSHOT_QUESTIONS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl relative">
        {/* Top Topic Badge & Audio */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {currentQ.chapterTitleBn}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              ({currentQ.chapterTitleIt})
            </span>
          </div>

          <button
            type="button"
            onClick={() => speakItalian(currentQ.questionIt)}
            className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="ইতালিয়ান অডিও শুনুন"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">অডিও</span>
          </button>
        </div>

        {/* Road Sign Image if available */}
        {currentQ.image && (
          <div className="flex justify-center py-2">
            <RoadSign code={String(currentQ.image)} size={110} />
          </div>
        )}

        {/* Questions: Equal Font Prominence */}
        <div className="space-y-4">
          {/* Italian Question */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Official Ministerial Italian:
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.questionIt}
            </p>
          </div>

          {/* Bengali Question */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              বাংলা ভাবার্থ:
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-200 leading-relaxed">
              {currentQ.questionBn}
            </p>
          </div>
        </div>

        {/* True / False Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            disabled={hasAnsweredCurrent}
            onClick={() => handleAnswer(true)}
            className={`py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 border shadow-lg ${
              hasAnsweredCurrent
                ? currentQ.isCorrect === true
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400'
                  : userAnswers[currentIndex] === true
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-white/5 text-slate-500 border-white/5 opacity-50'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 border-emerald-500/40 hover:scale-[1.02]'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>VERO (সত্য)</span>
          </button>

          <button
            type="button"
            disabled={hasAnsweredCurrent}
            onClick={() => handleAnswer(false)}
            className={`py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 border shadow-lg ${
              hasAnsweredCurrent
                ? currentQ.isCorrect === false
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400'
                  : userAnswers[currentIndex] === false
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-white/5 text-slate-500 border-white/5 opacity-50'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border-rose-500/40 hover:scale-[1.02]'
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>FALSO (মিথ্যা)</span>
          </button>
        </div>

        {/* Answer Breakdown & Trap Warning */}
        {showExplanation && (
          <div className="space-y-4 pt-4 border-t border-white/10 animate-fadeIn">
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 font-black text-sm ${
                isCurrentCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              {isCurrentCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>দারুণ! আপনি সঠিক উত্তর দিয়েছেন ({currentQ.isCorrect ? 'VERO' : 'FALSO'})</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>ভুল উত্তর! সঠিক উত্তর হলো {currentQ.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}</span>
                </>
              )}
            </div>

            {/* Trap Tip Banner */}
            {currentQ.trapTipBn && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-black text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>এই প্রশ্নের ফাঁদ (Il Trabocchetto):</span>
                </div>
                <p className="leading-relaxed">{currentQ.trapTipBn}</p>
              </div>
            )}

            {/* Detailed Bengali Explanation */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-black text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <span>বিস্তারিত নিয়ম ও ব্যাখ্যা:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanationBn}</p>
            </div>

            {/* Tricky Vocabulary in question */}
            {currentQ.vocabulary && currentQ.vocabulary.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider block">
                  শব্দার্থ (Vocaboli Chiave):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.vocabulary.map((v, i) => (
                    <div key={i} className="text-xs bg-slate-900/60 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="font-black text-white">{v.wordIt}</span>
                      <span className="text-slate-400">{v.meaningBn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              <span>{currentIndex < HOTSHOT_QUESTIONS.length - 1 ? 'পরবর্তী ফাঁদ প্রশ্ন' : 'ফলাফল দেখুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
