import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import type { NavTab } from './components/Header';
import { AppNavigation } from './components/AppNavigation';
import type { AppTab } from './components/AppNavigation';
import { StudentDashboardView } from './components/StudentDashboardView';
import type { StudentUser } from './components/StudentAuthModal';
import {
  subscribeToAuthChanges,
  logoutStudent,
  syncStudentProgressToCloud,
  sanitizeStudentProfile,
  fetchStudentFromServerDb,
} from './services/studentService';
import type { ThemeMode } from './components/ThemeSwitcher';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';
import { 
  getLatestInvoice, 
  createInvoiceRecord, 
  saveInvoice 
} from './services/paymentService';
import type { InvoiceRecord } from './services/paymentService';
import { trackPageView, trackThemeChange } from './services/analytics';
import { 
  getAppSettings, 
  fetchRemoteAppSettings, 
  SETTINGS_CHANGE_EVENT 
} from './services/appSettingsService';
import type { AppSettings } from './services/appSettingsService';
import { trackViewContent, trackPurchase } from './utils/metaPixel';

type ExtendedTab = AppTab | 'admin' | 'enrollment';

const PATH_TO_TAB: Record<string, ExtendedTab> = {
  '/': 'dashboard',
  '/rounds': 'curriculum',
  '/curriculum': 'curriculum',
  '/theory': 'theory',
  '/exam': 'exam',
  '/errors': 'errors',
  '/mistakes': 'errors',
  '/enroll': 'enrollment',
  '/admin': 'admin',
};

const TAB_TO_PATH: Record<ExtendedTab, string> = {
  dashboard: '/',
  curriculum: '/rounds',
  theory: '/theory',
  exam: '/exam',
  errors: '/errors',
  enrollment: '/enroll',
  admin: '/admin',
};

const ROUTE_SEO: Record<ExtendedTab, { title: string; description: string; path: string }> = {
  dashboard: {
    title: 'Patente B Italia (বাংলা) | PatenteGuru.it — ইতালিয়ান ড্রাইভিং লাইসেন্স কুইজ ও বাংলা ব্যাখ্যা',
    description:
      'ইতালিয়ান ড্রাইভিং লাইসেন্স (Patente B) ২০২৬ এর অফিশিয়াল ৭,১৬৫টি কুইজ বাংলা অনুবাদ, অডিও উচ্চারণ ও ২৪০টি রাউন্ড সহ অনুশীলন করুন। Quiz Patente B in Bangla.',
    path: '/',
  },
  curriculum: {
    title: '২৪০টি অফিশিয়াল রাউন্ড (240 Rounds) | Patente B বাংলা কুইজ — PatenteGuru.it',
    description:
      'ইতালির মিনিস্টারিয়াল ৭,১৬৫টি অফিশিয়াল কুইজের ২৪০টি ধাপে ধাপে সাজানো রাউন্ড বাংলা অর্থ ও ট্রিকস সহ অনুশীলন করুন। 240 Round Quiz Patente B in Bengali.',
    path: '/rounds',
  },
  theory: {
    title: '২৫টি থিওরি অধ্যায় ও শব্দকোষ (Teoria Patente B বাংলা) | PatenteGuru.it',
    description:
      'Patente B পরীক্ষার ২৫টি থিওরি অধ্যায়, ট্রাফিক সিগন্যাল এবং ট্রাবোকেত্তো (ফাঁদ শব্দ) বাংলায় সহজ ব্যাখ্যা সহ পড়ুন। Teoria Patente B spiegata in Bengali.',
    path: '/theory',
  },
  exam: {
    title: 'অফিশিয়াল সিমুলেশন পরীক্ষা (Simulazione Esame Patente B বাংলা) | PatenteGuru.it',
    description:
      'ইতালিয়ান মিনিস্টারিয়াল নিয়মে ৩০টি প্রশ্ন ও ২০ মিনিটের অফিশিয়াল Patente B সিমুলেশন পরীক্ষা দিন বাংলা সাহায্য ও অডিও উচ্চারণ সহ।',
    path: '/exam',
  },
  errors: {
    title: 'ভুলের খাতা ও রিভিশন (Ripasso Errori Patente B বাংলা) | PatenteGuru.it',
    description:
      'আপনার ভুল করা Patente B কুইজগুলো বাংলা ব্যাখ্যা ও ট্রিকস সহ পুনরায় অনুশীলন করুন এবং পরীক্ষায় ১০০% পাস নিশ্চিত করুন।',
    path: '/errors',
  },
  enrollment: {
    title: 'সম্পূর্ণ কোর্স ও প্রো পাস (Corso Completo Patente B) | PatenteGuru.it',
    description:
      'PatenteGuru Autoscuola Digitale-এ ভর্তি হয়ে ২৪০টি অফিশিয়াল রাউন্ড, অডিও উচ্চারণ এবং লাইফটাইম অ্যাক্সেস আনলক করুন।',
    path: '/enroll',
  },
  admin: {
    title: 'Admin CRM & Student Progress Monitor | PatenteGuru.it',
    description: 'PatenteGuru Admin CRM & Student Progress Control Panel.',
    path: '/admin',
  },
};

