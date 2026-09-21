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
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center space-y-6 animate-fadeIn border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto text-[#FB6C00] border border-orange-200 shadow-sm">
          <Flame className="w-8 h-8 fill-current text-[#FB6C00]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">হটশট অনুশীলন সমাপ্ত!</h2>
          <p className="text-sm text-slate-600">
            আপনি অফিশিয়াল কুইজের সবচেয়ে কঠিন ২০টি ফাঁদ প্রশ্ন অনুশীলন করলেন।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="rounded-2xl p-4 border border-emerald-200 bg-emerald-50">
            <span className="text-xs font-bold text-emerald-800 block">সঠিক উত্তর</span>
            <span className="text-3xl font-black text-emerald-700">{correctCount}</span>
          </div>
          <div className="rounded-2xl p-4 border border-rose-200 bg-rose-50">
            <span className="text-xs font-bold text-rose-800 block">ভুল উত্তর</span>
            <span className="text-3xl font-black text-rose-700">{wrongCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="py-3 px-6 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 mx-auto shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>পুনরায় শুরু করুন</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-black text-orange-800">
              <Flame className="w-4 h-4 text-[#FB6C00] fill-current" />
              <span>টপ ২০ ট্রিক প্রশ্ন (Top 20 Trabocchetti)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              হটশট ফাঁদ কুইজ পরীক্ষা
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
              ইতালিয়ান ড্রাইভিং লাইসেন্স পরীক্ষায় সবচেয়ে বেশি শিক্ষার্থী যে ২০টি প্রশ্নে ভুল করে। প্রতিটি প্রশ্নের ট্রিক বুঝে নিন।
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block">অগ্রগতি</span>
              <span className="text-base font-black text-slate-900">
                {currentIndex + 1} / {HOTSHOT_QUESTIONS.length}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center font-black text-xs text-[#FB6C00]">
              {Math.round(((currentIndex + 1) / HOTSHOT_QUESTIONS.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FB6C00] transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / HOTSHOT_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm relative">
        {/* Top Topic Badge & Audio */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-black bg-orange-50 text-[#FB6C00] border border-orange-200">
              {currentQ.chapterTitleBn}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              ({currentQ.chapterTitleIt})
            </span>
          </div>

          <button
            type="button"
            onClick={() => speakItalian(currentQ.questionIt)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="ইতালিয়ান অডিও শুনুন"
          >
            <Volume2 className="w-4 h-4 text-[#FB6C00]" />
            <span className="hidden sm:inline">অডিও</span>
          </button>
        </div>

        {/* Road Sign Image if available */}
        {currentQ.image && (
          <div className="flex justify-center py-2">
            <RoadSign code={String(currentQ.image)} size={120} />
          </div>
        )}

        {/* Questions: Equal Font Prominence */}
        <div className="space-y-4">
          {/* Italian Question */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Official Ministerial Italian:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              "{currentQ.questionIt}"
            </p>
          </div>

          {/* Bengali Question */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              বাংলা ভাবার্থ:
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
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
            className={`py-3.5 px-4 rounded-xl font-black text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${
              hasAnsweredCurrent
                ? currentQ.isCorrect === true
                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200'
                  : userAnswers[currentIndex] === true
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                : 'bg-white hover:bg-emerald-50 text-slate-800 border-2 border-slate-200 hover:border-emerald-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>VERO (সত্য)</span>
          </button>

          <button
            type="button"
            disabled={hasAnsweredCurrent}
            onClick={() => handleAnswer(false)}
            className={`py-3.5 px-4 rounded-xl font-black text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${
              hasAnsweredCurrent
                ? currentQ.isCorrect === false
                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200'
                  : userAnswers[currentIndex] === false
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                : 'bg-white hover:bg-rose-50 text-slate-800 border-2 border-slate-200 hover:border-rose-500'
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>FALSO (মিথ্যা)</span>
          </button>
        </div>

        {/* Answer Breakdown & Trap Warning */}
        {showExplanation && (
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 font-black text-sm ${
                isCurrentCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {isCurrentCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>
                {isCurrentCorrect
                  ? 'দারুণ! আপনি সঠিক উত্তর দিয়েছেন (' + (currentQ.isCorrect ? 'VERO' : 'FALSO') + ')'
                  : 'ভুল উত্তর! সঠিক উত্তর হলো: ' + (currentQ.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)')}
              </span>
            </div>

            {/* Trap Tip Banner */}
            {currentQ.trapTipBn && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-black text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>এই প্রশ্নের ফাঁদ (Il Trabocchetto):</span>
                </div>
                <p className="leading-relaxed text-slate-700">{currentQ.trapTipBn}</p>
              </div>
            )}

            {/* Detailed Bengali Explanation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-black text-[#FB6C00]">
                <BookOpen className="w-4 h-4" />
                <span>বিস্তারিত নিয়ম ও ব্যাখ্যা:</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{currentQ.explanationBn}</p>
            </div>

            {/* Tricky Vocabulary in question */}
            {currentQ.vocabulary && currentQ.vocabulary.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                  শব্দার্থ (Vocaboli Chiave):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.vocabulary.map((v, i) => (
                    <div key={i} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-black text-slate-900">{v.wordIt}</span>
                      <span className="text-slate-600 font-medium">{v.meaningBn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
