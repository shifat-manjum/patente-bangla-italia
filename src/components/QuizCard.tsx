import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Languages
} from 'lucide-react';
import type { QuizQuestion } from '../data/quizData';
import { RoadSign } from './RoadSign';

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

  // Audio pronunciation of the Italian question
  const speakItalian = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.88;
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
      className={`glass-box rounded-3xl p-5 sm:p-7 space-y-5 transition-all duration-300 relative overflow-hidden ${
        shouldRevealOutcome
          ? isCorrect
            ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10'
            : 'border-rose-500/50 bg-rose-950/20 shadow-rose-500/10'
          : 'border-white/10'
      }`}
    >
      {/* Top Header: Question # and Category */}
      <div className="flex items-center justify-between gap-3 text-xs border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
            প্রশ্ন #{index + 1}
          </span>
          <span className="text-slate-300 font-bold hidden sm:inline">
            {question.chapterTitleBn} <span className="text-slate-500 font-normal">({question.chapterTitleIt})</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Pronunciation */}
          <button
            type="button"
            onClick={() => speakItalian(question.questionIt)}
            title="ইতালিয়ান উচ্চারণ শুনুন"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
              isSpeaking
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">উচ্চারণ শুনুন</span>
          </button>

          {/* Bangla Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowBanglaTranslation(!showBanglaTranslation)}
            title="বাংলা অনুবাদ দেখুন বা লুকান"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
              showBanglaTranslation
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showBanglaTranslation ? 'বাংলা চালু' : 'বাংলা বন্ধ'}</span>
          </button>
        </div>
      </div>

      {/* Road Sign Banner (Centered Graphic if present) */}
      {question.signCode && (
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-inner">
          <RoadSign code={question.signCode} size={110} />
          {question.signSymbol && (
            <span className="mt-2 text-[11px] font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {question.signSymbol}
            </span>
          )}
        </div>
      )}

      {/* Official Italian Question Box */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
            অফিশিয়াল ইতালিয়ান প্রশ্ন (Testo Ufficiale)
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
          "{question.questionIt}"
        </p>
      </div>

      {/* Prominent Bangla Translation Box */}
      {showBanglaTranslation && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-400 uppercase tracking-wider">
            <span>🇧🇩 বাংলা সহজ অনুবাদ:</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-emerald-100 leading-relaxed">
            {question.questionBn}
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
          className={`py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
            userAnswer === true
              ? shouldRevealOutcome
                ? question.isCorrect
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 font-black'
                  : 'bg-rose-500 text-white ring-4 ring-rose-500/40'
                : 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40'
              : shouldRevealOutcome && question.isCorrect
              ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500'
              : 'bg-white/5 hover:bg-emerald-500/20 text-white border border-white/10 hover:border-emerald-500/40'
          }`}
        >
          <span className="tracking-wide">VERO</span>
          <span className="text-xs font-bold opacity-80">(সত্য)</span>
          {shouldRevealOutcome && question.isCorrect && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 sm:ml-1" />
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
          className={`py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
            userAnswer === false
              ? shouldRevealOutcome
                ? !question.isCorrect
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 font-black'
                  : 'bg-rose-500 text-white ring-4 ring-rose-500/40'
                : 'bg-rose-500 text-white ring-4 ring-rose-500/40'
              : shouldRevealOutcome && !question.isCorrect
              ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500'
              : 'bg-white/5 hover:bg-rose-500/20 text-white border border-white/10 hover:border-rose-500/40'
          }`}
        >
          <span className="tracking-wide">FALSO</span>
          <span className="text-xs font-bold opacity-80">(মিথ্যা)</span>
          {shouldRevealOutcome && !question.isCorrect && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 sm:ml-1" />
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
            className={`p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-black ${
              isCorrect
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>
                {isCorrect
                  ? '✅ চমৎকার! আপনার উত্তর সঠিক হয়েছে।'
                  : `❌ ভুল হয়েছে! সঠিক উত্তর হলো: ${question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}`}
              </span>
            </div>
          </div>

          {/* Explanation in Bengali */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <span>কেন {question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}? (সহজ যুক্তি):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {question.explanationBn}
            </p>

            {question.trapTipBn && (
              <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black block">পরীক্ষার গোপন কৌশল (Exam Tip):</strong>
                  <span>{question.trapTipBn}</span>
                </div>
              </div>
            )}
          </div>

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
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-black text-white block">{vocab.wordIt}</span>
                      <span className="text-[11px] text-emerald-400 font-medium">{vocab.meaningBn}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakItalian(vocab.wordIt)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
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
