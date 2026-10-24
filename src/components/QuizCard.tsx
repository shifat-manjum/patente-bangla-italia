import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Languages,
  Headphones,
  Copy,
  Check,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import type { QuizQuestion } from '../data/quizData';
import { RoadSign } from './RoadSign';
import { getBanglaTranslation, getEnglishTranslation } from '../utils/patenteTranslator';
import { speakItalian as playItalianFemaleVoice, stopSpeech } from '../utils/italianSpeech';

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  userAnswer?: boolean | null;
  onAnswer: (answer: boolean) => void;
  showInstantResult?: boolean;
  isExamSubmitted?: boolean;
  hideAnswerButtons?: boolean;
  hideAnswerButtonsOnMobile?: boolean;
  alwaysShowExplanation?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  index,
  userAnswer,
  onAnswer,
  showInstantResult = true,
  isExamSubmitted = false,
  hideAnswerButtons = false,
  hideAnswerButtonsOnMobile = false,
  alwaysShowExplanation = false,
}) => {
  const [showBanglaTranslation, setShowBanglaTranslation] = useState(true);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // Regular human reading speed
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyQuestion = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  // Stop any playing speech and keep English translation hidden by default when question changes
  useEffect(() => {
    setIsSpeaking(false);
    setShowEnglishTranslation(false);
    return () => {
      stopSpeech();
    };
  }, [question.id, question.questionIt]);

  // Audio pronunciation using natural Italian female voice at regular speed
  const speakItalian = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    playItalianFemaleVoice(text, {
      rate: speechRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  const isAnswered = userAnswer !== null && userAnswer !== undefined;
  const isCorrect = isAnswered && userAnswer === question.isCorrect;
  const shouldRevealOutcome = (showInstantResult && isAnswered) || alwaysShowExplanation;

  // Helper: Detect whether an existing explanation is just a generic canned placeholder
  const isGenericExplanation = (text?: string): boolean => {
    if (!text) return true;
    const trimmed = text.trim();
    if (trimmed.length < 25) return true;
    return (
      trimmed.includes('ইতালির অফিশিয়াল ট্রাফিক কোড') ||
      trimmed.includes('ইতালিয়ান ট্রাফিক কোড') ||
      trimmed.includes('শতভাগ আইনসম্মত ও সত্য') ||
      trimmed.includes('শতভাগ সত্য (VERO)') ||
      trimmed.includes('মিথ্যা (FALSO)। ট্রাফিক নিয়মে এমন কোনো বিধান নেই') ||
      trimmed.includes('এই বক্তব্যটি সম্পূর্ণ মিথ্যা (FALSO)') ||
      trimmed.includes('এই বক্তব্যটি মিথ্যা (FALSO)') ||
      trimmed.includes('এই বক্তব্যটি ট্রাফিক আইন অনুযায়ী পুরোপুরি সত্য')
    );
  };

  // State to hold live AI-generated real explanation
  const [aiExplanation, setAiExplanation] = useState<{
    explanationBn: string;
    trapTipBn?: string;
  } | null>(() => {
    try {
      const cacheKey = `patente_ai_exp_${question.id || question.questionIt}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.explanationBn && !isGenericExplanation(parsed.explanationBn)) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });
  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);

  // Automatically fetch Teacher Marco's real AI explanation whenever a question outcome is revealed or in MistakeReview
  useEffect(() => {
    // If we already have a genuine custom explanation from the dataset, keep it
    if (!isGenericExplanation(question.explanationBn)) {
      return;
    }

    if (!shouldRevealOutcome) {
      return;
    }

    const cacheKey = `patente_ai_exp_${question.id || question.questionIt}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.explanationBn && !isGenericExplanation(parsed.explanationBn)) {
          setAiExplanation(parsed);
          return;
        }
      }
    } catch {}

    // Fetch real explanation from Teacher Marco AI backend
    let isCancelled = false;
    setIsFetchingExplanation(true);

    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: question.id,
        questionIt: question.questionIt,
        isCorrect: question.isCorrect,
        questionBn: question.questionBn || '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.success && data.explanationBn) {
          const expData = {
            explanationBn: data.explanationBn,
            trapTipBn: data.trapTipBn || '',
          };
          setAiExplanation(expData);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(expData));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('Could not fetch AI explanation for card:', err);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsFetchingExplanation(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [shouldRevealOutcome, question.id, question.questionIt, question.explanationBn, question.isCorrect, question.questionBn]);

  // Smart fallback based on Italian traffic rules if offline or loading
  const getSmartRuleFallback = (): string => {
    const it = question.questionIt.toLowerCase();
    if (it.includes('distanza di sicurezza')) {
      return question.isCorrect
        ? 'গাড়ির গতি বাড়লে ব্রেকিং দূরত্ব বহুগুণ বৃদ্ধি পায়, তাই উচ্চ গতিতে অবশ্যই নিরাপদ দূরত্ব (Distanza di sicurezza) বাড়াতে হবে।'
        : 'নিরাপদ দূরত্ব কখনোই একটি অপরিবর্তনশীল সংখ্যা নয়; গাড়ির গতি, রাস্তা ও আবহাওয়ার ওপর ভিত্তি করে এটি পরিবর্তন করতে হয়।';
    }
    if (it.includes('sorpasso')) {
      return question.isCorrect
        ? 'পর্যাপ্ত দৃশ্যমানতা থাকলে এবং বিপরীত দিক থেকে কোনো গাড়ি না এলে নির্দিষ্ট সড়কে সতর্কতার সাথে ওভারটেক অনুমোদিত।'
        : 'বাঁক (Curva), পাহাড়ি ঢালের চূড়া (Dosso) ও রেল ক্রসিংয়ের কাছে ওভারটেক করা কঠোরভাবে নিষিদ্ধ।';
    }
    if (it.includes('precedenza')) {
      return question.isCorrect
        ? 'ইতালিয়ান ট্রাফিক আইনের সাধারণ নিয়মানুযায়ী মোড়ে ডান দিক থেকে আসা গাড়িকে অগ্রাধিকার (Precedenza a destra) দিতে হয়।'
        : 'সব সময় ডান দিকের গাড়ি অগ্রাধিকার পাবে না; স্টপ (STOP) বা বিশেষ নির্দেশক সংকেত থাকলে সেই সংকেতের নিয়ম কার্যকর হবে।';
    }
    if (it.includes('fermata') || it.includes('sosta')) {
      return question.isCorrect
        ? 'যাত্রী ওঠানামার জন্য সাময়িক থামা (Fermata) এবং পার্কিং (Sosta)-এর আইনগত শর্ত ও সময়সীমা আলাদা।'
        : 'যেখানে পার্কিং (Divieto di sosta) নিষিদ্ধ, সেখানে স্বল্প সময়ের জন্য থামা (Fermata)-ও নিষিদ্ধ হবে এমন ধারণা ভুল।';
    }
    if (it.includes('autostrada')) {
      return question.isCorrect
        ? 'হাইওয়ে বা অটোস্ত্রাদায় নির্ধারিত সর্বনিম্ন গতি বজায় রাখা এবং জরুরি লেন ছাড়া গাড়ি না থামানো বাধ্যতামূলক।'
        : 'হাইওয়েতে কোনো অবস্থাতেই ইউ-টার্ন (Inversione di marcia) বা রিভার্স চালানো (Retromarcia) বৈধ নয়।';
    }
    if (it.includes('casco') || it.includes('cinture')) {
      return question.isCorrect
        ? 'চালকের পাশাপাশি পেছনের সিটের সব আরোহীদের জন্যও সিটবেল্ট বা হেলমেট ব্যবহার শতভাগ বাধ্যতামূলক।'
        : 'শহরের ভেতরে কম গতিতে গাড়ি চালালেও সিটবেল্ট বা হেলমেটের নিয়ম শিথিল হয় না।';
    }
    return question.isCorrect
      ? 'ইতালির ট্রাফিক কোড অনুযায়ী এই শর্তটি সম্পূর্ণ নিয়মমাফিক এবং নিরাপদ ড্রাইভিংয়ের মূল বিধির সাথে সঙ্গতিপূর্ণ।'
      : 'প্রশ্নের বাক্যটিতে এমন এক শর্ত উপস্থাপন করা হয়েছে যা ট্রাফিক আইনের মূল বিধির সম্পূর্ণ বিপরীত বা একটি বিভ্রান্তিকর ফাঁদ।';
  };

  // Teacher Marco explanation generator
  const getMarcoExplanation = () => {
    if (aiExplanation?.explanationBn) {
      return aiExplanation.explanationBn;
    }
    if (!isGenericExplanation(question.explanationBn)) {
      return question.explanationBn!.trim();
    }
    return getSmartRuleFallback();
  };

  // Teacher Marco Trap (Trabocchetto) detector
  const getMarcoTrapTip = () => {
    if (aiExplanation?.trapTipBn?.trim()) {
      return aiExplanation.trapTipBn.trim();
    }
    if (question.trapTipBn?.trim()) return question.trapTipBn.trim();
    const it = question.questionIt.toLowerCase();
    if (!question.isCorrect) {
      if (/\bsempre\b/i.test(it)) {
        return 'প্রশ্নে "sempre" (সর্বদা) শব্দটি রয়েছে। ট্রাফিক নিয়মের বাস্তব ব্যতিক্রম থাকায় "sempre" যুক্ত কুইজের প্রশ্নগুলো সাধারণত FALSO হয়!';
      }
      if (/\bmai\b/i.test(it)) {
        return 'প্রশ্নে "mai" (কখনোই না) শব্দটি রয়েছে। এটি একটি পরিচিত ফাঁদ শব্দ (Trabocchetto)!';
      }
      if (/\b(solo|soltanto)\b/i.test(it)) {
        return 'প্রশ্নে "solo / soltanto" (শুধুমাত্র) ব্যবহার করা হয়েছে। অন্য কোনো অনুমতি বা পরিস্থিতি বাদ দিয়ে কেবল একটাই নির্দিষ্ট করায় এটি FALSO!';
      }
      if (/\bobbligatoriamente\b/i.test(it)) {
        return 'প্রশ্নে "obbligatoriamente" (বাধ্যতামূলকভাবে) রয়েছে। খেয়াল রাখুন এটি বাস্তব বাধ্যবাধকতা নাকি সাধারণ সতর্কতা।';
      }
      if (/\bin ogni caso\b/i.test(it)) {
        return 'প্রশ্নে "in ogni caso" (যেকোনো পরিস্থিতিতে) রয়েছে। এটি আরেকটি বহুল ব্যবহৃত ফাঁদ শব্দ!';
      }
    }
    return null;
  };

  // Open PatenteChatbot with Teacher Marco immediately focused on this question
  const askTeacherMarco = () => {
    const verdictStr = question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)';
    const prompt = `মারকো ভাই, এই প্রশ্নটা একটু সহজ বাংলায় ভালো করে বুঝিয়ে দেন তো:\n"${question.questionIt}"\n(অফিশিয়াল সঠিক উত্তর: ${verdictStr}${
      question.questionBn ? ` - বাংলা: "${question.questionBn}"` : ''
    })`;

    window.dispatchEvent(
      new CustomEvent('patente_ask_marco', {
        detail: {
          prompt,
          questionIt: question.questionIt,
          questionBn: question.questionBn,
          isCorrect: question.isCorrect,
        },
      })
    );
  };

  return (
    <div
      className={`bg-white dark:bg-[#12161F] rounded-2xl p-5 sm:p-7 space-y-5 transition-all duration-200 relative overflow-hidden border shadow-xs dark:shadow-sm min-h-[380px] flex flex-col justify-between ${
        shouldRevealOutcome
          ? isCorrect
            ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
            : 'border-rose-500/50 ring-2 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/20'
          : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header: Question # and Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-black border border-slate-200 dark:border-white/15 text-xs">
              Question #{index + 1}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-bold hidden md:inline truncate max-w-[200px]">
              {question.chapterTitleIt}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Audio Speed Toggle */}
            <button
              type="button"
              onClick={() => setSpeechRate(speechRate === 1.0 ? 0.85 : 1.0)}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
              title="Speech Speed"
            >
              <span>{speechRate === 1.0 ? '1.0x (Regular)' : '0.85x (Slow)'}</span>
            </button>

            {/* Oral Exam Headphone Audio Button */}
            <button
              type="button"
              onClick={() => speakItalian(question.questionIt)}
              title="Listen official Italian pronunciation (Oral Exam Mode)"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold shadow-2xs ${
                isSpeaking
                  ? 'bg-[#FB6C00] text-white border-[#FB6C00] font-black animate-pulse shadow-md shadow-[#FB6C00]/25'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
              }`}
            >
              <Headphones className={`w-3.5 h-3.5 shrink-0 ${isSpeaking ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} />
              <span>{isSpeaking ? 'Playing...' : 'Audio'}</span>
            </button>

            {/* English Translation Toggle (Hidden by default; click to reveal) */}
            <button
              type="button"
              onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
              title="Click to see English translation"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
                showEnglishTranslation
                  ? 'bg-blue-600 text-white border-transparent shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
              }`}
            >
              <span className="text-xs">🇬🇧</span>
              <span>{showEnglishTranslation ? 'Hide English' : 'English'}</span>
            </button>

            {/* Bangla Translation Toggle */}
            <button
              type="button"
              onClick={() => setShowBanglaTranslation(!showBanglaTranslation)}
              title="Toggle Bengali Meaning"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
                showBanglaTranslation
                  ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white border-transparent shadow-sm shadow-[#FB6C00]/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
              }`}
            >
              <Languages className={`w-3.5 h-3.5 shrink-0 ${showBanglaTranslation ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} />
              <span>{showBanglaTranslation ? 'বাংলা: ON' : 'বাংলা: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Question Content Area: Side-by-Side on Desktop if Sign Exists */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch min-h-[160px]">
          {/* Road Sign Graphic (if present) */}
          {(question.signCode || question.image) && (
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
              <RoadSign code={question.signCode || String(question.image)} size={110} />
              {question.signSymbol && (
                <span className="mt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-3 py-0.5 rounded-full border border-slate-200 dark:border-white/15 shadow-xs">
                  {question.signSymbol}
                </span>
              )}
            </div>
          )}

          {/* Question Text Area */}
          <div className={`${(question.signCode || question.image) ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col justify-between gap-3`}>
            {/* Official Italian Question Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-300 dark:border-white/15 shadow-xs flex items-center gap-1.5">
                    <span>🇮🇹</span>
                    <span>Official Ministerial Question</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* One-click Copy Question for AI Tutor */}
                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(question.questionIt)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#FB6C00] dark:text-slate-300 dark:hover:text-[#FB6C00] cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 transition"
                    title="ক্লিক করলেই প্রশ্নটি কপি হয়ে যাবে (AI টিউটর বা চ্যাটবটে পেস্ট করার জন্য)"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-600 font-black">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 shrink-0" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>

                  {/* Quick Audio trigger */}
                  <button
                    type="button"
                    onClick={() => speakItalian(question.questionIt)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen with Headphones'}</span>
                  </button>
                </div>
              </div>
              <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed tracking-wide pt-1">
                "{question.questionIt}"
              </p>
            </div>

            {/* Clean English Translation Box */}
            {showEnglishTranslation && (question.questionEn || getEnglishTranslation(question.questionIt)) && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 flex items-center gap-1">
                    <span>🇬🇧</span>
                    <span>English Translation</span>
                  </span>
                </div>
                <p className="text-sm sm:text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  "{question.questionEn || getEnglishTranslation(question.questionIt)}"
                </p>
              </div>
            )}

            {/* Prominent Bangla Translation Box */}
            {showBanglaTranslation && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {getBanglaTranslation(question.questionIt, question.questionBn)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Big High-Contrast VERO / FALSO Buttons */}
        {!hideAnswerButtons && (
          <div className={`${hideAnswerButtonsOnMobile ? 'hidden md:grid' : 'grid'} grid-cols-2 gap-3 sm:gap-4 pt-1`}>
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
        )}

        {/* Detailed Outcome & Explanation Box */}
        {shouldRevealOutcome && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            {/* Verdict Banner */}
            <div
              className={`p-3.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-black ${
                !isAnswered
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                  : isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {!isAnswered ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>
                  {!isAnswered
                    ? `ভুল করা প্রশ্ন — অফিশিয়াল সঠিক উত্তর: ${question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}`
                    : isCorrect
                    ? '✅ চমৎকার! আপনার উত্তর সঠিক হয়েছে।'
                    : `❌ উত্তর ভুল হয়েছে! সঠিক উত্তর: ${question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}`}
                </span>
              </div>
              {!isAnswered && (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hidden sm:inline">
                  পুনরায় পরীক্ষা করতে বাটনে ক্লিক করুন
                </span>
              )}
            </div>

            {/* ✨ শিক্ষক মারকোর সহজ ব্যাখ্যা (TEACHER MARCO EXPLANATION CARD) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 text-left ${
                !isAnswered || !isCorrect
                  ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/30 dark:from-amber-950/30 dark:via-slate-800/90 dark:to-orange-950/20 border-amber-300 dark:border-amber-600/50 shadow-md shadow-amber-500/5'
                  : 'bg-emerald-50/40 dark:bg-slate-800/80 border-emerald-300/70 dark:border-emerald-700/50'
              }`}
            >
              {/* Marco Card Header */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl select-none" role="img" aria-label="Marco">
                    🇮🇹🚗
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-700 dark:text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>শিক্ষক মারকোর সহজ ব্যাখ্যা (Teacher Marco)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {question.isCorrect ? 'কেন এই বিবৃতিটি VERO (সত্য)?' : 'কেন এই বিবৃতিটি FALSO (মিথ্যা)?'}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs shrink-0 ${
                    question.isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                  }`}
                >
                  {question.isCorrect ? 'সঠিক উত্তর: VERO' : 'সঠিক উত্তর: FALSO'}
                </span>
              </div>

              {/* Marco Bengali Explanation Body */}
              {isFetchingExplanation && !aiExplanation ? (
                <div className="flex items-center gap-2.5 py-2.5 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>শিক্ষক মারকো ট্রাফিক আইন ও ফাঁদ বিশ্লেষণ করে খাঁটি ব্যাখ্যা প্রস্তুত করছেন...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {getMarcoExplanation()}
                </p>
              )}

              {/* Marco Trap Warning (Trabocchetto) */}
              {getMarcoTrapTip() && (
                <div className="mt-3 p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-800 dark:text-amber-300 font-bold">
                      মারকোর ফাঁদ সতর্কতা (Trabocchetto Alert):
                    </strong>
                    <p className="mt-0.5 leading-relaxed">{getMarcoTrapTip()}</p>
                  </div>
                </div>
              )}

              {/* Interactive Ask Marco Button */}
              <div className="mt-3.5 pt-3 border-t border-amber-200/60 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={askTeacherMarco}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>মারকো ভাইকে আরও প্রশ্ন করুন</span>
                </button>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  🤖 লাইভ AI শিক্ষক মারকো উত্তর দিতে প্রস্তুত
                </span>
              </div>
            </div>

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
