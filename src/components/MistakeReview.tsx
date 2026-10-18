import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  Trash2,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Filter,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { ALL_200_QUESTIONS } from '../data/roundQuestions';
import { getRoundTopic } from '../data/roundCurriculumData';
import type { QuizQuestion } from '../data/quizData';
import { QuizCard } from './QuizCard';

export interface MistakeRoundGroup {
  groupKey: string;
  roundId: number | null;
  badgeLabel: string;
  titleBn: string;
  titleIt: string;
  sortOrder: number;
  questions: QuizQuestion[];
}

interface MistakeReviewProps {
  mistakeIds: string[];
  onClearMistakes: () => void;
  onRemoveMistake: (id: string) => void;
  onRemoveMistakesByRound?: (idsToRemove: string[]) => void;
  onGoToTopics: () => void;
  onSelectRound?: (roundId: number) => void;
}

export const MistakeReview: React.FC<MistakeReviewProps> = ({
  mistakeIds,
  onClearMistakes,
  onRemoveMistake,
  onRemoveMistakesByRound,
  onGoToTopics,
  onSelectRound,
}) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Resolve questions and organize them into separate Round / Test groups
  const mistakeGroups = useMemo<MistakeRoundGroup[]>(() => {
    const questionMap = new Map<string, QuizQuestion>();
    QUIZ_QUESTIONS.forEach((q) => questionMap.set(q.id, q));
    ALL_200_QUESTIONS.forEach((q) => questionMap.set(q.id, q));

    try {
      const rawCached = localStorage.getItem('patente_bangla_mistake_questions');
      if (rawCached) {
        const parsed: Record<string, QuizQuestion> = JSON.parse(rawCached);
        if (parsed && typeof parsed === 'object') {
          Object.entries(parsed).forEach(([k, v]) => {
            if (v && typeof v === 'object' && v.questionIt) {
              questionMap.set(k, v);
            }
          });
        }
      }
    } catch {}

    const resolveQuestionById = (rawId: string): QuizQuestion | null => {
      const direct = questionMap.get(rawId);
      if (direct) return { ...direct, id: rawId };

      // Check if scoped with r{round}_ or mt{num}_
      const roundPrefixMatch = rawId.match(/^r(\d+)_(.+)$/);
      if (roundPrefixMatch) {
        const innerId = roundPrefixMatch[2];
        const innerQ = questionMap.get(innerId);
        if (innerQ) return { ...innerQ, id: rawId };
      }

      const mockPrefixMatch = rawId.match(/^mt(\d+)_(.+)$/);
      if (mockPrefixMatch) {
        const innerId = mockPrefixMatch[2];
        const innerQ = questionMap.get(innerId);
        if (innerQ) return { ...innerQ, id: rawId };
      }

      // Fallback for legacy IDs like r21_q5 or q_123
      const legacyMatch = rawId.match(/^(?:r(\d+)_)?q_?(\d+)$/);
      if (legacyMatch) {
        const qNum = parseInt(legacyMatch[2], 10);
        const fallbackQ = ALL_200_QUESTIONS[Math.abs(qNum - 1) % ALL_200_QUESTIONS.length];
        if (fallbackQ) return { ...fallbackQ, id: rawId };
      }

      return null;
    };

    const groupsMap = new Map<string, MistakeRoundGroup>();

    for (const id of mistakeIds) {
      const q = resolveQuestionById(id);
      if (!q) continue;

      let groupKey = 'general_practice';
      let roundId: number | null = null;
      let badgeLabel = 'মক টেস্ট';
      let titleBn = 'অফিশিয়াল মক টেস্ট সিমুলেশন';
      let titleIt = 'Simulazione Esame Ufficiale';
      let sortOrder = 2000;

      const roundMatch = id.match(/^r(\d+)_/);
      const mockMatch = id.match(/^mt(\d+)_/);
      const explicitRoundId = (q as any).roundId;

      if (roundMatch) {
        const rNum = parseInt(roundMatch[1], 10);
        if (rNum >= 1 && rNum <= 240) {
          roundId = rNum;
          groupKey = `round_${rNum}`;
          const topic = getRoundTopic(rNum);
          badgeLabel = `রাউন্ড ${rNum}`;
          titleBn = `রাউন্ড ${rNum}: ${topic.titleBn}`;
          titleIt = `Round ${rNum} • ${topic.titleIt}`;
          sortOrder = rNum;
        }
      } else if (mockMatch) {
        const mNum = parseInt(mockMatch[1], 10);
        groupKey = `mock_${mNum}`;
        badgeLabel = `মক টেস্ট #${mNum}`;
        titleBn = `মক টেস্ট সিমুলেশন #${mNum}`;
        titleIt = `Simulazione Esame #${mNum} (30 Domande)`;
        sortOrder = 1000 + mNum;
      } else if (typeof explicitRoundId === 'number' && explicitRoundId >= 1 && explicitRoundId <= 240) {
        roundId = explicitRoundId;
        groupKey = `round_${explicitRoundId}`;
        const topic = getRoundTopic(explicitRoundId);
        badgeLabel = `রাউন্ড ${explicitRoundId}`;
        titleBn = `রাউন্ড ${explicitRoundId}: ${topic.titleBn}`;
        titleIt = `Round ${explicitRoundId} • ${topic.titleIt}`;
        sortOrder = explicitRoundId;
      }

      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, {
          groupKey,
          roundId,
          badgeLabel,
          titleBn,
          titleIt,
          sortOrder,
          questions: [],
        });
      }

      groupsMap.get(groupKey)!.questions.push(q);
    }

    return Array.from(groupsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [mistakeIds]);

  const totalMistakesCount = useMemo(
    () => mistakeGroups.reduce((sum, g) => sum + g.questions.length, 0),
    [mistakeGroups]
  );

  // If the currently filtered round group was completely removed/cleared, reset filter to 'all'
  useEffect(() => {
    if (selectedGroupKey !== 'all' && !mistakeGroups.some((g) => g.groupKey === selectedGroupKey)) {
      setSelectedGroupKey('all');
    }
  }, [mistakeGroups, selectedGroupKey]);

  const visibleGroups = useMemo(() => {
    if (selectedGroupKey === 'all') return mistakeGroups;
    return mistakeGroups.filter((g) => g.groupKey === selectedGroupKey);
  }, [mistakeGroups, selectedGroupKey]);

  const handleAnswer = (question: QuizQuestion, ans: boolean) => {
    setAnswers((prev) => ({ ...prev, [question.id]: ans }));
    if (ans === question.isCorrect) {
      // Corrected! Remove from mistakes after a brief delay
      setTimeout(() => {
        onRemoveMistake(question.id);
      }, 1200);
    }
  };

  const handleRemoveGroup = (group: MistakeRoundGroup) => {
    const ids = group.questions.map((q) => q.id);
    if (onRemoveMistakesByRound) {
      onRemoveMistakesByRound(ids);
    } else {
      ids.forEach((id) => onRemoveMistake(id));
    }
  };

  const toggleCollapseGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  if (totalMistakesCount === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6 bg-white dark:bg-[#12161F] rounded-3xl p-8 sm:p-12 animate-fadeIn border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-emerald-500 border border-slate-200 dark:border-white/10 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            কোনো ভুল প্রশ্ন জমে নেই! 🎉
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            আপনি ১ থেকে ২৪০ রাউন্ডের যেকোনো পরীক্ষায় বা মক টেস্টে যে প্রশ্নগুলো ভুল করবেন, সেগুলো রাউন্ড অনুযায়ী আলাদাভাবে এখানে জমা থাকবে। প্রতিটি রাউন্ডের ভুল আপনি আলাদাভাবে ট্র্যাক এবং মুছে ফেলতে পারবেন।
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTopics}
          className="py-3 px-6 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs transition hover:scale-105 cursor-pointer shadow-md shadow-[#FB6C00]/25"
        >
          কুইজ প্র্যাকটিস শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#12161F] rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-black text-slate-700 dark:text-slate-300">
              <AlertCircle className="w-4 h-4 text-[#E52E2D]" />
              <span>রাউন্ড ভিত্তিক ভুলের খাতা (Revisione Errori per Round)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              আপনার ভুল প্রশ্নগুলোর তালিকা ({totalMistakesCount}টি প্রশ্ন • {mistakeGroups.length}টি রাউন্ড)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-2xl">
              প্রতিটি রাউন্ড ও মক টেস্টের ভুল প্রশ্নগুলো নিচে আলাদাভাবে সাজানো আছে। আপনি চাইলে যেকোনো নির্দিষ্ট রাউন্ড বেছে নিয়ে রিভিশন দিতে পারেন অথবা পুরো রাউন্ডের ভুল এক ক্লিকে মুছে ফেলতে পারেন।
            </p>
          </div>

          <button
            type="button"
            onClick={onClearMistakes}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-xs font-bold transition cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>সব রাউন্ডের ভুল মুছুন (Clear All)</span>
          </button>
        </div>

        {/* Round Selector / Filter Tabs */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#FB6C00]" />
            <span>রাউন্ড বা টেস্ট অনুযায়ী ফিল্টার করুন (Select Round):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroupKey('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 border ${
                selectedGroupKey === 'all'
                  ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white border-transparent shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200/70 dark:hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>সব রাউন্ড ({totalMistakesCount})</span>
            </button>

            {mistakeGroups.map((group) => {
              const isSelected = selectedGroupKey === group.groupKey;
              return (
                <div
                  key={group.groupKey}
                  className={`inline-flex items-center rounded-xl border transition overflow-hidden ${
                    isSelected
                      ? 'bg-[#FB6C00] text-white border-[#FB6C00] shadow-sm'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-orange-400/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGroupKey(group.groupKey)}
                    className="px-3 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{group.badgeLabel}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {group.questions.length}টি ভুল
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGroup(group);
                    }}
                    title={`${group.badgeLabel}-এর সব ভুল মুছে ফেলুন`}
                    className={`px-2 py-2 border-l transition cursor-pointer ${
                      isSelected
                        ? 'border-white/20 hover:bg-rose-600 text-white'
                        : 'border-slate-200 dark:border-white/10 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Separated Round Sections */}
      <div className="space-y-8">
        {visibleGroups.map((group) => {
          const isCollapsed = Boolean(collapsedGroups[group.groupKey]);

          return (
            <div
              key={group.groupKey}
              className="bg-white dark:bg-[#12161F] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl overflow-hidden transition-all"
            >
              {/* Round Group Header */}
              <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div
                  className="flex items-start sm:items-center gap-3.5 cursor-pointer select-none"
                  onClick={() => toggleCollapseGroup(group.groupKey)}
                >
                  <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-br from-[#E52E2D] to-[#FB6C00] text-white font-black text-xs sm:text-sm shrink-0 shadow-sm">
                    {group.badgeLabel}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {group.titleBn}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-[11px] font-black">
                        {group.questions.length}টি ভুল প্রশ্ন
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {group.titleIt}
                    </p>
                  </div>
                </div>

                {/* Round Group Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
                  {group.roundId && onSelectRound && (
                    <button
                      type="button"
                      onClick={() => onSelectRound(group.roundId!)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-slate-700 dark:text-slate-300 hover:text-[#FB6C00] border border-slate-200 dark:border-white/10 text-xs font-bold transition cursor-pointer"
                      title="এই রাউন্ডটি আবার পরীক্ষা দিন"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>রাউন্ডটি আবার দিন</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(group)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white border border-rose-200 dark:border-rose-800/60 hover:border-rose-600 text-xs font-black transition cursor-pointer"
                    title={`${group.badgeLabel}-এর সব ভুল মুছে ফেলুন`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>এই রাউন্ডের ভুল মুছুন ({group.questions.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCollapseGroup(group.groupKey)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 transition cursor-pointer"
                    title={isCollapsed ? 'প্রশ্নগুলো দেখুন' : 'সংকুচিত করুন'}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Questions inside this Round Group */}
              {!isCollapsed && (
                <div className="p-4 sm:p-6 space-y-6 bg-slate-50/30 dark:bg-transparent">
                  {group.questions.map((q, idx) => (
                    <div key={q.id} className="relative group space-y-2">
                      <QuizCard
                        question={q}
                        index={idx}
                        userAnswer={answers[q.id] ?? null}
                        onAnswer={(val) => handleAnswer(q, val)}
                        showInstantResult={true}
                      />
                      {/* Quick remove individual mistake */}
                      <div className="flex items-center justify-between px-2">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {group.badgeLabel} • ভুল প্রশ্ন #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveMistake(q.id)}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition cursor-pointer flex items-center gap-1.5"
                          title="এই প্রশ্নটি ভুলের তালিকা থেকে মুছে ফেলুন"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>প্রশ্নটি মুছুন (Remove)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
