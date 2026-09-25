import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { NavTab } from './components/Header';
import { AppNavigation } from './components/AppNavigation';
import type { AppTab } from './components/AppNavigation';
import { StudentDashboardView } from './components/StudentDashboardView';
import { RoundsCurriculumView } from './components/RoundsCurriculumView';
import { TheorySummaryView } from './components/TheorySummaryView';
import { EnrollmentModal } from './components/EnrollmentModal';
import { ExamSimulator } from './components/ExamSimulator';
import { MistakeReview } from './components/MistakeReview';
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
import { AcademyEnrollmentPage } from './components/AcademyEnrollmentPage';
import confetti from 'canvas-confetti';
import { CoursePaymentModal } from './components/CoursePaymentModal';
import { CourseInvoiceModal } from './components/CourseInvoiceModal';
import { 
  getLatestInvoice, 
  createInvoiceRecord, 
  saveInvoice 
} from './services/paymentService';
import type { InvoiceRecord } from './services/paymentService';

// Calculate true sequential progress: a student can only reach Round N if rounds 1..N-1 are passed
export const getSequentialUnlockedRound = (completed: Record<number, { passed: boolean }>): number => {
  let r = 1;
  while (completed[r]?.passed === true && r < 240) {
    r++;
  }
  return r;
};

