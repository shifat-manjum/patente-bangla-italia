import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Volume2, 
  CheckCircle2
} from 'lucide-react';
import { THEORY_CHAPTERS, type TheoryChapter } from '../data/theoryData';

interface TheorySummaryViewProps {
  onStartRound: (roundId: number) => void;
  onOpenExamSim?: () => void;
}

export const TheorySummaryView: React.FC<TheorySummaryViewProps> = ({
  onStartRound,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingRule, setPlayingRule] = useState<string | null>(null);

  const speakItalian = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;
    setPlayingRule(text);
    utterance.onend = () => setPlayingRule(null);
    utterance.onerror = () => setPlayingRule(null);
    window.speechSynthesis.speak(utterance);
  };

  const filteredChapters = THEORY_CHAPTERS.filter((ch) => {
    const matchesCategory = selectedCategory === 'all' || ch.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      ch.titleIt.toLowerCase().includes(query) ||
      ch.titleBn.toLowerCase().includes(query) ||
      ch.summaryBn.toLowerCase().includes(query) ||
      ch.goldenRules.some(r => r.it.toLowerCase().includes(query) || r.bn.toLowerCase().includes(query)) ||
      ch.trapKeywords.some(k => k.word.toLowerCase().includes(query) || k.meaningBn.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/30 text-xs font-bold text-blue-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>25 Official Ministerial Chapters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Theory Summaries & Exam Trap Keywords
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            No endless textbooks. Master the 3 golden rules and critical trick keywords for each official chapter in 90 seconds.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapter, road sign, or keyword (e.g. Sosta, Carreggiata, Precedenza)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All 25 Chapters' },
            { id: 'signals', label: 'Road Signs' },
            { id: 'rules', label: 'Traffic Rules' },
            { id: 'safety', label: 'Safety & First Aid' },
            { id: 'mechanics', label: 'Vehicle & Mechanics' },
            { id: 'legal', label: 'License & Insurance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredChapters.map((chapter: TheoryChapter) => (
          <div
            key={chapter.id}
            className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                  {chapter.chapterNumber}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {chapter.titleBn}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 tracking-wide">
                    {chapter.titleIt}
                  </p>
                </div>
              </div>

              {/* Start Quiz for this Chapter */}
              <button
                type="button"
                onClick={() => onStartRound(chapter.relatedRounds[0] || 1)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
              >
                <span>Practice Chapter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Summary Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                💡 <span className="font-bold text-slate-800 dark:text-white">Chapter Overview:</span> {chapter.summaryBn}
              </p>

              {/* 3 Golden Rules */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Golden Rules (Direct Ministerial Takeaways):</span>
                </div>

                <div className="space-y-2.5">
                  {chapter.goldenRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1.5 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            "{rule.it}"
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakItalian(rule.it)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-slate-700 transition shrink-0 cursor-pointer"
                          title="Listen Italian pronunciation"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${playingRule === rule.it ? 'animate-pulse text-blue-600' : ''}`} />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium pl-6 leading-relaxed">
                        👉 <span className="font-semibold text-slate-800 dark:text-amber-300">সহজ বাংলা অর্থ:</span> {rule.bn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trap Keywords */}
              {chapter.trapKeywords.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Exam Trap Keywords to Watch Out For:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {chapter.trapKeywords.map((trap, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/60">
                            ⚠️ {trap.word}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            ({trap.meaningBn})
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed pt-1">
                          {trap.trapNoteBn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Related Practice: <strong className="text-slate-700 dark:text-slate-200">Round #{chapter.relatedRounds.join(', #')}</strong></span>
              <button
                type="button"
                onClick={() => onStartRound(chapter.relatedRounds[0] || 1)}
                className="text-blue-700 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
