import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { NavTab } from './components/Header';
import { RoundsMap } from './components/RoundsMap';
import { ExamSimulator } from './components/ExamSimulator';
import { TopicPractice } from './components/TopicPractice';
import { VocabularyBank } from './components/VocabularyBank';
import { MistakeReview } from './components/MistakeReview';
import { VipPaywallModal } from './components/VipPaywallModal';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('rounds');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // VIP State
  const [isVip, setIsVip] = useState<boolean>(() => {
    try {
      return localStorage.getItem('patente_bangla_is_vip') === 'true';
    } catch {
      return false;
    }
  });

  // Total questions answered count
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_answered_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Highest unlocked round (default 1)
  const [unlockedRound, setUnlockedRound] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_unlocked_round');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Completed rounds history
  const [completedRounds, setCompletedRounds] = useState<Record<number, { errors: number; passed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_completed_rounds');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Mistakes bank
  const [mistakeIds, setMistakeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist VIP
  useEffect(() => {
    localStorage.setItem('patente_bangla_is_vip', String(isVip));
  }, [isVip]);

  // Persist answered count
  useEffect(() => {
    localStorage.setItem('patente_bangla_answered_count', String(totalQuestionsAnswered));
  }, [totalQuestionsAnswered]);

  // Persist unlocked round
  useEffect(() => {
    localStorage.setItem('patente_bangla_unlocked_round', String(unlockedRound));
  }, [unlockedRound]);

  // Persist completed rounds
  useEffect(() => {
    localStorage.setItem('patente_bangla_completed_rounds', JSON.stringify(completedRounds));
  }, [completedRounds]);

  // Persist mistakes
  useEffect(() => {
    localStorage.setItem('patente_bangla_mistakes', JSON.stringify(mistakeIds));
  }, [mistakeIds]);

  const incrementAnsweredCount = (amount: number = 1) => {
    setTotalQuestionsAnswered((prev) => {
      const updated = prev + amount;
      // If student hits 200 questions and is not VIP, trigger paywall!
      if (!isVip && prev < 200 && updated >= 200) {
        setIsPaywallOpen(true);
      }
      return updated;
    });
  };

  const handleSaveExamMistakes = (newIds: string[]) => {
    incrementAnsweredCount(30);

    setMistakeIds((prev) => {
      const set = new Set([...prev, ...newIds]);
      return Array.from(set);
    });

    // Check if current round passed (<= 3 errors)
    const errorCount = newIds.length;
    const passed = errorCount <= 3;

    setCompletedRounds((prev) => ({
      ...prev,
      [unlockedRound]: { errors: errorCount, passed }
    }));

    if (passed) {
      setUnlockedRound((prev) => Math.max(prev, prev + 1));
    }
  };

  const handleStartRound = (roundId: number) => {
    // If round is not free and user is not VIP, show paywall!
    if (roundId >= 8 && !isVip) {
      setIsPaywallOpen(true);
      return;
    }
    // Switch to exam simulator to take the round
    setActiveTab('exam');
  };

  const handleUnlockVip = () => {
    setIsVip(true);
    setIsPaywallOpen(false);
    alert('🎉 অভিনন্দন! আপনার €49 লাইফটাইম VIP মেম্বারশিপ সক্রিয় হয়েছে। সম্পূর্ণ ২৪০টি রাউন্ড এবং ৭,১০০+ প্রশ্ন আনলক করা হয়েছে!');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mistakesCount={mistakeIds.length}
        totalQuestionsAnswered={totalQuestionsAnswered}
        isVip={isVip}
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'rounds' && (
          <RoundsMap
            unlockedRound={unlockedRound}
            completedRounds={completedRounds}
            onStartRound={handleStartRound}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            isVip={isVip}
            totalQuestionsAnswered={totalQuestionsAnswered}
          />
        )}

        {activeTab === 'exam' && (
          <ExamSimulator
            onSaveMistakes={handleSaveExamMistakes}
            onGoToTopics={() => setActiveTab('topics')}
          />
        )}

        {activeTab === 'topics' && (
          <TopicPractice
            onRecordMistake={(id) => {
              incrementAnsweredCount(1);
              setMistakeIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
            }}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabularyBank />
        )}

        {activeTab === 'mistakes' && (
          <MistakeReview
            mistakeIds={mistakeIds}
            onClearMistakes={() => setMistakeIds([])}
            onRemoveMistake={(id) => setMistakeIds((prev) => prev.filter((item) => item !== id))}
            onGoToTopics={() => setActiveTab('topics')}
          />
        )}
      </main>

      {/* VIP Paywall Modal */}
      <VipPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUnlockVip={handleUnlockVip}
        questionsAnsweredCount={totalQuestionsAnswered}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
