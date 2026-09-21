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
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminCrmDashboard } from './components/AdminCrmDashboard';
import { StudentLeadModal } from './components/StudentLeadModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import type { StudentUser } from './components/StudentAuthModal';
import {
  subscribeToAuthChanges,
  logoutStudent,
  syncStudentProgressToCloud,
} from './services/studentService';
import { PatenteChatbot } from './components/PatenteChatbot';
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

  // Current Student User State (Mandatory login system + Firebase Backend)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem('patente_student_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authForcedMessage, setAuthForcedMessage] = useState('');

  // Subscribe to real-time Firebase Authentication & Firestore Profile
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((profile) => {
      if (profile) {
        setCurrentUser(profile);
        if (profile.unlockedRound) {
          setUnlockedRound((prev) => Math.max(prev, profile.unlockedRound));
        }
        if (profile.totalQuestionsAnswered) {
          setTotalQuestionsAnswered((prev) => Math.max(prev, profile.totalQuestionsAnswered));
        }
        if (profile.completedRounds && Object.keys(profile.completedRounds).length > 0) {
          setCompletedRounds((prev) => ({ ...prev, ...profile.completedRounds }));
        }
        if (profile.mistakeIds && profile.mistakeIds.length > 0) {
          setMistakeIds((prev) => Array.from(new Set([...prev, ...profile.mistakeIds])));
        }
        if (profile.isVip) {
          setIsVip(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutStudent();
    setCurrentUser(null);
  };

  const requireLogin = (action = 'কুইজ ও রাউন্ড শুরু করতে'): boolean => {
    if (!currentUser) {
      setAuthForcedMessage(`${action} দয়া করে আপনার ফ্রি স্টুডেন্ট অ্যাকাউন্টে সাইন ইন করুন অথবা নতুন ফ্রি অ্যাকাউন্ট খুলুন। কোনো প্রশ্ন দেখতে বা সমাধান করতে লগইন বাধ্যতামূলক।`);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

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

  // Admin Authentication State (khshifat@gmail.com / khshifatmanjum@gmail.com)
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('patente_admin_auth');
    } catch {
      return null;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Auto-detect #admin or ?admin=true
  useEffect(() => {
    const checkAdmin = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        if (adminEmail) {
          setActiveTab('admin');
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, [adminEmail]);

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

  // Sync student progress to Cloud Firestore whenever progress changes
  useEffect(() => {
    if (currentUser?.uid) {
      syncStudentProgressToCloud(currentUser.uid, {
        unlockedRound,
        totalQuestionsAnswered,
        completedRounds,
        mistakeIds,
        isVip,
      });
    }
  }, [unlockedRound, totalQuestionsAnswered, completedRounds, mistakeIds, isVip, currentUser?.uid]);

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
    // Strict authentication gate: nobody can access questions without login
    if (!requireLogin('রাউন্ড শুরু করতে')) {
      return;
    }
    // If round is not free (round > 20) and user is not VIP, show paywall!
    if (roundId > 20 && !isVip) {
      setIsPaywallOpen(true);
      return;
    }
    // Switch to exam simulator to take the round
    setCurrentRoundId(roundId);
    setActiveTab('exam');
  };

  const handleSelectTab = (tab: NavTab) => {
    if (['exam', 'hotshot', 'topics', 'mistakes'].includes(tab)) {
      if (!requireLogin('কুইজ ও পরীক্ষা শুরু করতে')) {
        return;
      }
    }
    if (tab === 'exam') {
      setCurrentRoundId(null);
    }
    setActiveTab(tab);
  };

  const handleUnlockVip = () => {
    setIsVip(true);
    setIsPaywallOpen(false);
    alert('🎉 অভিনন্দন! আপনার €49 লাইফটাইম Pro Student Pass সক্রিয় হয়েছে। সম্পূর্ণ ২৪০টি রাউন্ড এবং ৭,১০০+ প্রশ্ন আনলক করা হয়েছে!');
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans relative overflow-x-hidden ${
        currentTheme === 'sepia'
          ? 'theme-sepia bg-[#F5EEDB] text-[#331E0D] selection:bg-[#B45309] selection:text-white'
          : currentTheme === 'dark'
          ? 'dark bg-[#090D16] text-[#F1F5F9] selection:bg-[#FB6C00] selection:text-white'
          : 'bg-[#F8FAFC] text-slate-800 selection:bg-[#FB6C00] selection:text-white'
      }`}
    >
      {/* Subtle theme-specific ambient accents */}
      {currentTheme === 'sepia' ? (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[300px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed top-20 right-1/4 w-[400px] h-[300px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      ) : currentTheme === 'dark' ? (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[300px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed top-20 right-1/4 w-[400px] h-[300px] bg-orange-900/15 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[300px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed top-20 right-1/4 w-[400px] h-[300px] bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        mistakesCount={mistakeIds.length}
        totalQuestionsAnswered={totalQuestionsAnswered}
        isVip={isVip}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthForcedMessage('');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => {
          if (adminEmail) {
            setActiveTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Unauthenticated Student Welcome Banner */}
        {!currentUser && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200 dark:border-orange-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#FB6C00] bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-md">
                🔒 Student Sign-In Required
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                কুইজ ও রাউন্ড শুরু করতে লগইন করুন • ২০টি রাউন্ড (৬০০ প্রশ্ন) সম্পূর্ণ ফ্রি
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                আপনার নাম ও ইমেইল দিয়ে একটি ফ্রি স্টুডেন্ট অ্যাকাউন্ট তৈরি করে নিন অথবা ডেমো লগইন দিয়ে এখনই পড়া শুরু করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAuthForcedMessage('২০টি ফ্রি রাউন্ড শুরু করতে অনুগ্রহ করে সাইন ইন বা ফ্রি রেজিস্টার করুন।');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md transition"
            >
              Log In / Register (ফ্রি)
            </button>
          </div>
        )}

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
          adminEmail ? (
            <AdminCrmDashboard
              adminEmail={adminEmail}
              onExitAdmin={() => {
                try {
                  sessionStorage.removeItem('patente_admin_auth');
                } catch {}
                setAdminEmail(null);
                setActiveTab('rounds');
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#FB6C00] flex items-center justify-center mx-auto text-3xl">
                🔒
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Admin CRM & Control Panel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Access restricted to authorized owners (khshifat@gmail.com / khshifatmanjum@gmail.com).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 transition cursor-pointer"
              >
                Log In as Admin (অ্যাডমিন লগইন)
              </button>
            </div>
          )
        )}
      </main>

      {/* Mandatory Student Auth Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
        forcedMessage={authForcedMessage}
      />

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

      {/* Floating 24/7 AI Maestro Tutor Chatbot */}
      <PatenteChatbot
        currentTheme={currentTheme}
        currentUser={currentUser}
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      {/* Admin Login Gate Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminLoginSuccess={(email) => {
          setAdminEmail(email);
          try {
            sessionStorage.setItem('patente_admin_auth', email);
          } catch {}
          setIsAdminLoginOpen(false);
          setActiveTab('admin');
        }}
      />

      {/* Footer */}
      <Footer
        setActiveTab={handleSelectTab}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAdmin={() => {
          if (adminEmail) {
            setActiveTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />
    </div>
  );
}

export default App;
