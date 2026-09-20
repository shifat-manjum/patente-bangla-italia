import React, { useState } from 'react';
import { BookmarkCheck, Search, Volume2 } from 'lucide-react';
import { VOCABULARY_LIST } from '../data/quizData';

export const VocabularyBank: React.FC = () => {
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

  const filteredVocab = VOCABULARY_LIST.filter(
    (item) =>
      item.wordIt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaningBn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-box rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>শব্দকোষ (Dizionario Italiano - Bangla)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ড্রাইভিং লাইসেন্স পরীক্ষার কঠিন শব্দার্থ
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            ইতালিয়ান কুইজে বারবার আসা কঠিন শব্দগুলো জানলে যেকোনো প্রশ্নের উত্তর দেওয়া অনেক সহজ হয়ে যায়।
            শব্দটিতে ক্লিক করে অডিও উচ্চারণ শুনে নিন।
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-box rounded-3xl p-4 sm:p-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-emerald-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ইতালিয়ান বা বাংলায় শব্দ খুঁজুন (যেমন: Carreggiata, ওভারটেকিং, পার্কিং)..."
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white cursor-pointer px-2"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredVocab.map((item, idx) => {
          const isSpeaking = speakingWord === item.wordIt;
          return (
            <div
              key={idx}
              className="glass-box rounded-2xl p-4 flex items-center justify-between gap-4 transition hover:border-emerald-500/30 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white group-hover:text-emerald-300 transition">
                    {item.wordIt}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakItalian(item.wordIt)}
                    title="উচ্চারণ শুনুন"
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                      isSpeaking
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 group-hover:text-white border-white/10'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {item.meaningBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-sm glass-box rounded-3xl">
          কোনো শব্দ খুঁজে পাওয়া যায়নি। অন্য কোনো শব্দ দিয়ে চেষ্টা করুন।
        </div>
      )}
    </div>
  );
};
