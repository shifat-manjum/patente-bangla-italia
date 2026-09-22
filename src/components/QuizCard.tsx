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
      className={`bg-white rounded-2xl p-5 sm:p-7 space-y-5 transition-all duration-200 relative overflow-hidden border shadow-sm ${
        shouldRevealOutcome
          ? isCorrect
            ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/30'
            : 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/30'
          : 'border-slate-200'
      }`}
    >
      {/* Top Header: Question # and Category */}
      <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-black border border-blue-200">
            Question #{index + 1}
          </span>
          <span className="text-slate-600 font-bold hidden sm:inline">
            {question.chapterTitleIt}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Speed Toggle */}
          <button
            type="button"
            onClick={() => setSpeechRate(speechRate === 0.9 ? 0.75 : 0.9)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
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
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-blue-600" />
            <span>{isSpeaking ? 'Playing... (Stop)' : 'Oral Exam Audio'}</span>
          </button>

          {/* Bangla Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowBanglaTranslation(!showBanglaTranslation)}
            title="Toggle Bengali Meaning"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
              showBanglaTranslation
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-slate-600" />
            <span>{showBanglaTranslation ? 'Bangla: ON' : 'Bangla: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Road Sign Banner (Centered Graphic if present) */}
      {(question.signCode || question.image) && (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
          <RoadSign code={question.signCode || String(question.image)} size={120} />
          {question.signSymbol && (
            <span className="mt-2 text-[11px] font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {question.signSymbol}
            </span>
          )}
        </div>
      )}

      {/* Official Italian Question Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-white text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span>🇮🇹</span>
              <span>Official Ministerial Question</span>
            </span>
          </div>

          {/* Quick Audio trigger */}
          <button
            type="button"
            onClick={() => speakItalian(question.questionIt)}
            className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Stop Audio' : 'Listen with Headphones'}</span>
          </button>
        </div>
        <p className="text-base sm:text-xl font-black text-slate-900 leading-relaxed tracking-wide pt-1">
          "{question.questionIt}"
        </p>
      </div>

      {/* Prominent Bangla Translation Box */}
      {showBanglaTranslation && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/50 border border-amber-200/80">
          <p className="text-base sm:text-xl font-bold text-slate-800 leading-relaxed">
            {getBanglaTranslation(question.questionIt, question.questionBn)}
          </p>
        </div>
      )}

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
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                  : 'bg-rose-600 text-white ring-4 ring-rose-200'
                : 'bg-emerald-600 text-white ring-4 ring-emerald-200'
              : shouldRevealOutcome && question.isCorrect
              ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500'
              : 'bg-white hover:bg-emerald-50 text-slate-800 border-2 border-slate-200 hover:border-emerald-400'
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
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                  : 'bg-rose-600 text-white ring-4 ring-rose-200'
                : 'bg-rose-600 text-white ring-4 ring-rose-200'
              : shouldRevealOutcome && !question.isCorrect
              ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500'
              : 'bg-white hover:bg-rose-50 text-slate-800 border-2 border-slate-200 hover:border-rose-400'
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
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
              <span>
                {isCorrect
                  ? '✅ চমৎকার! আপনার উত্তর সঠিক হয়েছে।'
                  : `❌ উত্তর ভুল হয়েছে! সঠিক উত্তর: ${question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}`}
              </span>
            </div>
          </div>

          {/* Explanation Box */}
          {question.explanationBn && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#FB6C00]">
                <Lightbulb className="w-4 h-4" />
                <span>কেন এই উত্তরটি সঠিক? (ব্যাখ্যা ও পরীক্ষার টিপস):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {question.explanationBn}
              </p>
            </div>
          )}

          {/* Trap Warning if applicable */}
          {question.trapTipBn && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-800 font-bold">পরীক্ষার সতর্কবার্তা (Trabocchetto):</strong>
                <p className="mt-0.5 leading-relaxed">{question.trapTipBn}</p>
              </div>
            </div>
          )}

          {/* Vocabulary in this question */}
          {question.vocabulary && question.vocabulary.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                এই প্রশ্নের কঠিন শব্দার্থ:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.vocabulary.map((vocab, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-2.5 rounded-xl bg-[#151113]/90 border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-black text-white block">{vocab.wordIt}</span>
                      <span className="text-[11px] text-[#F9B637] font-medium">{vocab.meaningBn}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakItalian(vocab.wordIt)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#FB6C00]/20 text-slate-400 hover:text-[#FFDD9C] transition cursor-pointer"
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
  );
};
