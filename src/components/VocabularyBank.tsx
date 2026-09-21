import React, { useState } from 'react';
import { BookmarkCheck, Search, Volume2, AlertTriangle, Sparkles } from 'lucide-react';
import { COMPREHENSIVE_VOCABULARY, CATEGORIES } from '../data/vocabData';

export const VocabularyBank: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const speakItalian = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'it-IT';
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeakingWord(word);
      utterance.onend = () => setSpeakingWord(null);
      utterance.onerror = () => setSpeakingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredVocab = COMPREHENSIVE_VOCABULARY.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesSearch =
      item.wordIt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaningBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phoneticBn && item.phoneticBn.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-[#FB6C00]/30 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#FB6C00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E73F1E]/15 border border-[#FB6C00]/30 text-xs font-black text-[#FFDD9C]">
            <BookmarkCheck className="w-4 h-4 text-[#F9B637]" />
            <span>অফিশিয়াল শব্দকোষ (Dizionario Ufficiale Ministeriale)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ড্রাইভিং লাইসেন্স পরীক্ষার ১২০+ কঠিন শব্দার্থ
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            ইতালিয়ান কুইজে বারবার আসা কঠিন শব্দগুলো এবং কুইজের ফাঁদ শব্দ (Trabocchetti) জানলে যেকোনো প্রশ্নের সঠিক উত্তর মুহূর্তেই দেওয়া সম্ভব। শব্দটির পাশে স্পিকার আইকনে চাপ দিয়ে খাঁটি ইতালিয়ান উচ্চারণ শুনে নিন।
          </p>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 shadow-[#FB6C00]/25 font-black ring-2 ring-[#FFDD9C]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <span>{cat.labelBn}</span>
              <span className="text-[11px] opacity-70 hidden md:inline">({cat.labelIt})</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="glass-box rounded-3xl p-4 sm:p-5 flex items-center gap-3 border border-[#FFDD9C]/20 shadow-lg">
        <Search className="w-5 h-5 text-[#FB6C00] shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ইতালিয়ান বা বাংলায় শব্দ খুঁজুন (যেমন: Carreggiata, Sorpasso, ওভারটেকিং, পার্কিং)..."
          className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white cursor-pointer px-3 py-1 bg-white/5 rounded-xl transition"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Trap Words Advisory Note if Trap category is selected */}
      {selectedCategory === 'trap' && (
        <div className="p-4 rounded-2xl bg-[#E73F1E]/15 border border-[#FB6C00]/40 text-[#FFDD9C] flex items-start gap-3 text-xs sm:text-sm shadow-md animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-[#F9B637] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black text-[#FFDD9C]">
              💡 কুইজের ফাঁদ শব্দের কৌশল (Trucchi e Trabocchetti):
            </p>
            <p className="leading-relaxed text-slate-200">
              ইতালির কুইজে <strong className="text-[#FFDD9C]">Mai, Sempre, Esclusivamente, Tassativamente</strong> জাতীয় চরম শব্দ থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong className="text-[#E73F1E]">FALSO</strong> হয়। পক্ষান্তরে <strong className="text-[#F9B637]">Di norma, Opportune cautele, Prudenza</strong> থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong className="text-[#F9B637]">VERO</strong> হয়!
            </p>
          </div>
        </div>
      )}

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocab.map((item) => {
          const isSpeaking = speakingWord === item.wordIt;
          return (
            <div
              key={item.id}
              className="glass-box rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:border-[#FB6C00]/50 hover:bg-[#181316]/90 group border border-[#FFDD9C]/10 shadow-md"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-white group-hover:text-[#F9B637] transition tracking-tight">
                    {item.wordIt}
                  </span>
                  {item.phoneticBn && (
                    <span className="text-[11px] font-bold text-[#FFDD9C] bg-[#FB6C00]/10 px-2 py-0.5 rounded-full border border-[#FB6C00]/20">
                      উচ্চারণ: {item.phoneticBn}
                    </span>
                  )}
                  {item.category === 'trap' && (
                    <span className="text-[10px] font-black text-[#FFDD9C] bg-[#E73F1E]/20 px-2 py-0.5 rounded-full border border-[#E73F1E]/40">
                      ফাঁদ শব্দ
                    </span>
                  )}
                </div>

                {/* Bengali Meaning */}
                <p className="text-sm font-semibold text-slate-200 leading-snug">
                  {item.meaningBn}
                </p>

                {/* Trap Alert Tag if available */}
                {item.trapAlert && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFDD9C] bg-[#E73F1E]/15 px-2.5 py-1 rounded-xl border border-[#FB6C00]/30">
                    <Sparkles className="w-3 h-3 text-[#F9B637]" />
                    <span>{item.trapAlert}</span>
                  </div>
                )}
              </div>

              {/* Speak Audio Button */}
              <button
                type="button"
                onClick={() => speakItalian(item.wordIt)}
                title="ইতালিয়ান উচ্চারণ শুনুন (Pronuncia)"
                className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-gradient-to-r from-[#FB6C00] to-[#F9B637] text-slate-950 border-[#FFDD9C] shadow-lg shadow-[#FB6C00]/40 animate-pulse'
                    : 'bg-white/5 hover:bg-[#FB6C00]/20 text-slate-400 hover:text-[#FFDD9C] border-white/10'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-sm glass-box rounded-3xl space-y-2 border border-white/10">
          <p className="text-base font-bold text-white">কোনো শব্দ খুঁজে পাওয়া যায়নি</p>
          <p>বানান ঠিক আছে কিনা দেখে আবার খুঁজুন অথবা ক্যাটাগরি পরিবর্তন করুন।</p>
        </div>
      )}
    </div>
  );
};
