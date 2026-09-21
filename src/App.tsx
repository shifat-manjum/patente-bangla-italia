import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { NavTab } from './components/Header';
import { RoundsMap } from './components/RoundsMap';
import { ExamSimulator } from './components/ExamSimulator';
import { TopicPractice } from './components/TopicPractice';
import { VocabularyBank } from './components/VocabularyBank';
import { MistakeReview } from './components/MistakeReview';
import { HotshotExam } from './components/HotshotExam';
import { VipPaywallModal } from './components/VipPaywallModal';
import { AboutModal } from './components/AboutModal';
import { AdminQuestionExplorer } from './components/AdminQuestionExplorer';
import { StudentLeadModal } from './components/StudentLeadModal';
import type { ThemeMode } from './components/ThemeSwitcher';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('rounds');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Theme State: 'light' | 'sepia' | 'dark'
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_theme') as ThemeMode;
      if (saved === 'light' || saved === 'sepia' || saved === 'dark') {
        return saved;
      }
    } catch {}
    return 'light';
  });

  // Sync theme with HTML document class
  useEffect(() => {
    try {
      localStorage.setItem('patente_bangla_theme', currentTheme);
    } catch {}
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-sepia');
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme === 'sepia') {
      root.classList.add('theme-sepia');
    }
  }, [currentTheme]);

  // Student Lead Registration State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [studentLead, setStudentLead] = useState<{ name: string; email: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_student_lead');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auto-detect #admin or ?admin=true
  useEffect(() => {
    const checkAdmin = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setActiveTab('admin');
      }
    };
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, []);

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
      // If student hits 600 questions and is not VIP, trigger paywall!
      if (!isVip && prev < 600 && updated >= 600) {
        setIsPaywallOpen(true);
      }
      // Prompt registration after first 60 questions (round 2) if not registered yet
      if (!studentLead && prev < 60 && updated >= 60) {
        setIsLeadModalOpen(true);
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

  const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);

  const handleStartRound = (roundId: number) => {
    // If round is not free (round > 20) and user is not VIP, show paywall!
    if (roundId > 20 && !isVip) {
      setIsPaywallOpen(true);
      return;
    }
    // Switch to exam simulator to take the round
    setCurrentRoundId(roundId);
    setActiveTab('exam');
  };

  const handleUnlockVip = () => {
    setIsVip(true);
    setIsPaywallOpen(false);
    alert('🎉 অভিনন্দন! আপনার €49 লাইফটাইম Pro Student Pass সক্রিয় হয়েছে। সম্পূর্ণ ২৪০টি রাউন্ড এবং ৭,১০০+ প্রশ্ন আনলক করা হয়েছে!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 selection:bg-[#FB6C00] selection:text-white font-sans relative overflow-x-hidden">
      {/* Subtle school ambient gradient top accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[300px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-20 right-1/4 w-[400px] h-[300px] bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10" />


      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'exam') {
            setCurrentRoundId(null);
          }
          setActiveTab(tab);
        }}
        mistakesCount={mistakeIds.length}
        totalQuestionsAnswered={totalQuestionsAnswered}
        isVip={isVip}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
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
            roundId={currentRoundId}
            onBackToRounds={() => {
              setCurrentRoundId(null);
              setActiveTab('rounds');
            }}
            onSaveMistakes={handleSaveExamMistakes}
            onGoToTopics={() => setActiveTab('topics')}
          />
        )}

        {activeTab === 'hotshot' && (
          <HotshotExam
            onRecordMistake={(id) => {
              incrementAnsweredCount(1);
              setMistakeIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
            }}
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

        {activeTab === 'admin' && (
          <AdminQuestionExplorer onBackToApp={() => setActiveTab('rounds')} />
        )}
      </main>

      {/* Pro Student Pass Modal */}
      <VipPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUnlockVip={handleUnlockVip}
        questionsAnsweredCount={totalQuestionsAnswered}
      />

      {/* Student Lead Registration Modal */}
      <StudentLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSaveLead={(data) => {
          try {
            localStorage.setItem('patente_bangla_student_lead', JSON.stringify(data));
          } catch {}
          setStudentLead(data);
        }}
      />

      {/* About Us Modal (Shifat Manjum & Zentixx Story) */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenAbout={() => setIsAboutOpen(true)}
      />
    </div>
  );
}

export default App;