// Lazy-loaded views & modals (keeps initial bundle ultra-fast!)
const RoundsCurriculumView = lazy(() => import('./components/RoundsCurriculumView').then(m => ({ default: m.RoundsCurriculumView })));
const EnrollmentModal = lazy(() => import('./components/EnrollmentModal').then(m => ({ default: m.EnrollmentModal })));
const StudentAuthModal = lazy(() => import('./components/StudentAuthModal').then(m => ({ default: m.StudentAuthModal })));
const TheorySummaryView = lazy(() => import('./components/TheorySummaryView').then(m => ({ default: m.TheorySummaryView })));
const ExamSimulator = lazy(() => import('./components/ExamSimulator').then(m => ({ default: m.ExamSimulator })));
const MistakeReview = lazy(() => import('./components/MistakeReview').then(m => ({ default: m.MistakeReview })));
const AdminCrmDashboard = lazy(() => import('./components/AdminCrmDashboard').then(m => ({ default: m.AdminCrmDashboard })));
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const AboutModal = lazy(() => import('./components/AboutModal').then(m => ({ default: m.AboutModal })));
const PatenteChatbot = lazy(() => import('./components/PatenteChatbot').then(m => ({ default: m.PatenteChatbot })));
const StudentProfileModal = lazy(() => import('./components/StudentProfileModal').then(m => ({ default: m.StudentProfileModal })));
const AcademyEnrollmentPage = lazy(() => import('./components/AcademyEnrollmentPage').then(m => ({ default: m.AcademyEnrollmentPage })));
const CoursePaymentModal = lazy(() => import('./components/CoursePaymentModal').then(m => ({ default: m.CoursePaymentModal })));
const CourseInvoiceModal = lazy(() => import('./components/CourseInvoiceModal').then(m => ({ default: m.CourseInvoiceModal })));
const StudentLeadModal = lazy(() => import('./components/StudentLeadModal').then(m => ({ default: m.StudentLeadModal })));

