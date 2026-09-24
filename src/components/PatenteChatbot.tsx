import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Volume2,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  MessageCircle,
  ShieldCheck,
  GripVertical
} from 'lucide-react';
import { HOTSHOT_QUESTIONS } from '../data/hotshotQuestions';
import { ROUND_QUESTIONS } from '../data/roundQuestions';
import { COMPREHENSIVE_VOCABULARY } from '../data/vocabData';
import type { StudentUser } from './StudentAuthModal';
import { speakItalian as playItalianFemaleVoice } from '../utils/italianSpeech';

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

  // Initial welcome message (Human teacher vibe)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Ciao ${currentUser ? currentUser.name.split(' ')[0] : 'Student'}! Sono Marco e il team di Patente Bangla. 👋\n\nআমরা সার্বক্ষণিক WhatsApp টিউটর সাপোর্টে লাইভ আছি। কুইজ অনুশীলনের সময় যে কোনো ইতালিয়ান প্রশ্ন না বুঝলে এখানে কপি করে পেস্ট করুন।\n\n১ মিনিটের মধ্যে আমি বলে দেব এটি **VERO (সত্য)** নাকি **FALSO (মিথ্যা)** এবং এর পেছনের ট্রাফিক আইন ও কঠিন শব্দের অর্থ সহজ বাংলায় বুঝিয়ে দেব! 🚗🇮🇹`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Speech pronunciation for Italian text using natural female voice
  const speakItalian = (text: string) => {
    playItalianFemaleVoice(text, { rate: 1.0 });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Draggable FAB State for mobile and desktop screens
  const [fabPosition, setFabPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Unified pointer drag handlers for both desktop mouse and mobile touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const clientX = e.clientX;
    const clientY = e.clientY;

    const bottomSafeMargin = window.innerWidth < 768 ? 85 : 20;
    const currentRect = fabRef.current?.getBoundingClientRect();
    const currentX = currentRect ? currentRect.left : (fabPosition?.x ?? (window.innerWidth - 210));
    const currentY = currentRect ? currentRect.top : (fabPosition?.y ?? (window.innerHeight - 60 - bottomSafeMargin));

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentX,
      initialY: currentY,
    };
    isDraggingRef.current = false;
    setIsPointerDown(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.hypot(deltaX, deltaY) > 8) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      const bottomSafeMargin = window.innerWidth < 768 ? 85 : 16;
      const buttonWidth = fabRef.current?.offsetWidth || 200;
      const buttonHeight = fabRef.current?.offsetHeight || 60;

      const newX = Math.max(8, Math.min(window.innerWidth - buttonWidth - 8, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(8, Math.min(window.innerHeight - buttonHeight - bottomSafeMargin, dragStartRef.current.initialY + deltaY));

      setFabPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const wasDragging = isDraggingRef.current;
    dragStartRef.current = null;
    setIsPointerDown(false);
    isDraggingRef.current = false;

    // Direct, reliable tap-to-open! If user did not drag, open the chatbot immediately:
    if (!wasDragging) {
      setIsOpen(true);
      setIsMinimized(false);
    }
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
        reply: `🔍 **লাইভ টিউটর বিশ্লেষণ সম্পন্ন!**\n\nঅফিশিয়াল পরীক্ষা অনুযায়ী এই বক্তব্যটি **${
          matchedHotshot.isCorrect ? '✅ VERO (সত্য)' : '❌ FALSO (মিথ্যা)'
        }**।\n\nনিচে শিক্ষক দলের বিস্তারিত বিশ্লেষণ দেওয়া হলো:`,
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
          reply: `🎯 **অফিশিয়াল প্রশ্ন শনাক্ত হয়েছে!**\n\nপরীক্ষা অনুযায়ী এর উত্তর **${
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
      'sempre',
      'mai',
      'solo',
      'obbligatoriamente',
      'in ogni caso',
      'qualsiasi',
      'tutti i veicoli',
    ];

    const foundTrap = trapWords.find((w) => cleanQuery.includes(w));
    if (foundTrap) {
      return {
        reply: `⚠️ **ট্র্যাপ শব্দ শনাক্ত হয়েছে: "${foundTrap.toUpperCase()}"**\n\nইতালিয়ান ড্রাইভিং লাইসেন্স কুইজে **${foundTrap}** (শুধুমাত্র / সবসময় / কোনো অবস্থাতেই না) শব্দগুলো থাকলে **৯৫% ক্ষেত্রে প্রশ্নটি FALSO (মিথ্যা)** হয়। কারণ ট্রাফিক বিধিতে প্রায় সবসময়ই কিছু ব্যতিক্রম বা বিশেষ পরিস্থিতি অনুমোদিত থাকে।\n\nপ্রশ্নটি ভালো করে পড়ুন এবং নিঃশর্ত বক্তব্যের ফাঁদে পা দেবেন না!`,
      };
    }

    // 4. Vocabulary Matcher
    const matchedVocab = COMPREHENSIVE_VOCABULARY.filter(
      (v) =>
        cleanQuery.includes(v.wordIt.toLowerCase()) ||
        cleanQuery.includes(v.meaningBn.toLowerCase())
    ).slice(0, 3);

    if (matchedVocab.length > 0) {
      const vocabText = matchedVocab
        .map(
          (v) =>
            `• **${v.wordIt}**: ${v.meaningBn} *(ক্যাটাগরি: ${v.category})*`
        )
        .join('\n');
      return {
        reply: `📖 **গুরুত্বপূর্ণ শব্দার্থ:**\n\n${vocabText}\n\nআপনার কুইজের পুরো বাক্যটি এখানে পেস্ট করুন, আমি সাথে সাথে VERO/FALSO এবং নিয়ম ব্যাখ্যা করে দেব।`,
      };
    }

    // 5. Default Teacher Support Guidance
    return {
      reply: `👨‍🏫 **লাইভ শিক্ষক দলের উত্তর:**\n\nআপনার প্রশ্নটি পেয়েছি। ইতালিয়ান লাইসেন্স পরীক্ষায় সঠিক উত্তর নিশ্চিত করতে যে কোনো কুইজ প্রশ্ন সরাসরি ইতালিয়ান ভাষায় হুবহু পেস্ট করুন।\n\nউদাহরণ:\n• *"La carreggiata è destinata alla sosta di emergenza..."*\n• *"In presenza del segnale di STOP..."*\n\n১ মিনিটের মধ্যে আমাদের সিস্টেম ও শিক্ষক দল আপনার জন্য সম্পূর্ণ বাংলা ভাবার্থ ও ফাঁদ বের করে দেবে! 🇮🇹🇧🇩`,
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Guaranteed fast human-like response under 600ms
    setTimeout(() => {
      const analysis = analyzeQuery(text);
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: analysis.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quizResult: analysis.quiz,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const quickActions = [
    { label: '🛑 STOP বনাম Precedenza', query: 'STOP এবং Dare Precedenza এর পার্থক্য কি?' },
    { label: '⚠️ ফাঁদ শব্দ (Trabocchetti)', query: 'কুইজে কোন কোন ফাঁদ শব্দ থাকলে FALSO হয়?' },
    { label: '🚗 Neopatentati গতিসীমা', query: 'নতুন লাইসেন্সধারীদের হাইওয়েতে সর্বোচ্চ গতি কত?' },
    { label: '🍷 অ্যালকোহল লিমিট 0.0', query: 'নেওপাতেন্তাতোদের জন্য অ্যালকোহল রক্তের মাত্রা কত?' },
  ];

  return (
    <div
      ref={fabRef}
      style={
        fabPosition && !isOpen
          ? { position: 'fixed', left: `${fabPosition.x}px`, top: `${fabPosition.y}px`, zIndex: 50 }
          : undefined
      }
      className={!fabPosition || isOpen ? 'fixed bottom-52 sm:bottom-48 md:bottom-28 right-3 sm:right-6 z-50 flex flex-col items-end' : ''}
    >
      {/* Moveable WhatsApp Floating Action Button */}
      {!isOpen && (
        <div
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(true);
              setIsMinimized(false);
            }
          }}
          className="flex items-center select-none touch-none cursor-grab active:cursor-grabbing transition-transform py-2.5 pl-3 pr-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm shadow-2xl shadow-emerald-600/40 hover:scale-[1.03] active:scale-95 border-2 border-white/50 gap-2.5"
          style={{ transform: isPointerDown ? 'scale(1.05)' : undefined }}
        >
          {/* Visual Drag Gripper for both Mobile & Desktop */}
          <div
            title="Drag with finger or mouse to move anywhere"
            className="flex items-center text-emerald-100/90 shrink-0"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <MessageCircle className="w-5 h-5 fill-current text-white shrink-0" />
          <div className="text-left leading-tight">
            <span className="block text-xs font-black">24/7 Live Support</span>
            <span className="text-[10px] opacity-90 block font-bold">Replies &lt; 1 min</span>
          </div>
        </div>
      )}

      {/* Authentic WhatsApp Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#EFEAE2] dark:bg-[#0B141A] border border-emerald-800/40 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            currentTheme === 'sepia' ? 'theme-sepia' : currentTheme === 'dark' ? 'dark' : ''
          } ${
            isMinimized
              ? 'w-72 sm:w-80 h-16'
              : 'w-[94vw] sm:w-[420px] md:w-[460px] h-[540px] max-h-[calc(100vh-160px)] md:max-h-[85vh]'
          }`}
        >
          {/* WhatsApp Header: Deep Emerald Green (#075E54) */}
          <div className="bg-[#075E54] dark:bg-[#1F2C34] p-3 sm:p-3.5 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-inner border border-white/30">
                  👨‍🏫
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight">Patente Live Support</h4>
                  <span className="text-[10px] bg-emerald-600/80 px-1.5 py-0.2 rounded font-mono font-bold">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium flex items-center gap-1">
                  <span>🟢 Online • Replies in &lt; 1 minute</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/90">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Guaranteed 1-Minute Support Leaflet Banner */}
              <div className="p-2.5 bg-[#DCF8C6] dark:bg-emerald-950/60 border-b border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2 text-xs text-emerald-950 dark:text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-left leading-tight">
                  <span className="font-bold block text-[11px]">
                    ⚡ 24/7 Guaranteed Fast Support (১ মিনিটের মধ্যে নিশ্চিত উত্তর):
                  </span>
                  <span className="text-[10px] text-emerald-900/80 dark:text-emerald-300">
                    দিন হোক বা রাত, যেকোনো কঠিন কুইজ কপি করে পেস্ট করুন। আমাদের শিক্ষক দল ১ মিনিটের মধ্যে সহজ ব্যাখ্যা দেবে।
                  </span>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 border-b border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(action.query)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#075E54] hover:border-emerald-400 shrink-0 transition cursor-pointer shadow-2xs"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Messages Body (WhatsApp Chat Canvas) */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl p-3 space-y-1.5 shadow-xs relative text-left ${
                        msg.sender === 'user'
                          ? 'bg-[#E7FFDB] dark:bg-[#005C4B] text-slate-900 dark:text-white rounded-tr-none'
                          : 'bg-white dark:bg-[#202C33] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {/* Message Text */}
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Quiz Breakdown Card if matched */}
                      {msg.quizResult && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-1.5">
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
                              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                              title="Listen in Italian"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>উচ্চারণ</span>
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">
                              Domanda Ufficiale:
                            </span>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs italic">
                              "{msg.quizResult.questionIt}"
                            </p>
                          </div>

                          <div className="pt-1 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-[#075E54] dark:text-emerald-400 block mb-0.5">
                              কেন এটি সঠিক বা ভুল (Spiegazione):
                            </span>
                            <p className="leading-relaxed">{msg.quizResult.explanationBn}</p>
                          </div>

                          {msg.quizResult.trapTipBn && (
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[10px] font-medium">
                              ⚠️ {msg.quizResult.trapTipBn}
                            </div>
                          )}

                          {msg.quizResult.vocab && msg.quizResult.vocab.length > 0 && (
                            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1 text-[10px]">
                              {msg.quizResult.vocab.map((v, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                  <strong>{v.wordIt}</strong>: {v.meaningBn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* WhatsApp Style Footer (Timestamp & Blue Checkmarks) */}
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-60 pt-0.5">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'user' && (
                          <span className="text-sky-500 font-bold">✓✓</span>
                        )}
                        {msg.sender === 'ai' && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="hover:opacity-100 flex items-center gap-0.5 cursor-pointer ml-1"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-center text-slate-500 text-xs italic bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full w-fit shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Marco sta scrivendo la risposta...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* WhatsApp Input Bar */}
              <div className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-[#F0F2F5] dark:bg-[#1F2C34] shrink-0">
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
                    placeholder="Scrivi un messaggio o incolla il quiz..."
                    className="flex-1 py-2 px-3.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2A3942] text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-40 text-white font-bold transition cursor-pointer shadow-sm shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 px-2">
                  <span>Guaranteed response &lt; 1 min</span>
                  <button
                    type="button"
                    onClick={onOpenPaywall}
                    className="text-[#075E54] dark:text-emerald-400 font-bold hover:underline"
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
