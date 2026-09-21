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
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-black text-orange-800">
            <BookmarkCheck className="w-4 h-4 text-[#FB6C00]" />
            <span>অফিশিয়াল শব্দকোষ (Dizionario Ufficiale Ministeriale)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ড্রাইভিং লাইসেন্স পরীক্ষার ১২০+ কঠিন শব্দার্থ
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shadow-sm ${
                isSelected
                  ? 'bg-[#FB6C00] text-white shadow-orange-500/20 font-black'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.labelBn}</span>
              <span className="text-[11px] opacity-80 hidden md:inline">({cat.labelIt})</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-slate-200 shadow-sm">
        <Search className="w-5 h-5 text-[#FB6C00] shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ইতালিয়ান বা বাংলায় শব্দ খুঁজুন (যেমন: Carreggiata, Sorpasso, ওভারটেকিং, পার্কিং)..."
          className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer px-3 py-1 bg-slate-100 rounded-lg transition"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Trap Words Advisory Note if Trap category is selected */}
      {selectedCategory === 'trap' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs sm:text-sm shadow-sm animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-black text-amber-800 text-sm">
              💡 কুইজের ফাঁদ শব্দের কৌশল (Trucchi e Trabocchetti):
            </strong>
            <p className="leading-relaxed text-slate-700">
              ইতালির কুইজে <strong>Mai, Sempre, Esclusivamente, Tassativamente</strong> জাতীয় চরম শব্দ থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong className="text-rose-600 font-black">FALSO</strong> হয়। পক্ষান্তরে <strong>Di norma, Opportune cautele, Prudenza</strong> থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong className="text-emerald-600 font-black">VERO</strong> হয়!
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
              className="bg-white rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:border-[#FB6C00] group border border-slate-200 shadow-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#FB6C00] transition tracking-tight">
                    {item.wordIt}
                  </span>
                  {item.phoneticBn && (
                    <span className="text-[11px] font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      উচ্চারণ: {item.phoneticBn}
                    </span>
                  )}
                  {item.category === 'trap' && (
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      ফাঁদ শব্দ
                    </span>
                  )}
                </div>

                {/* Bengali Meaning */}
                <p className="text-sm font-semibold text-slate-700 leading-snug">
                  {item.meaningBn}
                </p>

                {/* Trap Alert Tag if available */}
                {item.trapAlert && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-600" />
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
                    ? 'bg-[#FB6C00] text-white border-[#FB6C00] shadow-sm animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl space-y-2 border border-slate-200 shadow-sm">
          <p className="text-base font-bold text-slate-800">কোনো শব্দ খুঁজে পাওয়া যায়নি</p>
          <p>বানান ঠিক আছে কিনা দেখে আবার খুঁজুন অথবা ক্যাটাগরি পরিবর্তন করুন।</p>
        </div>
      )}
    </div>
  );
};
