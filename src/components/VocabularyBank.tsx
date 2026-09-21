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
      <div className="glass-box rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-emerald-500/20 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-black text-emerald-400">
            <BookmarkCheck className="w-4 h-4" />
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20 font-black ring-2 ring-emerald-400'
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
      <div className="glass-box rounded-3xl p-4 sm:p-5 flex items-center gap-3 border border-white/10 shadow-lg">
        <Search className="w-5 h-5 text-emerald-400 shrink-0" />
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
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3 text-xs sm:text-sm shadow-md animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black text-amber-300">
              💡 কুইজের ফাঁদ শব্দের কৌশল (Trucchi e Trabocchetti):
            </p>
            <p className="leading-relaxed">
              ইতালির কুইজে <strong>Mai, Sempre, Esclusivamente, Tassativamente</strong> জাতীয় চরম শব্দ থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong>FALSO</strong> হয়। পক্ষান্তরে <strong>Di norma, Opportune cautele, Prudenza</strong> থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong>VERO</strong> হয়!
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
              className="glass-box rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:border-emerald-500/40 hover:bg-slate-900/90 group border border-white/10 shadow-md"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition tracking-tight">
                    {item.wordIt}
                  </span>
                  {item.phoneticBn && (
                    <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      উচ্চারণ: {item.phoneticBn}
                    </span>
                  )}
                  {item.category === 'trap' && (
                    <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
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
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-500/25">
                    <Sparkles className="w-3 h-3 text-amber-400" />
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
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/40 animate-pulse'
                    : 'bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border-white/10'
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