export function App() {
  const [appTab, setAppTab] = useState<AppTab | 'admin' | 'enrollment'>('dashboard');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Direct Online Payment & Invoicing State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceRecord | null>(() => getLatestInvoice());
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Theme State: 'light' | 'sepia' | 'dark'
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_theme') as ThemeMode;
      if (saved === 'light' || saved === 'sepia' || saved === 'dark') {
        return saved;
      }
    } catch {}
    return 'dark';
  });

  // Theme switch feedback notification
  const [themeToast, setThemeToast] = useState<{ message: string; subtext: string; icon: string } | null>(null);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setCurrentTheme(newTheme);
    if (newTheme === 'light') {
      setThemeToast({
        message: 'Daytime Light Mode',
        subtext: 'উজ্জ্বল আলো ও হাই-কন্ট্রাস্ট মোড চালু হয়েছে',
        icon: '☀️',
      });
    } else if (newTheme === 'sepia') {
      setThemeToast({
        message: 'Reader Eye-Comfort Mode',
        subtext: 'চোখের সুরক্ষায় উষ্ণ বই পড়ার সেপিয়া মোড চালু হয়েছে',
        icon: '📖',
      });
    } else {
      setThemeToast({
        message: 'Adobe Dark Night Mode',
        subtext: 'রাতের নির্ঝঞ্ঝাট প্রফেশনাল ব্ল্যাক মোড চালু হয়েছে',
        icon: '🌙',
      });
    }
  };

  useEffect(() => {
    if (themeToast) {
      const timer = setTimeout(() => {
        setThemeToast(null);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [themeToast]);

  // Sync theme with HTML document class
  useEffect(() => {
    try {
      localStorage.setItem('patente_bangla_theme', currentTheme);
    } catch {}
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-sepia', 'theme-light');
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme === 'sepia') {
      root.classList.add('theme-sepia');
    } else {
      root.classList.add('theme-light');
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
          setAppTab('admin');
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

  // Effective sequential unlocked round derived strictly from passed rounds
  const effectiveUnlockedRound = getSequentialUnlockedRound(completedRounds);

  // Sync unlockedRound with real sequential progress (cleans up any previous bug data)
  useEffect(() => {
    setUnlockedRound(effectiveUnlockedRound);
    try {
      localStorage.setItem('patente_bangla_unlocked_round', String(effectiveUnlockedRound));
    } catch {}
  }, [effectiveUnlockedRound]);

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
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = localStorage.getItem('patente_last_study_date');
      const savedStreak = parseInt(localStorage.getItem('patente_study_streak') || '0', 10);
      if (lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastDate === yesterday) {
          localStorage.setItem('patente_study_streak', String(savedStreak + 1));
        } else {
          localStorage.setItem('patente_study_streak', '1');
        }
        localStorage.setItem('patente_last_study_date', today);
      }
    } catch {}

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

  const handleSaveExamMistakes = (newIds: string[], finishedRoundId?: number | null) => {
    incrementAnsweredCount(30);

    setMistakeIds((prev) => {
      const set = new Set([...prev, ...newIds]);
      return Array.from(set);
    });

    const activeRoundNum = finishedRoundId || currentRoundId;

    if (activeRoundNum) {
      // Check if current round passed (<= 3 errors)
      const errorCount = newIds.length;
      const passed = errorCount <= 3;

      setCompletedRounds((prev) => ({
        ...prev,
        [activeRoundNum]: { errors: errorCount, passed }
      }));

      if (passed) {
        setUnlockedRound((prev) => {
          const nextRound = activeRoundNum + 1;
          const newHighest = Math.max(prev, nextRound);
          // If student passed round 20, prompt the €49 lifetime paywall for round 21!
          if (activeRoundNum === 20 && !isVip) {
            setTimeout(() => {
              setIsPaywallOpen(true);
            }, 1800);
          }
          return newHighest;
        });
      }
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
    // Sequential locking for ALL students (paid or unpaid):
    // Students can access any previously completed round, OR the current running round.
    // They CANNOT access round N+1 if round N has not been passed!
    if (roundId > effectiveUnlockedRound) {
      alert(`🔒 রাউন্ড #${roundId} এখনও লক করা। দয়া করে প্রথমে পূর্ববর্তী রাউন্ড #${roundId - 1} সফলভাবে পাস করুন (সর্বোচ্চ ৩টি ভুল)।`);
      return;
    }
    // Switch to exam simulator to take the round
    setCurrentRoundId(roundId);
    setAppTab('exam');
  };

  const handleSelectTab = (tab: NavTab) => {
    if (['exam', 'hotshot', 'topics', 'mistakes'].includes(tab)) {
      if (!requireLogin('কুইজ ও পরীক্ষা শুরু করতে')) {
        return;
      }
    }
    if (tab === 'exam') {
      setCurrentRoundId(null);
      setAppTab('exam');
    } else if (tab === 'rounds') {
      setAppTab('curriculum');
    } else if (tab === 'mistakes') {
      setAppTab('errors');
    } else if (tab === 'admin') {
      setAppTab('admin');
    }
  };

  const handlePaymentSuccess = (invoice: InvoiceRecord) => {
    setIsVip(true);
    try {
      localStorage.setItem('patente_bangla_is_vip', 'true');
    } catch {}
    // DO NOT force jump to round 240! Maintain student's legitimate sequential progress
    setUnlockedRound(effectiveUnlockedRound);
    try {
      localStorage.setItem('patente_bangla_unlocked_round', String(effectiveUnlockedRound));
    } catch {}
    setActiveInvoice(invoice);
    setIsPaymentModalOpen(false);
    setIsInvoiceModalOpen(true);

    if (currentUser?.uid) {
      syncStudentProgressToCloud(currentUser.uid, {
        isVip: true,
        unlockedRound: effectiveUnlockedRound,
      });
    }

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleOpenInvoice = () => {
    let inv = activeInvoice || getLatestInvoice(currentUser?.email);
    if (!inv) {
      inv = createInvoiceRecord({
        studentName: currentUser?.name || studentLead?.name || 'Studente Ufficiale Patente B',
        studentEmail: currentUser?.email || studentLead?.email || 'khshifat@gmail.com',
        studentPhone: studentLead?.phone || '+39 351 000 0000',
        codiceFiscale: 'REGOLARE',
        address: 'Italia',
        city: 'Bolzano',
        paymentMethod: 'card',
      });
      saveInvoice(inv);
      setActiveInvoice(inv);
    }
    setIsInvoiceModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans relative overflow-x-hidden ${
        currentTheme === 'sepia'
          ? 'theme-sepia bg-[#F5EEDB] text-[#2F1B0B] selection:bg-[#B45309] selection:text-white'
          : currentTheme === 'dark'
          ? 'dark bg-[#0D1117] text-[#F8FAFC] selection:bg-[#E52E2D] selection:text-white'
          : 'theme-light bg-[#F8FAFC] text-slate-900 selection:bg-[#FB6C00] selection:text-white'
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
          <div className="fixed top-0 left-1/4 w-[600px] h-[360px] bg-[#E52E2D]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="fixed top-20 right-1/4 w-[500px] h-[360px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="fixed bottom-10 left-1/3 w-[500px] h-[300px] bg-orange-600/8 rounded-full blur-[100px] pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[300px] bg-amber-100/60 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed top-20 right-1/4 w-[400px] h-[300px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* Navigation Header */}
      <Header
        totalQuestionsAnswered={totalQuestionsAnswered}
        isVip={isVip}
        onOpenPaywall={() => setAppTab('enrollment')}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthForcedMessage('');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => {
          if (adminEmail) {
            setAppTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenInvoice={handleOpenInvoice}
      />

      {/* Floating Theme Switch Feedback Toast */}
      {themeToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fadeIn pointer-events-none">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-950 shadow-2xl backdrop-blur-md border border-white/20 dark:border-slate-800 text-xs font-bold transition-all transform scale-100">
            <span className="text-lg shrink-0">{themeToast.icon}</span>
            <div className="text-left">
              <div className="font-black text-xs leading-tight tracking-wide">{themeToast.message}</div>
              <div className="text-[10.5px] opacity-80 mt-0.5 leading-tight">{themeToast.subtext}</div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Tab Educational Navigation */}
      <AppNavigation
        currentTab={appTab === 'admin' || appTab === 'enrollment' ? 'dashboard' : appTab}
        onTabChange={(tab) => {
          if (['exam', 'errors'].includes(tab)) {
            if (!requireLogin('অফিসিয়াল পরীক্ষা শুরু করতে')) return;
          }
          if (tab === 'exam') {
            setCurrentRoundId(null);
          }
          setAppTab(tab);
        }}
        errorCount={mistakeIds.length}
        activeRound={unlockedRound}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-[15px] pt-4 sm:pt-6 pb-28 sm:pb-24 md:pb-12">
        {/* Unauthenticated Student Welcome Banner */}
        {!currentUser && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/15">
                🔒 Free Student Sign-In
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Foundation Assessment (Rounds 1–20) • 600 Questions Free
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sign in to track your progress, practice with oral exam audio, and unlock your free rounds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAuthForcedMessage('২০টি ফ্রি রাউন্ড শুরু করতে অনুগ্রহ করে সাইন ইন বা ফ্রি রেজিস্টার করুন।');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md transition active:scale-95"
            >
              Sign In / Register Free
            </button>
          </div>
        )}

        {appTab === 'dashboard' && (
          <StudentDashboardView
            student={currentUser}
            activeRound={effectiveUnlockedRound}
            completedRoundsCount={Object.values(completedRounds).filter(r => r.passed).length}
            totalQuestionsSolved={totalQuestionsAnswered}
            errorCount={mistakeIds.length}
            isVip={isVip}
            onContinueRound={(r) => handleStartRound(r)}
            onGoToCurriculum={() => setAppTab('curriculum')}
            onGoToTheory={() => setAppTab('theory')}
            onGoToExam={() => {
              if (!requireLogin('অফিসিয়াল পরীক্ষা শুরু করতে')) return;
              setCurrentRoundId(null);
              setAppTab('exam');
            }}
            onGoToErrors={() => {
              if (!requireLogin('ভুলের খাতা দেখতে')) return;
              setAppTab('errors');
            }}
            onOpenEnrollment={() => setAppTab('enrollment')}
          />
        )}

        {appTab === 'curriculum' && (
          <RoundsCurriculumView
            currentRoundId={effectiveUnlockedRound}
            unlockedRound={effectiveUnlockedRound}
            isVip={isVip}
            onSelectRound={handleStartRound}
            onTriggerEnrollment={(_r) => setAppTab('enrollment')}
            completedRounds={completedRounds}
          />
        )}

        {appTab === 'theory' && (
          <TheorySummaryView
            onStartRound={handleStartRound}
            onOpenExamSim={() => {
              if (!requireLogin('অফিসিয়াল পরীক্ষা শুরু করতে')) return;
              setCurrentRoundId(null);
              setAppTab('exam');
            }}
          />
        )}

        {appTab === 'exam' && (
          <ExamSimulator
            roundId={currentRoundId}
            onBackToRounds={() => {
              setCurrentRoundId(null);
              setAppTab('curriculum');
            }}
            onSelectRound={handleStartRound}
            onSaveMistakes={handleSaveExamMistakes}
            onGoToTopics={() => setAppTab('theory')}
          />
        )}

        {appTab === 'errors' && (
          <MistakeReview
            mistakeIds={mistakeIds}
            onClearMistakes={() => setMistakeIds([])}
            onRemoveMistake={(id) => setMistakeIds((prev) => prev.filter((item) => item !== id))}
            onGoToTopics={() => setAppTab('theory')}
          />
        )}

        {appTab === 'admin' && (
          adminEmail ? (
            <AdminCrmDashboard
              adminEmail={adminEmail}
              onExitAdmin={() => {
                try {
                  sessionStorage.removeItem('patente_admin_auth');
                } catch {}
                setAdminEmail(null);
                setAppTab('dashboard');
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center mx-auto text-3xl">
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
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                Log In as Admin
              </button>
            </div>
          )
        )}

        {appTab === 'enrollment' && (
          <AcademyEnrollmentPage
            onBack={() => setAppTab('dashboard')}
            onOpenPayment={() => setIsPaymentModalOpen(true)}
            attemptedRound={unlockedRound > 20 ? unlockedRound : 21}
          />
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

      {/* Official Driving Academy Enrollment Modal */}
      <EnrollmentModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onContinueFree={() => setIsPaywallOpen(false)}
        onViewFullPage={() => {
          setIsPaywallOpen(false);
          setAppTab('enrollment');
        }}
        onOpenPayment={() => {
          setIsPaywallOpen(false);
          setIsPaymentModalOpen(true);
        }}
        attemptedRound={unlockedRound > 20 ? unlockedRound : 21}
      />

      {/* Direct Online Payment Checkout Modal */}
      <CoursePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        initialStudent={
          currentUser
            ? {
                name: currentUser.name,
                email: currentUser.email,
              }
            : studentLead
            ? {
                name: studentLead.name,
                email: studentLead.email,
                phone: studentLead.phone,
              }
            : null
        }
        attemptedRound={unlockedRound > 20 ? unlockedRound : 21}
      />

      {/* Official Tax Invoice & Payment Receipt Modal (Printable/Downloadable PDF) */}
      <CourseInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={activeInvoice}
        onStartCourse={() => {
          setIsInvoiceModalOpen(false);
          setAppTab('curriculum');
        }}
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
        onOpenPaywall={() => setAppTab('enrollment')}
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
          setAppTab('admin');
        }}
      />

      {/* Footer */}
      <Footer
        setActiveTab={handleSelectTab}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAdmin={() => {
          if (adminEmail) {
            setAppTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />
    </div>
  );
}

export default App;
