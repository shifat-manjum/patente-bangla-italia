import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Languages,
  Headphones
} from 'lucide-react';
import type { QuizQuestion } from '../data/quizData';
import { RoadSign } from './RoadSign';
import { getBanglaTranslation } from '../utils/patenteTranslator';

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  userAnswer?: boolean | null;
  onAnswer: (answer: boolean) => void;
  showInstantResult?: boolean;
  isExamSubmitted?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  index,
  userAnswer,
  onAnswer,
  showInstantResult = true,
  isExamSubmitted = false
}) => {
  const [showBanglaTranslation, setShowBanglaTranslation] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  // Audio pronunciation of the Italian question (Oral Exam Simulation)
  const speakItalian = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = speechRate;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const isAnswered = userAnswer !== null && userAnswer !== undefined;
  const isCorrect = isAnswered && userAnswer === question.isCorrect;
  const shouldRevealOutcome = showInstantResult && isAnswered;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 space-y-5 transition-all duration-200 relative overflow-hidden border shadow-sm min-h-[380px] flex flex-col justify-between ${
        shouldRevealOutcome
          ? isCorrect
            ? 'border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-100 dark:ring-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20'
            : 'border-rose-300 dark:border-rose-700 ring-2 ring-rose-100 dark:ring-rose-950 bg-rose-50/30 dark:bg-rose-950/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header: Question # and Category */}
        <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-black border border-blue-200 dark:border-blue-800">
              Question #{index + 1}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-bold hidden sm:inline">
              {question.chapterTitleIt}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Speed Toggle */}
            <button
              type="button"
              onClick={() => setSpeechRate(speechRate === 0.9 ? 0.75 : 0.9)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Speech Speed"
            >
              {speechRate === 0.9 ? 'Speed: 1.0x' : 'Speed: 0.8x (Slow)'}
            </button>

            {/* Oral Exam Headphone Audio Button */}
            <button
              type="button"
              onClick={() => speakItalian(question.questionIt)}
              title="Listen official Italian pronunciation (Oral Exam Mode)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold shadow-2xs ${
                isSpeaking
                  ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                  : 'bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isSpeaking ? 'Playing... (Stop)' : 'Oral Exam Audio'}</span>
            </button>

            {/* Bangla Translation Toggle */}
            <button
              type="button"
              onClick={() => setShowBanglaTranslation(!showBanglaTranslation)}
              title="Toggle Bengali Meaning"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
                showBanglaTranslation
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>{showBanglaTranslation ? 'Bangla: ON' : 'Bangla: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Question Content Area: Side-by-Side on Desktop if Sign Exists */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch min-h-[160px]">
          {/* Road Sign Graphic (if present) */}
          {(question.signCode || question.image) && (
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-inner">
              <RoadSign code={question.signCode || String(question.image)} size={110} />
              {question.signSymbol && (
                <span className="mt-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs">
                  {question.signSymbol}
                </span>
              )}
            </div>
          )}

          {/* Question Text Area */}
          <div className={`${(question.signCode || question.image) ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col justify-between gap-3`}>
            {/* Official Italian Question Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-xs flex items-center gap-1.5">
                    <span>🇮🇹</span>
                    <span>Official Ministerial Question</span>
                  </span>
                </div>

                {/* Quick Audio trigger */}
                <button
                  type="button"
                  onClick={() => speakItalian(question.questionIt)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen with Headphones'}</span>
                </button>
              </div>
              <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed tracking-wide pt-1">
                "{question.questionIt}"
              </p>
            </div>

            {/* Prominent Bangla Translation Box */}
            {showBanglaTranslation && (
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-amber-100 leading-relaxed">
                  {getBanglaTranslation(question.questionIt, question.questionBn)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Big High-Contrast VERO / FALSO Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
          {/* VERO Button */}
          <button
            type="button"
            onClick={() => onAnswer(true)}
            disabled={isExamSubmitted}
            className={`py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
              userAnswer === true
                ? shouldRevealOutcome
                  ? question.isCorrect
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                    : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900'
                  : 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                : shouldRevealOutcome && question.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
            }`}
          >
            <span className="tracking-wide text-lg sm:text-xl">VERO</span>
            <span className="text-xs font-bold opacity-80">(সত্য)</span>
            {shouldRevealOutcome && question.isCorrect && (
              <CheckCircle2 className="w-5 h-5 text-emerald-100 sm:ml-1" />
            )}
            {shouldRevealOutcome && userAnswer === true && !question.isCorrect && (
              <XCircle className="w-5 h-5 text-white sm:ml-1" />
            )}
          </button>

          {/* FALSO Button */}
          <button
            type="button"
            onClick={() => onAnswer(false)}
            disabled={isExamSubmitted}
            className={`py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
              userAnswer === false
                ? shouldRevealOutcome
                  ? !question.isCorrect
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                    : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900'
                  : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900'
                : shouldRevealOutcome && !question.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                : 'bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500'
            }`}
          >
            <span className="tracking-wide text-lg sm:text-xl">FALSO</span>
            <span className="text-xs font-bold opacity-80">(মিথ্যা)</span>
            {shouldRevealOutcome && !question.isCorrect && (
              <CheckCircle2 className="w-5 h-5 text-emerald-100 sm:ml-1" />
            )}
            {shouldRevealOutcome && userAnswer === false && question.isCorrect && (
              <XCircle className="w-5 h-5 text-white sm:ml-1" />
            )}
          </button>
        </div>

        {/* Detailed Outcome & Explanation Box */}
        {shouldRevealOutcome && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            {/* Verdict Banner */}
            <div
              className={`p-3.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-black ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                <span>
                  {isCorrect
                    ? '✅ চমৎকার! আপনার উত্তর সঠিক হয়েছে।'
                    : `❌ উত্তর ভুল হয়েছে! সঠিক উত্তর: ${question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}`}
                </span>
              </div>
            </div>

            {/* Explanation Box */}
            {question.explanationBn && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#FB6C00]">
                  <Lightbulb className="w-4 h-4" />
                  <span>কেন এই উত্তরটি সঠিক? (ব্যাখ্যা ও পরীক্ষার টিপস):</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {question.explanationBn}
                </p>
              </div>
            )}

            {/* Trap Warning if applicable */}
            {question.trapTipBn && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-800 dark:text-amber-300 font-bold">পরীক্ষার সতর্কবার্তা (Trabocchetto):</strong>
                  <p className="mt-0.5 leading-relaxed">{question.trapTipBn}</p>
                </div>
              </div>
            )}

            {/* Vocabulary in this question */}
            {question.vocabulary && question.vocabulary.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  এই প্রশ্নের কঠিন শব্দার্থ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.vocabulary.map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900 dark:text-white block">{vocab.wordIt}</span>
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{vocab.meaningBn}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakItalian(vocab.wordIt)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                        title="উচ্চারণ"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
