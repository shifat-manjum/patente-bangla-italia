import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  Volume2,
  Copy,
  Check,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { HOTSHOT_QUESTIONS } from '../data/hotshotQuestions';
import { ROUND_QUESTIONS } from '../data/roundQuestions';
import { COMPREHENSIVE_VOCABULARY } from '../data/vocabData';
import type { StudentUser } from './StudentAuthModal';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quizResult?: {
    isCorrect: boolean;
    questionIt: string;
    questionBn?: string;
    explanationBn: string;
    trapTipBn?: string;
    vocab?: Array<{ wordIt: string; meaningBn: string }>;
  };
}

interface PatenteChatbotProps {
  currentTheme: 'light' | 'sepia' | 'dark';
  currentUser: StudentUser | null;
  onOpenPaywall: () => void;
}

export const PatenteChatbot: React.FC<PatenteChatbotProps> = ({
  currentTheme,
  currentUser,
  onOpenPaywall,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Ciao ${currentUser ? currentUser.name.split(' ')[0] : 'Student'}! 👋 আমি আপনার **Maestro Patente AI** সহকারী।\n\nআপনি যে কোনো ইতালিয়ান কুইজের প্রশ্ন এখানে কপি করে পেস্ট করতে পারেন। আমি সাথে সাথে বলে দেব এটি **VERO (সত্য)** নাকি **FALSO (মিথ্যা)** এবং সহজ বাংলায় এর পেছনের ট্রাফিক নিয়ম ও ফাঁদ বুঝিয়ে দেব।\n\nনিচের বিষয়গুলো দিয়েও এখনই জানতে পারেন:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Speech pronunciation for Italian text
  const speakItalian = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Intelligent Response Generator & Knowledge Matcher
  const analyzeQuery = (query: string): { reply: string; quiz?: any } => {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Check if user pasted an existing hotshot question
    const matchedHotshot = HOTSHOT_QUESTIONS.find(
      (q) =>
        q.questionIt.toLowerCase().includes(cleanQuery) ||
        cleanQuery.includes(q.questionIt.toLowerCase().slice(0, 30))
    );

    if (matchedHotshot) {
      return {
        reply: `🔍 **অফিশিয়াল প্রশ্ন শনাক্ত করা হয়েছে!**\n\nএই বক্তব্যটি পরীক্ষা অনুযায়ী **${
          matchedHotshot.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (মিথ্যা)'
        }**।\n\nনিচে বিস্তারিত বাংলা ব্যাখ্যা ও ফাঁদ বিশ্লেষণ দেওয়া হলো:`,
        quiz: {
          isCorrect: matchedHotshot.isCorrect,
          questionIt: matchedHotshot.questionIt,
          questionBn: matchedHotshot.questionBn,
          explanationBn: matchedHotshot.explanationBn,
          trapTipBn: matchedHotshot.trapTipBn,
          vocab: matchedHotshot.vocabulary,
        },
      };
    }

    // 2. Check in all 20 rounds (600 official questions)
    for (const roundList of Object.values(ROUND_QUESTIONS)) {
      const match = roundList.find((q) => {
        const it = q.questionIt.toLowerCase();
        return (
          cleanQuery.length > 15 &&
          (it.includes(cleanQuery) || cleanQuery.includes(it.slice(0, 35)))
        );
      });

      if (match) {
        return {
          reply: `🎯 **রাউন্ডের অফিশিয়াল কুইজ পাওয়া গেছে!**\n\nমিনিস্টেরিয়াল পরীক্ষা অনুযায়ী এই প্রশ্নের উত্তর **${
            match.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (মিথ্যা)'
          }**।`,
          quiz: {
            isCorrect: match.isCorrect,
            questionIt: match.questionIt,
            questionBn: match.questionBn,
            explanationBn: match.explanationBn,
            vocab: match.vocabulary,
          },
        };
      }
    }

    // 3. Keyword / Trap Word Check (Trabocchetti)
    const trapWords = [
      'esclusivamente',
      'soltanto',
      'solo',
      'in ogni caso',
      'mai',
      'sempre',
      'tassativamente',
      'obbligatoriamente',
      'qualsiasi',
    ];

    const detectedTrap = trapWords.find((w) => cleanQuery.includes(w));
    if (detectedTrap) {
      return {
        reply: `⚠️ **সতর্কতা: ফাঁদ শব্দ (Trabocchetto) শনাক্ত হয়েছে!**\n\nআপনার প্রশ্নে **"${detectedTrap.toUpperCase()}"** শব্দটি রয়েছে।\n\n📌 **মিনিস্টেরিয়াল কুইজ রুল:**\nইতালিয়ান ড্রাইভিং লাইসেন্স কুইজে প্রায় ৯০% ক্ষেত্রে যখন **${detectedTrap}** (শুধুমাত্র / কখনোই না / সবসময়) শব্দটি ব্যবহার করা হয়, তখন উত্তরটি **❌ FALSO (ভুল)** হয়। কারণ ট্রাফিক বিধানে প্রায় প্রতিটি নিয়মেরই কিছু না কিছু ব্যতিক্রম বা জরুরি ছাড় থাকে।\n\nসরাসরি অন্ধভাবে উত্তর না দিয়ে পুরো বাক্যটির অর্থ মিলিয়ে দেখুন।`,
      };
    }

    // 4. Common Autoscuola FAQ Queries
    if (
      cleanQuery.includes('পরীক্ষা') ||
      cleanQuery.includes('exam') ||
      cleanQuery.includes('ভুল') ||
      cleanQuery.includes('error') ||
      cleanQuery.includes('কত') ||
      cleanQuery.includes('কয়টি')
    ) {
      return {
        reply: `📋 **অফিশিয়াল মিনিস্টেরিয়াল পরীক্ষার নিয়ম (Esame Patente B 2026):**\n\n1. **মোট প্রশ্ন:** ৩০টি কুইজ (Vero/Falso)।\n2. **সময়:** ২০ মিনিট।\n3. **পাস মার্ক:** সর্বোচ্চ **৩টি ভুল** পর্যন্ত পাস। ৪টি বা তার বেশি ভুল হলে অনুত্তীর্ণ (Bocciato)।\n4. **পরীক্ষার মাধ্যম:** মটোরাইজেশনের ডিজিটাল টাচস্ক্রিন কম্পিউটারে এককভাবে পরীক্ষা হয়।\n\n💡 **পরামর্শ:** আমাদের ২০টি ফ্রি রাউন্ডে নিয়মিত প্র্যাকটিস করুন। প্রতিটি রাউন্ডে পাস করলেই আসল পরীক্ষায় পাস করা সহজ হবে!`,
      };
    }

    if (
      cleanQuery.includes('foglio rosa') ||
      cleanQuery.includes('ফলিও') ||
      cleanQuery.includes('ড্রাইভ') ||
      cleanQuery.includes('গাড়ি চালানো')
    ) {
      return {
        reply: `🪪 **ফলিও রোজা ও প্র্যাকটিক্যাল ড্রাইভ গাইড:**\n\n1. **মেয়াদ:** থিওরি পাস করার পর ফলিও রোজার মেয়াদ **১ বছর** থাকে। এই ১ বছরে সর্বোচ্চ ৩ বার প্র্যাকটিক্যাল ড্রাইভিং পরীক্ষা দেওয়া যায়।\n2. **বাধ্যতামূলক ক্লাস:** অটোস্কুল থেকে অন্তত **৬ ঘণ্টা সার্টিফাইড ড্রাইভ** (২ ঘণ্টা হাইওয়ে, ২ ঘণ্টা রাতে, ২ ঘণ্টা শহরের বাইরে) নেওয়া বাধ্যতামূলক।\n3. **পাশে কে থাকবে:** যার অন্তত ১০ বছরের বৈধ ইতালিয়ান লাইসেন্স আছে এবং বয়স ৬৫ বছরের কম।`,
      };
    }

    if (
      cleanQuery.includes('pro') ||
      cleanQuery.includes('পাস') ||
      cleanQuery.includes('vip') ||
      cleanQuery.includes('টাকা') ||
      cleanQuery.includes('49') ||
      cleanQuery.includes('কোর্স')
    ) {
      return {
        reply: `⭐ **প্রো স্টুডেন্ট পাস (Pro Student Pass - €49):**\n\n- আপনি প্রথম ২০টি রাউন্ড (৬০০ প্রশ্ন) সম্পূর্ণ **বিনামূল্যে** পড়ছেন।\n- বাকি ২২০টি রাউন্ড, সম্পূর্ণ ৭,১৬৫টি মিনিস্টেরিয়াল কুইজ, অফিশিয়াল মক টেস্ট ও WhatsApp স্টাডি গ্রুপের জন্য প্রো স্টুডেন্ট পাস প্রয়োজন।\n- এটি এককালীন লাইফটাইম অ্যাক্সেস (কোনো মাসিক ফি নেই)।\n\nউপরে ড্যাশবোর্ডে **"Pro Student Pass (€49)"** বাটনে ক্লিক করে এখনই আনলক করতে পারেন।`,
      };
    }

    // 5. Check vocabulary match
    const vocabMatch = COMPREHENSIVE_VOCABULARY.find(
      (v) =>
        cleanQuery.includes(v.wordIt.toLowerCase()) ||
        cleanQuery.includes(v.meaningBn.toLowerCase())
    );

    if (vocabMatch) {
      return {
        reply: `📖 **শব্দার্থ সন্ধান (Vocabolario):**\n\n🇮🇹 **${vocabMatch.wordIt}** ${
          vocabMatch.phoneticBn ? `[${vocabMatch.phoneticBn}]` : ''
        }\n🇧🇩 বাংলা অর্থ: **${vocabMatch.meaningBn}**\n\n${
          vocabMatch.trapAlert ? `⚠️ পরীক্ষার ফাঁদ টিপস: ${vocabMatch.trapAlert}` : ''
        }`,
      };
    }

    // 6. Generic intelligent coaching fallback
    return {
      reply: `💡 **ইতালিয়ান ট্রাফিক কোড বিশ্লেষণ:**\n\nআপনি লিখেছেন: *"י${query}"*\n\n১. ইতালির ট্রাফিক কোডে (Codice della Strada) সর্বদা পথচারী (Pedoni), সাইকেল এবং জরুরি গাড়িকে (Soccorso) প্রাধান্য দেওয়া হয়।\n২. প্রশ্নে যদি **"Di norma" (সাধারণত)** থাকে তবে এটি প্রায়ই **VERO** হয়।\n৩. যদি **"In ogni caso" (যেকোনো পরিস্থিতিতে)** বা **"Sempre" (সবসময়)** থাকে তবে অধিকাংশ ক্ষেত্রে **FALSO** হয়।\n\nআপনি কি নির্দিষ্ট কোনো কুইজ বা শব্দের অর্থ জানতে চান? সম্পূর্ণ কুইজটি পেস্ট করে দেখুন!`,
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, quiz } = analyzeQuery(query);
      const aiMsg: Message = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quizResult: quiz,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  // Quick Action Chips
  const quickActions = [
    { label: '⚠️ ফাঁদ শব্দসমূহ', query: 'কুইজের ফাঁদ শব্দগুলো কী কী এবং কীভাবে বুঝব?' },
    { label: '📋 পরীক্ষার নিয়ম', query: 'ইতালিয়ান ড্রাইভিং লাইসেন্স পরীক্ষার নিয়ম কী এবং কয়টি ভুল পাস?' },
    { label: '🚗 ফলিও রোজা', query: 'Foglio Rosa নিয়ে গাড়ি চালানোর নিয়ম কী?' },
    { label: '⭐ Pro Student Pass', query: 'Pro Student Pass এর সুবিধা ও ফি কত?' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative py-3 px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] text-white font-black text-xs sm:text-sm shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 border-2 border-white/40"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <Bot className="w-5 h-5 text-white" />
          <span className="tracking-tight">AI Maestro Tutor • কুইজ সহকারী</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold">
            24/7 AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            currentTheme === 'sepia' ? 'theme-sepia' : currentTheme === 'dark' ? 'dark' : ''
          } ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[94vw] sm:w-[420px] md:w-[460px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 via-[#FB6C00] to-amber-500 p-3.5 sm:p-4 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold text-sm shadow-inner">
                🇮🇹
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm tracking-tight">Maestro Patente AI</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-white/90 font-medium">
                  ইতালিয়ান কুইজ ও নিয়মের সার্বক্ষণিক শিক্ষক
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Action Chips Bar */}
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(action.query)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#FB6C00] hover:border-orange-300 shrink-0 transition cursor-pointer shadow-2xs"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-[#FB6C00] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#FB6C00] text-white rounded-br-xs font-medium'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      {/* Message Text */}
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Quiz Breakdown Card if matched */}
                      {msg.quizResult && (
                        <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                msg.quizResult.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {msg.quizResult.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (ভুল)'}
                            </span>
                            <button
                              type="button"
                              onClick={() => speakItalian(msg.quizResult!.questionIt)}
                              className="text-slate-500 hover:text-orange-500 flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                              title="Listen in Italian"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>উচ্চারণ</span>
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">
                              Official Question:
                            </span>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs italic">
                              "{msg.quizResult.questionIt}"
                            </p>
                          </div>

                          <div className="pt-1 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-[#FB6C00] block mb-0.5">কেন এটি সঠিক বা ভুল:</span>
                            <p className="leading-relaxed">{msg.quizResult.explanationBn}</p>
                          </div>

                          {msg.quizResult.trapTipBn && (
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[10px] font-medium">
                              ⚠️ {msg.quizResult.trapTipBn}
                            </div>
                          )}

                          {msg.quizResult.vocab && msg.quizResult.vocab.length > 0 && (
                            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1 text-[10px]">
                              {msg.quizResult.vocab.map((v, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                  <strong>{v.wordIt}</strong>: {v.meaningBn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer Actions (Copy / Timestamp) */}
                      <div className="flex items-center justify-between text-[10px] opacity-70 pt-1">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'ai' && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="hover:opacity-100 flex items-center gap-0.5 cursor-pointer"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>কপি হয়েছে</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                    <Bot className="w-4 h-4 text-orange-500 animate-spin" />
                    <span>Maestro উত্তর তৈরি করছেন...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="কুইজ প্রশ্ন বা শব্দ এখানে পেস্ট করুন..."
                    className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-[#FB6C00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold transition cursor-pointer shadow-sm shrink-0"
                    title="Send question"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
                  <span>যেকোনো প্রশ্ন কপি-পেস্ট করুন</span>
                  <button
                    type="button"
                    onClick={onOpenPaywall}
                    className="text-[#FB6C00] font-bold hover:underline"
                  >
                    Pro Student Pass
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
