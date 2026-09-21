import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Volume2,
  Image as ImageIcon,
  Database,
  Layers,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { ALL_200_QUESTIONS } from '../data/roundQuestions';
import { RoadSign } from './RoadSign';

interface AdminQuestionExplorerProps {
  onBackToApp: () => void;
}

export const AdminQuestionExplorer: React.FC<AdminQuestionExplorerProps> = ({ onBackToApp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [selectedAnswerFilter, setSelectedAnswerFilter] = useState<'all' | 'vero' | 'falso'>('all');
  const [onlyWithImage, setOnlyWithImage] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Audio speaker
  const speakItalian = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.88;
      utterance.onstart = () => setPlayingId(id);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return ALL_200_QUESTIONS.filter((q) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchIt = q.questionIt.toLowerCase().includes(query);
        const matchBn = q.questionBn.toLowerCase().includes(query);
        const matchId = q.id.toLowerCase().includes(query);
        if (!matchIt && !matchBn && !matchId) return false;
      }

      // Round
      if (selectedRound !== 'all') {
        const roundNum = parseInt(selectedRound, 10);
        if (q.roundId !== roundNum) return false;
      }

      // Answer
      if (selectedAnswerFilter === 'vero' && !q.isCorrect) return false;
      if (selectedAnswerFilter === 'falso' && q.isCorrect) return false;

      // Image
      if (onlyWithImage && !q.image && !q.signCode) return false;

      return true;
    });
  }, [searchQuery, selectedRound, selectedAnswerFilter, onlyWithImage]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Overall Stats
  const stats = useMemo(() => {
    const totalActive = ALL_200_QUESTIONS.length;
    const totalVero = ALL_200_QUESTIONS.filter((q) => q.isCorrect).length;
    const totalFalso = ALL_200_QUESTIONS.filter((q) => !q.isCorrect).length;
    const totalWithImages = ALL_200_QUESTIONS.filter((q) => q.image || q.signCode).length;
    return { totalActive, totalVero, totalFalso, totalWithImages };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn text-left">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-box p-6 rounded-3xl bg-[#141012]/95 border border-[#FB6C00]/30 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E73F1E]/15 border border-[#FB6C00]/30 text-xs font-black text-[#FFDD9C] mb-2">
            <Database className="w-3.5 h-3.5 text-[#F9B637]" />
            <span>অ্যাডমিন প্রশ্ন ব্যাংক কন্ট্রোল প্যানেল (Admin Master Explorer)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            সকল প্রশ্ন ও উত্তর ডেটাবেস
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ইতালির মোটরিজ্জাসিওনের অফিশিয়াল প্রশ্ন, বাংলা অনুবাদ, ট্রিকস এবং রোড সাইন একসাথে দেখার কন্ট্রোল প্যানেল।
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToApp}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black border border-white/20 transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল অ্যাপে ফিরুন</span>
        </button>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#141012]/90 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>সক্রিয় প্রশ্ন (Active)</span>
            <Layers className="w-4 h-4 text-[#FB6C00]" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalActive}টি</div>
          <div className="text-[11px] text-[#F9B637] font-medium">রাউন্ড ১-৭ ফ্রি কোটা</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141012]/90 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>মোট সরকারি ভাণ্ডার</span>
            <Database className="w-4 h-4 text-[#FFDD9C]" />
          </div>
          <div className="text-2xl font-black text-[#FFDD9C]">৭,১৬৫টি</div>
          <div className="text-[11px] text-slate-400 font-medium">সম্পূর্ণ অফিশিয়াল ডেটা</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141012]/90 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>VERO (সত্য) প্রশ্ন</span>
            <CheckCircle2 className="w-4 h-4 text-[#F9B637]" />
          </div>
          <div className="text-2xl font-black text-[#F9B637]">{stats.totalVero}টি</div>
          <div className="text-[11px] text-slate-400 font-medium">{Math.round((stats.totalVero / stats.totalActive) * 100)}% সত্য উত্তর</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141012]/90 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>FALSO (মিথ্যা) প্রশ্ন</span>
            <XCircle className="w-4 h-4 text-[#E73F1E]" />
          </div>
          <div className="text-2xl font-black text-[#E73F1E]">{stats.totalFalso}টি</div>
          <div className="text-[11px] text-slate-400 font-medium">{Math.round((stats.totalFalso / stats.totalActive) * 100)}% মিথ্যা উত্তর</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-box p-5 rounded-3xl bg-[#141012]/90 border border-[#FFDD9C]/15 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ইতালিয়ান বা বাংলায় খুঁজুন (যেমন: stop, precedenza, গতিসীমা, পার্কিং, r1_q5)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0f0c0e] border border-white/15 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#FB6C00]"
            />
          </div>

          {/* Round Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedRound}
              onChange={(e) => {
                setSelectedRound(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-2xl bg-[#0f0c0e] border border-white/15 text-xs text-white focus:outline-none focus:border-[#FB6C00] cursor-pointer w-full sm:w-auto"
            >
              <option value="all">সব রাউন্ড (২০০টি প্রশ্ন)</option>
              <option value="1">রাউন্ড ১: বিপদ সংকেত (৩০টি)</option>
              <option value="2">রাউন্ড ২: অগ্রাধিকার ও স্টপ (৩০টি)</option>
              <option value="3">রাউন্ড ৩: গতিসীমা ও দূরত্ব (৩০টি)</option>
              <option value="4">রাউন্ড ৪: পার্কিং ও ওভারটেক (৩০টি)</option>
              <option value="5">রাউন্ড ৫: নিষেধাজ্ঞা ও বাধ্যবাধকতা (৩০টি)</option>
              <option value="6">রাউন্ড ৬: দাগ ও ট্রাফিক লাইট (৩০টি)</option>
              <option value="7">রাউন্ড ৭: ফাইনাল মক টেস্ট (২০টি)</option>
            </select>

            {/* Answer Filter */}
            <select
              value={selectedAnswerFilter}
              onChange={(e) => {
                setSelectedAnswerFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-2xl bg-[#0f0c0e] border border-white/15 text-xs text-white focus:outline-none focus:border-[#FB6C00] cursor-pointer w-full sm:w-auto"
            >
              <option value="all">সকল উত্তর (Vero + Falso)</option>
              <option value="vero">শুধুমাত্র VERO (সত্য)</option>
              <option value="falso">শুধুমাত্র FALSO (মিথ্যা)</option>
            </select>
          </div>
        </div>

        {/* Checkbox Toggles & Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithImage}
                onChange={(e) => {
                  setOnlyWithImage(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-[#FB6C00] bg-slate-950 border-white/20 focus:ring-0"
              />
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>শুধুমাত্র রোড সাইনযুক্ত প্রশ্ন</span>
            </label>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>
              ফিল্টারে পাওয়া গেছে: <strong className="text-emerald-400">{filteredQuestions.length}</strong>টি প্রশ্ন
            </span>
            <span>|</span>
            <div className="flex items-center gap-1.5">
              <span>প্রতি পৃষ্ঠায়:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-white/15 text-xs text-white"
              >
                <option value={20}>২০</option>
                <option value={50}>৫০</option>
                <option value={100}>১০০</option>
                <option value={200}>সব (২০০)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.map((q, idx) => {
          const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
          const isPlaying = playingId === q.id;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-3xl glass-box border transition-all space-y-4 ${
                q.isCorrect
                  ? 'border-[#F9B637]/30 bg-[#141012]/85 hover:border-[#F9B637]/50'
                  : 'border-[#E73F1E]/30 bg-[#141012]/85 hover:border-[#E73F1E]/50'
              }`}
            >
              {/* Question Header: ID, Round, Answer badge, Audio */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs font-black border border-white/10">
                    #{globalIndex} ({q.id})
                  </span>
                  {q.roundId && (
                    <span className="px-2.5 py-1 rounded-xl bg-[#E73F1E]/20 text-[#FFDD9C] text-xs font-bold border border-[#FB6C00]/30">
                      রাউন্ড #{q.roundId}
                    </span>
                  )}
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                    {q.chapterTitleBn}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio Listen */}
                  <button
                    type="button"
                    onClick={() => speakItalian(q.id, q.questionIt)}
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isPlaying
                        ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 border-[#FFDD9C] animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                    title="ইতালিয়ান উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#F9B637]" />
                    <span className="hidden sm:inline">উচ্চারণ</span>
                  </button>

                  {/* VERO / FALSO Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                      q.isCorrect
                        ? 'bg-[#F9B637]/20 text-[#FFDD9C] border border-[#F9B637]/40'
                        : 'bg-[#E73F1E]/20 text-rose-200 border border-[#E73F1E]/40'
                    }`}
                  >
                    {q.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#F9B637]" />
                        <span>VERO (সত্য)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-[#E73F1E]" />
                        <span>FALSO (মিথ্যা)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Body: Road Sign + Italian & Bengali */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Road Sign Image (if present) */}
                {(q.image || q.signCode) && (
                  <div className="md:col-span-3 flex items-center justify-center p-3 rounded-2xl bg-[#0f0c0e]/90 border border-white/10">
                    <RoadSign code={q.signCode || String(q.image)} size={95} />
                  </div>
                )}

                {/* Question Texts */}
                <div className={`${(q.image || q.signCode) ? 'md:col-span-9' : 'md:col-span-12'} space-y-3`}>
                  {/* Italian Text */}
                  <div className="p-3.5 rounded-2xl bg-[#0f0c0e]/80 border border-white/10 space-y-1">
                    <div className="text-[10px] font-black text-[#F9B637] uppercase tracking-wider flex items-center gap-1">
                      <span>🇮🇹</span>
                      <span>অফিসিয়াল ইতালিয়ান প্রশ্ন:</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      "{q.questionIt}"
                    </p>
                  </div>

                  {/* Bengali Translation */}
                  <div className="p-3.5 rounded-2xl bg-[#1a1415]/70 border border-[#FB6C00]/25 space-y-1">
                    <div className="text-[10px] font-black text-[#FFDD9C] uppercase tracking-wider flex items-center gap-1">
                      <span>🇧🇩</span>
                      <span>সহজ বাংলা অনুবাদ:</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                      {q.questionBn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Explanation & Trap Tips */}
              <div className="p-3.5 rounded-2xl bg-[#0f0c0e]/90 border border-[#FFDD9C]/15 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#F9B637] font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>কেন {q.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}? (যুক্তি ও ব্যাখ্যা):</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {q.explanationBn}
                </p>

                {q.trapTipBn && (
                  <div className="p-2.5 rounded-xl bg-[#E73F1E]/15 border border-[#FB6C00]/30 text-[#FFDD9C] text-[11px] font-medium">
                    ⚠️ <strong>পরীক্ষার ফাঁদ শব্দ (Trap Tip):</strong> {q.trapTipBn}
                  </div>
                )}

                {/* Vocabulary Tags */}
                {q.vocabulary && q.vocabulary.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">শব্দার্থ:</span>
                    {q.vocabulary.map((v, vIdx) => (
                      <span
                        key={vIdx}
                        className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300"
                      >
                        <strong className="text-white">{v.wordIt}</strong>: <span className="text-[#F9B637]">{v.meaningBn}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {paginatedQuestions.length === 0 && (
          <div className="glass-box p-12 rounded-3xl text-center space-y-3 border border-white/10">
            <Search className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">কোনো প্রশ্ন পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">
              অনুসন্ধানের শব্দ পরিবর্তন করুন অথবা ফিল্টার রিসেট করুন।
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="glass-box p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs border border-[#FFDD9C]/15">
          <span className="text-slate-400">
            পৃষ্ঠা <strong className="text-white">{currentPage}</strong> / {totalPages} (মোট {filteredQuestions.length}টি প্রশ্ন)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold border border-white/10 transition cursor-pointer disabled:cursor-not-allowed"
            >
              পূর্ববর্তী (Previous)
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-xl font-black text-xs transition cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold border border-white/10 transition cursor-pointer disabled:cursor-not-allowed"
            >
              পরবর্তী (Next)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