// Calculate true progress: sequential passed rounds or highest completed round reached
export const getSequentialUnlockedRound = (completed?: Record<number, { passed: boolean }> | null): number => {
  if (!completed || typeof completed !== 'object') return 1;
  let r = 1;
  while (completed[r]?.passed === true && r < 240) {
    r++;
  }
  const completedKeys = Object.keys(completed)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 240);
  if (completedKeys.length === 0) return r;
  const highestCompleted = Math.max(...completedKeys);
  const highestNext = completed[highestCompleted]?.passed
    ? Math.min(240, highestCompleted + 1)
    : highestCompleted;
  return Math.max(r, highestNext);
};

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const normalizedPathname = location.pathname.replace(/\/+$/, '') || '/';
  const appTab: ExtendedTab = PATH_TO_TAB[normalizedPathname] || 'dashboard';

  const setAppTab = useCallback(
    (nextTab: ExtendedTab) => {
      const targetPath = TAB_TO_PATH[nextTab] || '/';
      if (location.pathname !== targetPath) {
        navigate(targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    },
    [location.pathname, navigate]
  );

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);

  // Direct Online Payment & Invoicing State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceRecord | null>(() => {
    try {
      const saved = localStorage.getItem('patente_student_user');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.email && parsed?.isVip ? getLatestInvoice(parsed.email) : null;
    } catch {
      return null;
    }
  });
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
    trackThemeChange(newTheme);
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

  // Dynamic per-route SEO metadata & analytics tracking
  useEffect(() => {
    trackPageView(appTab);
    const seo = ROUTE_SEO[appTab] || ROUTE_SEO.dashboard;
    document.title = seo.title;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', seo.description);
    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
    setMeta('meta[property="og:url"]', 'content', `https://www.patenteguru.it${seo.path}`);
    setMeta('link[rel="canonical"]', 'href', `https://www.patenteguru.it${seo.path}`);
  }, [appTab]);

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

  // Dynamic App Policy & Marketing Settings (free rounds limit, promo banners, etc.)
  const [appSettings, setAppSettings] = useState<AppSettings>(() => getAppSettings());

  useEffect(() => {
    fetchRemoteAppSettings().then((s) => {
      if (s) setAppSettings(s);
    });

    const handleSettingsChanged = (e: any) => {
      if (e?.detail) {
        setAppSettings(e.detail);
      }
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
  }, []);

  // Current Student User State (Mandatory login system + MongoDB Atlas Backend)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem('patente_student_user');
      return saved ? sanitizeStudentProfile(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authForcedMessage, setAuthForcedMessage] = useState('');

  // Subscribe to Student Authentication & MongoDB Profile
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((profile) => {
      try {
        if (profile) {
          const safe = sanitizeStudentProfile(profile);
          setCurrentUser(safe);
          if (profile.unlockedRound && Number.isFinite(profile.unlockedRound)) {
            setUnlockedRound((prev) => Math.max(prev || 1, profile.unlockedRound));
          }
          if (profile.totalQuestionsAnswered && Number.isFinite(profile.totalQuestionsAnswered)) {
            setTotalQuestionsAnswered((prev) => Math.max(prev || 0, profile.totalQuestionsAnswered));
          }
          if (profile.completedRounds && typeof profile.completedRounds === 'object' && !Array.isArray(profile.completedRounds)) {
            setCompletedRounds((prev) => ({ ...(prev || {}), ...profile.completedRounds }));
          }
          if (Array.isArray(profile.mistakeIds)) {
            setMistakeIds((prev) => Array.from(new Set([...(prev || []), ...profile.mistakeIds])));
          }
          const vipStatus = Boolean(safe.isVip);
          setIsVip(vipStatus);
          setActiveInvoice(vipStatus ? getLatestInvoice(safe.email) : null);
          if (!vipStatus) {
            setIsInvoiceModalOpen(false);
          }
        } else {
          setCurrentUser(null);
          setIsVip(false);
          setActiveInvoice(null);
          setIsInvoiceModalOpen(false);
        }
      } catch (err) {
        console.warn('Error in auth change handler:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cross-device check with MongoDB Atlas for VIP status & progress (authoritative server check)
  useEffect(() => {
    if (currentUser?.email) {
      fetchStudentFromServerDb(currentUser.email)
        .then((remote) => {
          if (remote) {
            if (remote.isVip) {
              setIsVip(true);
              setActiveInvoice(getLatestInvoice(currentUser.email));
              try {
                localStorage.setItem('patente_bangla_is_vip', 'true');
              } catch {}
            } else {
              setIsVip(false);
              setActiveInvoice(null);
              setIsInvoiceModalOpen(false);
              try {
                localStorage.removeItem('patente_bangla_is_vip');
              } catch {}
            }
            if (typeof remote.unlockedRound === 'number' && remote.unlockedRound > unlockedRound) {
              setUnlockedRound(remote.unlockedRound);
            }
            if (typeof remote.totalQuestionsAnswered === 'number' && remote.totalQuestionsAnswered > totalQuestionsAnswered) {
              setTotalQuestionsAnswered(remote.totalQuestionsAnswered);
            }
            if (remote.completedRounds && typeof remote.completedRounds === 'object' && !Array.isArray(remote.completedRounds)) {
              setCompletedRounds((prev) => ({ ...remote.completedRounds, ...(prev || {}) }));
            }
          }
        })
        .catch(() => {});
    } else {
      setIsVip(false);
      setActiveInvoice(null);
      setIsInvoiceModalOpen(false);
    }
  }, [currentUser?.email]);

  const handleLogout = async () => {
    await logoutStudent();
    setCurrentUser(null);
    setIsVip(false);
    setActiveInvoice(null);
    setIsInvoiceModalOpen(false);
    setUnlockedRound(1);
    setTotalQuestionsAnswered(0);
    setCompletedRounds({});
    setMistakeIds([]);
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

  // Auto-detect #admin, ?admin=true, or /admin route
  useEffect(() => {
    const checkAdmin = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true') || location.pathname === '/admin') {
        if (adminEmail) {
          if (location.pathname !== '/admin') setAppTab('admin');
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, [adminEmail, location.pathname, setAppTab]);

  // VIP State (strictly derived from authenticated student profile)
  const [isVip, setIsVip] = useState<boolean>(() => Boolean(currentUser?.isVip));

  // Total questions answered count
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_answered_count');
      const val = saved ? parseInt(saved, 10) : 0;
      return Number.isFinite(val) && val >= 0 ? val : 0;
    } catch {
      return 0;
    }
  });

  // Highest unlocked round (default 1)
  const [unlockedRound, setUnlockedRound] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_unlocked_round');
      const val = saved ? parseInt(saved, 10) : 1;
      return Number.isFinite(val) && val >= 1 ? val : 1;
    } catch {
      return 1;
    }
  });

  // Completed rounds history
  const [completedRounds, setCompletedRounds] = useState<Record<number, { errors: number; passed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_completed_rounds');
      const val = saved ? JSON.parse(saved) : {};
      return val && typeof val === 'object' && !Array.isArray(val) ? val : {};
    } catch {
      return {};
    }
  });

  // Mistakes bank
  const [mistakeIds, setMistakeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('patente_bangla_mistakes');
      const val = saved ? JSON.parse(saved) : [];
      return Array.isArray(val) ? val : [];
    } catch {
      return [];
    }
  });

  // Persist VIP
  useEffect(() => {
    if (isVip && currentUser) {
      localStorage.setItem('patente_bangla_is_vip', 'true');
    } else {
      localStorage.removeItem('patente_bangla_is_vip');
    }
  }, [isVip, currentUser]);

  // Persist answered count
  useEffect(() => {
    localStorage.setItem('patente_bangla_answered_count', String(totalQuestionsAnswered));
  }, [totalQuestionsAnswered]);

  // Effective unlocked round derived from completed rounds and current unlockedRound
  const effectiveUnlockedRound = Math.max(unlockedRound, getSequentialUnlockedRound(completedRounds));

  // Sync unlockedRound with real progress without resetting backwards
  useEffect(() => {
    setUnlockedRound((prev) => {
      const nextVal = Math.max(prev, effectiveUnlockedRound);
      try {
        localStorage.setItem('patente_bangla_unlocked_round', String(nextVal));
      } catch {}
      return nextVal;
    });
  }, [effectiveUnlockedRound]);

  // Persist completed rounds
  useEffect(() => {
    localStorage.setItem('patente_bangla_completed_rounds', JSON.stringify(completedRounds));
  }, [completedRounds]);

  // Persist mistakes
  useEffect(() => {
    localStorage.setItem('patente_bangla_mistakes', JSON.stringify(mistakeIds));
  }, [mistakeIds]);

  // Sync student study progress to MongoDB Atlas whenever progress changes
  // (Never pass client-side isVip here so stale local storage can never grant free VIP!)
  useEffect(() => {
    if (currentUser?.uid || currentUser?.email) {
      syncStudentProgressToCloud(currentUser.uid, {
        email: currentUser.email,
        unlockedRound,
        totalQuestionsAnswered,
        completedRounds,
        mistakeIds,
      });
    }
  }, [unlockedRound, totalQuestionsAnswered, completedRounds, mistakeIds, currentUser?.uid, currentUser?.email]);

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
      // If student hits dynamic free questions limit and is not VIP, trigger paywall!
      const freeQuestionsLimit = appSettings.freeRoundsLimit * 30;
      if (!isVip && freeQuestionsLimit > 0 && prev < freeQuestionsLimit && updated >= freeQuestionsLimit) {
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
    const updatedTotalQuestions = totalQuestionsAnswered + 30;
    incrementAnsweredCount(30);

    const updatedMistakes = Array.from(new Set([...mistakeIds, ...newIds]));
    setMistakeIds(updatedMistakes);

    const fallbackRoundNum = Math.min(240, Math.max(1, Math.floor(updatedTotalQuestions / 30)));
    const activeRoundNum = finishedRoundId || currentRoundId || fallbackRoundNum;

    const errorCount = newIds.length;
    const passed = errorCount <= 3;

    const updatedCompletedRounds = {
      ...completedRounds,
      [activeRoundNum]: { errors: errorCount, passed },
    };
    setCompletedRounds(updatedCompletedRounds);

    const nextUnlocked = passed ? Math.min(240, activeRoundNum + 1) : activeRoundNum;
    const updatedUnlockedRound = Math.max(unlockedRound, activeRoundNum, nextUnlocked);
    setUnlockedRound(updatedUnlockedRound);

    try {
      localStorage.setItem('patente_bangla_unlocked_round', String(updatedUnlockedRound));
      localStorage.setItem('patente_bangla_completed_rounds', JSON.stringify(updatedCompletedRounds));
      localStorage.setItem('patente_bangla_answered_count', String(updatedTotalQuestions));
    } catch {}

    if (passed && activeRoundNum === appSettings.freeRoundsLimit && !isVip && appSettings.freeRoundsLimit < 240) {
      setTimeout(() => {
        setIsPaywallOpen(true);
      }, 1800);
    }

    // Immediately sync completed round & quiz count to MongoDB Atlas so CRM updates in real time
    if (currentUser?.uid || currentUser?.email) {
      syncStudentProgressToCloud(currentUser.uid, {
        email: currentUser.email,
        unlockedRound: updatedUnlockedRound,
        totalQuestionsAnswered: updatedTotalQuestions,
        completedRounds: updatedCompletedRounds,
        mistakeIds: updatedMistakes,
      });
    }
  };

  const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);

  const handleStartRound = (roundId: number) => {
    // Strict authentication gate: nobody can access questions without login
    if (!requireLogin('রাউন্ড শুরু করতে')) {
      return;
    }
    // If round is not free (round > dynamic freeRoundsLimit) and user is not VIP, show paywall!
    if (roundId > appSettings.freeRoundsLimit && !isVip) {
      setIsPaywallOpen(true);
      return;
    }
    // Sequential locking only applies to non-VIP students:
    // VIP students (who paid or were granted the 240 Free VIP pass) can practice ANY round from 1 to 240!
    if (!isVip && roundId > effectiveUnlockedRound) {
      alert(`🔒 রাউন্ড #${roundId} এখনও লক করা। দয়া করে প্রথমে পূর্ববর্তী রাউন্ড #${roundId - 1} সফলভাবে পাস করুন (সর্বোচ্চ ৩টি ভুল)।`);
      return;
    }
    // Switch to exam simulator to take the round
    setCurrentRoundId(roundId);
    setAppTab('exam');
    trackViewContent(`Round #${roundId}`, roundId <= appSettings.freeRoundsLimit ? 'Free Quiz Round' : 'Pro Round');
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
    trackPurchase(invoice?.amount || appSettings.academyPriceEur || 49, 'EUR', 'Patente Bangla Pro Pass - 240 Rounds');

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

  // Auto-detect and handle Stripe Checkout return (?payment_success=true&session_id=...)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccess = urlParams.get('payment_success') === 'true';
      const sessionId = urlParams.get('session_id');

      if (isSuccess && sessionId) {
        // Clean URL query parameters smoothly
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);

        // Verify session status with Stripe backend
        fetch(`/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`)
          .then((res) => {
            const ct = res.headers.get('content-type') || '';
            if (res.ok && ct.includes('application/json')) {
              return res.json();
            }
            return null;
          })
          .then((data) => {
            if (data?.success && data?.paid && data?.invoice) {
              handlePaymentSuccess(data.invoice);
            }
          })
          .catch((err) => {
            console.warn('Stripe payment verification notice:', err);
          });
      }
    } catch {}
  }, []);

  const handleOpenInvoice = () => {
    if (!isVip || !currentUser) {
      setIsPaymentModalOpen(true);
      return;
    }
    let inv = activeInvoice || getLatestInvoice(currentUser.email);
    if (!inv) {
      inv = createInvoiceRecord({
        studentName: currentUser.name || studentLead?.name || 'Studente Ufficiale Patente B',
        studentEmail: currentUser.email,
        studentPhone: currentUser.phone || studentLead?.phone || '+39 351 000 0000',
        codiceFiscale: 'REGOLARE',
        address: 'Italia',
        city: 'Bolzano',
        paymentMethod: 'card',
      }, appSettings.academyPriceEur || 49);
      saveInvoice(inv);
      setActiveInvoice(inv);
    }
    setIsInvoiceModalOpen(true);
  };

  // Lock background page scroll & document height whenever any popup modal is open
  // This prevents full-page screenshot tools (like mypdftools capture) from scrolling the background page and repeating the popup!
  const isAnyModalOpen =
    isAuthModalOpen ||
    isPaywallOpen ||
    isStudentProfileOpen ||
    isPaymentModalOpen ||
    isInvoiceModalOpen ||
    isLeadModalOpen ||
    isAboutOpen ||
    isAdminLoginOpen;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isAnyModalOpen) {
      html.style.overflow = 'hidden';
      html.style.height = '100vh';
      body.style.overflow = 'hidden';
      body.style.height = '100vh';
    } else {
      html.style.overflow = '';
      html.style.height = '';
      body.style.overflow = '';
      body.style.height = '';
    }
    return () => {
      html.style.overflow = '';
      html.style.height = '';
      body.style.overflow = '';
      body.style.height = '';
    };
  }, [isAnyModalOpen]);

  return (
    <div
      className={`${
        isAnyModalOpen ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      } flex flex-col font-sans relative ${
        currentTheme === 'sepia'
          ? 'theme-sepia bg-[#F5EEDB] text-[#2F1B0B] selection:bg-[#B45309] selection:text-white'
          : currentTheme === 'dark'
          ? 'dark bg-[#0D1117] text-[#F8FAFC] selection:bg-[#E52E2D] selection:text-white'
          : 'theme-light bg-[#F8FAFC] text-slate-900 selection:bg-[#FB6C00] selection:text-white'
      }`}
    >
      {/* Navigation Header */}
      <Header
        totalQuestionsAnswered={totalQuestionsAnswered}
        isVip={isVip}
        freeRoundsLimit={appSettings.freeRoundsLimit}
        academyPriceEur={appSettings.academyPriceEur}
        regularPriceEur={appSettings.regularPriceEur}
        onOpenPaywall={() => setIsPaymentModalOpen(true)}
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
        onGoToCurriculum={() => setAppTab('curriculum')}
        onOpenStudentProfile={() => setIsStudentProfileOpen(true)}
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
                {appSettings.freeRoundsLimit === 0
                  ? 'Official Academy Curriculum • 240 Rounds'
                  : appSettings.freeRoundsLimit >= 240
                  ? 'Open Curriculum (Rounds 1–240) • 7,165 Questions Free'
                  : `Foundation Assessment (Rounds 1–${appSettings.freeRoundsLimit}) • ${appSettings.freeRoundsLimit * 30} Questions Free`}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sign in to track your progress, practice with oral exam audio, and unlock your free rounds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAuthForcedMessage(
                  appSettings.freeRoundsLimit === 0
                    ? 'কুইজ ও রাউন্ড শুরু করতে অনুগ্রহ করে সাইন ইন বা ফ্রি রেজিস্টার করুন।'
                    : `${appSettings.freeRoundsLimit}টি ফ্রি রাউন্ড শুরু করতে অনুগ্রহ করে সাইন ইন বা ফ্রি রেজিস্টার করুন।`
                );
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs shrink-0 cursor-pointer shadow-md shadow-[#FB6C00]/25 transition active:scale-95"
            >
              Sign In / Register Free
            </button>
          </div>
        )}

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FB6C00] border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900 dark:text-white">লোড হচ্ছে...</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Patente Guru উপাদান প্রস্তুত হচ্ছে</p>
            </div>
          </div>
        }>
          {appTab === 'dashboard' && (
            <StudentDashboardView
              student={currentUser}
              activeRound={effectiveUnlockedRound}
              completedRoundsCount={Object.values(completedRounds || {}).filter(r => r?.passed).length}
              totalQuestionsSolved={totalQuestionsAnswered}
              errorCount={mistakeIds.length}
              isVip={isVip}
              freeRoundsLimit={appSettings.freeRoundsLimit}
              academyPriceEur={appSettings.academyPriceEur}
              regularPriceEur={appSettings.regularPriceEur}
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
              onOpenEnrollment={() => setIsPaymentModalOpen(true)}
            />
          )}

          {appTab === 'curriculum' && (
            <RoundsCurriculumView
              currentRoundId={effectiveUnlockedRound}
              unlockedRound={effectiveUnlockedRound}
              isVip={isVip}
              freeRoundsLimit={appSettings.freeRoundsLimit}
              academyPriceEur={appSettings.academyPriceEur}
              regularPriceEur={appSettings.regularPriceEur}
              onSelectRound={handleStartRound}
              onTriggerEnrollment={(_r) => setIsPaymentModalOpen(true)}
              completedRounds={completedRounds}
            />
          )}

          {appTab === 'theory' && (
            <TheorySummaryView
              onStartRound={handleStartRound}
              isVip={isVip}
              academyPriceEur={appSettings.academyPriceEur}
              regularPriceEur={appSettings.regularPriceEur}
              onOpenEnrollment={() => setIsPaymentModalOpen(true)}
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
              isVip={isVip}
              academyPriceEur={appSettings.academyPriceEur}
              onOpenEnrollment={() => setIsPaymentModalOpen(true)}
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
              <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-[#12161F] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#FB6C00]/10 border border-[#FB6C00]/20 text-[#FB6C00] flex items-center justify-center mx-auto text-3xl">
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
                  className="w-full py-3 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white font-black text-sm shadow-lg shadow-[#FB6C00]/25 transition cursor-pointer"
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
              academyPriceEur={appSettings.academyPriceEur}
              regularPriceEur={appSettings.regularPriceEur}
            />
          )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {/* Mandatory Student Auth Modal */}
        {isAuthModalOpen && (
          <StudentAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={(user) => {
              const safe = sanitizeStudentProfile(user);
              setCurrentUser(safe);
              const vipStatus = Boolean(safe.isVip);
              setIsVip(vipStatus);
              setActiveInvoice(vipStatus ? getLatestInvoice(safe.email) : null);
              if (!vipStatus) {
                setIsInvoiceModalOpen(false);
              }
            }}
            forcedMessage={authForcedMessage}
          />
        )}

        {/* Official Driving Academy Enrollment Modal */}
        {isPaywallOpen && (
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
            attemptedRound={unlockedRound > appSettings.freeRoundsLimit ? unlockedRound : appSettings.freeRoundsLimit + 1}
            academyPriceEur={appSettings.academyPriceEur}
            regularPriceEur={appSettings.regularPriceEur}
            freeRoundsLimit={appSettings.freeRoundsLimit}
          />
        )}

        {/* Student Personal Profile & Data Modal */}
        {isStudentProfileOpen && (
          <StudentProfileModal
            isOpen={isStudentProfileOpen}
            onClose={() => setIsStudentProfileOpen(false)}
            student={currentUser}
            isVip={isVip}
            onLogout={handleLogout}
            onOpenInvoice={handleOpenInvoice}
            onUpdateProfile={(updated) => {
              const safe = sanitizeStudentProfile(updated);
              setCurrentUser(safe);
              try {
                localStorage.setItem('patente_student_user', JSON.stringify(safe));
              } catch {}
            }}
          />
        )}

        {/* Direct Online Payment Checkout Modal */}
        {isPaymentModalOpen && (
          <CoursePaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={handlePaymentSuccess}
            academyPriceEur={appSettings.academyPriceEur}
            regularPriceEur={appSettings.regularPriceEur}
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
        )}

        {/* Official Tax Invoice & Payment Receipt Modal (Printable/Downloadable PDF) */}
        {isInvoiceModalOpen && (
          <CourseInvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={() => setIsInvoiceModalOpen(false)}
            invoice={activeInvoice}
            onStartCourse={() => {
              setIsInvoiceModalOpen(false);
              setAppTab('curriculum');
            }}
          />
        )}

        {/* Student Lead Registration Modal */}
        {isLeadModalOpen && (
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
        )}

        {/* About Us Modal (Shifat Manjum & Zentixx Story) */}
        {isAboutOpen && (
          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        )}

        {/* Floating 24/7 AI Maestro Tutor Chatbot */}
        <PatenteChatbot
          currentTheme={currentTheme}
          currentUser={currentUser}
          onOpenPaywall={() => setIsPaymentModalOpen(true)}
        />

        {/* Admin Login Gate Modal */}
        {isAdminLoginOpen && (
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
        )}
      </Suspense>

      {/* Mobile Sticky Floating Pay Now Bar (Always visible and easily accessible on mobile) */}
      <div className="md:hidden fixed bottom-[74px] sm:bottom-[78px] left-3 right-3 z-30 animate-fadeIn pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            if (isVip) {
              handleOpenInvoice();
            } else {
              setIsPaymentModalOpen(true);
            }
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#E52E2D] via-[#FB6C00] to-[#E52E2D] text-white font-black text-xs shadow-2xl shadow-[#FB6C00]/40 flex items-center justify-between border border-white/25 active:scale-95 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span className="truncate">
              {isVip
                ? '⭐ VIP সক্রিয় • অফিসিয়াল রসিদ দেখুন'
                : `🔥 ২৪০টি রাউন্ডের সম্পূর্ণ কোর্স আনলক (€${appSettings.academyPriceEur || 49})`}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-slate-950 text-[11px] font-black shrink-0 shadow-sm ml-2">
            {isVip ? 'রসিদ' : '💳 Pay Now'}
          </span>
        </button>
      </div>

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
