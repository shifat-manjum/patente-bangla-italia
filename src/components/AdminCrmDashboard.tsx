import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Phone,
  DollarSign,
  TrendingUp,
  LogOut,
  RefreshCw,
  Sparkles,
  Database,
  ExternalLink,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore';
import type { StudentProfile } from '../services/studentService';
import { AdminQuestionExplorer } from './AdminQuestionExplorer';
import { CourseInvoiceModal } from './CourseInvoiceModal';
import { 
  getInvoices, 
  createInvoiceRecord, 
  saveInvoice 
} from '../services/paymentService';
import type { InvoiceRecord } from '../services/paymentService';
import { 
  getAppSettings, 
  saveAppSettings, 
  fetchRemoteAppSettings 
} from '../services/appSettingsService';
import type { AppSettings } from '../services/appSettingsService';

interface AdminCrmDashboardProps {
  adminEmail: string;
  onExitAdmin: () => void;
}

// Helper for instantaneous local cache retrieval (0ms initial render)
const getInitialCachedStudents = (): StudentProfile[] => {
  try {
    const map = new Map<string, StudentProfile>();

    // 1. Registered students
    try {
      const localStudents: StudentProfile[] = JSON.parse(
        localStorage.getItem('patente_registered_students') || '[]'
      );
      if (Array.isArray(localStudents)) {
        localStudents.forEach((s) => {
          if (s?.email) map.set(s.email.toLowerCase(), s);
        });
      }
    } catch {}

    // 2. Currently logged-in student user
    try {
      const current = localStorage.getItem('patente_student_user');
      if (current) {
        const curObj = JSON.parse(current);
        if (curObj?.email) {
          map.set(curObj.email.toLowerCase(), { ...map.get(curObj.email.toLowerCase()), ...curObj });
        }
      }
    } catch {}

    // 3. Lead modal submissions
    try {
      const lead = localStorage.getItem('patente_bangla_student_lead');
      if (lead) {
        const l = JSON.parse(lead);
        if (l?.email && !map.has(l.email.toLowerCase())) {
          map.set(l.email.toLowerCase(), {
            uid: 'lead_' + Date.now(),
            name: l.name || 'Student Lead',
            email: l.email,
            phone: l.phone || undefined,
            unlockedRound: 1,
            totalQuestionsAnswered: 0,
            completedRounds: {},
            mistakeIds: [],
            isVip: false,
            createdAt: l.date || new Date().toISOString(),
          });
        }
      }
    } catch {}

    return Array.from(map.values());
  } catch {
    return [];
  }
};

export const AdminCrmDashboard: React.FC<AdminCrmDashboardProps> = ({
  adminEmail,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'questions'>('crm');
  // Immediately initialize state with cached students so admin sees data in 0ms!
  const [students, setStudents] = useState<StudentProfile[]>(() => getInitialCachedStudents());
  const [isLoading, setIsLoading] = useState<boolean>(() => getInitialCachedStudents().length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'pro'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'not_created' | 'offline'>('connected');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentIsVip, setNewStudentIsVip] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<InvoiceRecord | null>(null);

  // Marketing & Free Rounds Policy Settings
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  const handleUpdateFreeRoundsLimit = async (limit: number) => {
    const validLimit = Math.min(240, Math.max(0, limit));
    setIsSavingSettings(true);
    setSettings((prev) => ({ ...prev, freeRoundsLimit: validLimit }));
    try {
      const updated = await saveAppSettings({ freeRoundsLimit: validLimit });
      setSettings(updated);
      setSettingsSaveMsg(`সফলভাবে আপডেট হয়েছে: বর্তমানে ${validLimit}টি রাউন্ড ফ্রি`);
      setTimeout(() => setSettingsSaveMsg(null), 3500);
    } catch (e) {
      console.error('Settings update error:', e);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleOpenStudentInvoice = (student: StudentProfile) => {
    const list = getInvoices(student.email);
    if (list.length > 0) {
      setViewInvoice(list[0]);
    } else {
      const inv = createInvoiceRecord({
        studentName: student.name || 'Studente Patente B',
        studentEmail: student.email,
        studentPhone: student.phone || '+39',
        codiceFiscale: 'REGOLARE',
        address: 'Italia',
        city: 'Bolzano',
        paymentMethod: 'card',
      });
      saveInvoice(inv);
      setViewInvoice(inv);
    }
  };

  // Fetch students with instant local fallback, Server JSON DB (/api/students), and Cloud Firestore
  const fetchStudents = async () => {
    setIsRefreshing(true);
    let serverStudents: StudentProfile[] = [];
    let firestoreStudents: StudentProfile[] = [];

    // 1. Read immediate local data first
    const localStudents = getInitialCachedStudents();
    if (localStudents.length > 0) {
      setStudents(localStudents);
      setIsLoading(false);
    }

    // 2. Fetch from local network API (/api/students backed by students_db.json)
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          serverStudents = data;
        }
      }
    } catch (e) {
      console.warn('Server JSON database fetch notice:', e);
    }

    // 3. Query Cloud Firestore with a 2.5-second race timeout (guarantees UI never freezes)
    if (isFirebaseConfigured && db) {
      try {
        const firestorePromise = getDocs(collection(db, 'students'));
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 2500)
        );
        const querySnapshot = await Promise.race([firestorePromise, timeoutPromise]);
        querySnapshot.forEach((docSnap) => {
          firestoreStudents.push(docSnap.data() as StudentProfile);
        });
        setFirestoreStatus('connected');
      } catch (err: any) {
        const msg = String(err?.message || err || '');
        if (msg.includes('not found') || msg.includes('default') || msg.includes('FAILED_PRECONDITION')) {
          setFirestoreStatus('not_created');
        } else {
          setFirestoreStatus('offline');
        }
        console.warn('Firestore fetch notice (using instantaneous server/cached records):', err);
      }
    }

    // 4. Merge without duplicates (keyed by email or uid)
    const map = new Map<string, StudentProfile>();
    serverStudents.forEach((s) => {
      if (s.email) map.set(s.email.toLowerCase(), s);
      else if (s.uid) map.set(s.uid, s);
    });
    localStudents.forEach((s) => {
      if (s.email) map.set(s.email.toLowerCase(), { ...map.get(s.email.toLowerCase()), ...s });
      else if (s.uid) map.set(s.uid, { ...map.get(s.uid), ...s });
    });
    firestoreStudents.forEach((s) => {
      if (s.email) map.set(s.email.toLowerCase(), { ...map.get(s.email.toLowerCase()), ...s });
      else if (s.uid) map.set(s.uid, { ...map.get(s.uid), ...s });
    });

    const merged = Array.from(map.values());
    if (merged.length > 0) {
      setStudents(merged);
      try {
        localStorage.setItem('patente_registered_students', JSON.stringify(merged));
      } catch {}

      // Sync merged records to server DB so mobile & desktop always have identical data
      try {
        await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged),
        });
      } catch {}
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStudents();
    fetchRemoteAppSettings().then((s) => {
      if (s) setSettings(s);
    });

    // Listen to real-time updates if Firestore is active with error tolerance
    if (isFirebaseConfigured && db) {
      const unsubscribe = onSnapshot(
        collection(db, 'students'),
        (snapshot) => {
          const updatedList: StudentProfile[] = [];
          snapshot.forEach((d) => updatedList.push(d.data() as StudentProfile));
          if (updatedList.length > 0) {
            setStudents((prev) => {
              const map = new Map<string, StudentProfile>();
              prev.forEach((s) => { if (s.email) map.set(s.email.toLowerCase(), s); });
              updatedList.forEach((s) => { if (s.email) map.set(s.email.toLowerCase(), s); });
              const result = Array.from(map.values());
              try {
                localStorage.setItem('patente_registered_students', JSON.stringify(result));
              } catch {}
              return result;
            });
            setFirestoreStatus('connected');
          }
        },
        (err) => {
          const msg = String(err?.message || err || '');
          if (msg.includes('not found') || msg.includes('default')) {
            setFirestoreStatus('not_created');
          }
        }
      );
      return () => unsubscribe();
    }
  }, []);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = student.name?.toLowerCase().includes(q);
        const matchEmail = student.email?.toLowerCase().includes(q);
        const matchPhone = student.phone?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }

      // Filter
      if (filterType === 'pro' && !student.isVip) return false;
      if (filterType === 'free' && student.isVip) return false;

      return true;
    });
  }, [students, searchQuery, filterType]);

  // Key CRM Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const phoneLeads = students.filter((s) => s.phone && s.phone.trim().length > 5).length;
    const proPasses = students.filter((s) => s.isVip).length;
    const totalRevenue = proPasses * 49;
    const totalQuestions = students.reduce((acc, s) => acc + (s.totalQuestionsAnswered || 0), 0);
    return { total, phoneLeads, proPasses, totalRevenue, totalQuestions };
  }, [students]);

  // Toggle Pro Student Pass for a student directly from CRM (all 240 rounds free for closest ones)
  const handleToggleProPass = async (student: StudentProfile) => {
    const newStatus = !student.isVip;
    const confirmMsg = newStatus
      ? `আপনি কি ${student.name}-কে আজীবনের জন্য সব ২৪০ রাউন্ড সম্পূর্ণ ফ্রি এক্সেস (VIP Pass) দিতে চান?\n\n(আপনার ঘনিষ্ঠ বন্ধু, পরিবার বা প্রিমিয়াম শিক্ষার্থীদের জন্য এটি তাৎক্ষণিকভাবে সব ২৪০টি রাউন্ড সম্পূর্ণ ফ্রি আনলক করবে)`
      : `আপনি কি ${student.name}-এর ২৪০ রাউন্ড ফ্রি VIP Pass প্রত্যাহার করতে চান?`;

    if (!window.confirm(confirmMsg)) return;

    // Update in Firestore
    if (isFirebaseConfigured && db && student.uid) {
      try {
        const studentRef = doc(db, 'students', student.uid);
        await updateDoc(studentRef, { isVip: newStatus });
      } catch (err) {
        console.warn('Failed to update Firestore:', err);
      }
    }

    // Update state and local/server database
    const updated = students.map((s) => (s.email === student.email ? { ...s, isVip: newStatus } : s));
    setStudents(updated);
    try {
      localStorage.setItem('patente_registered_students', JSON.stringify(updated));
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...student, isVip: newStatus }),
      }).catch(() => {});
    } catch {}
  };

  // Add new student manually from CRM
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      alert('দয়া করে নাম ও ইমেইল পূরণ করুন');
      return;
    }

    const createdProfile: StudentProfile = {
      uid: 'std_' + Date.now(),
      name: newStudentName.trim(),
      email: newStudentEmail.trim().toLowerCase(),
      phone: newStudentPhone.trim() || undefined,
      unlockedRound: 1,
      totalQuestionsAnswered: 0,
      completedRounds: {},
      mistakeIds: [],
      isVip: newStudentIsVip,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Update Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', createdProfile.uid), createdProfile);
      } catch (e) {
        console.warn('Firestore setDoc notice:', e);
      }
    }

    // Update state and local/server database
    const updated = [createdProfile, ...students.filter((s) => s.email?.toLowerCase() !== createdProfile.email.toLowerCase())];
    setStudents(updated);
    try {
      localStorage.setItem('patente_registered_students', JSON.stringify(updated));
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdProfile),
      });
    } catch {}

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentIsVip(false);
    setIsAddStudentOpen(false);
  };

  // Export students list to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('কোনো স্টুডেন্ট ডেটা নেই');
      return;
    }

    const headers = ['Name', 'Email', 'Phone/WhatsApp', 'Unlocked Round', 'Questions Answered', 'Pro Student Pass', 'Joined Date'];
    const rows = students.map((s) => [
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.unlockedRound || 1}"`,
      `"${s.totalQuestionsAnswered || 0}"`,
      `"${s.isVip ? 'YES (Pro €49)' : 'NO (Free Trial)'}"`,
      `"${s.createdAt ? new Date(s.createdAt.seconds ? s.createdAt.seconds * 1000 : s.createdAt).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `patente_students_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn text-left pb-16">
      {/* Top Admin Topbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white font-black shadow-md">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Patente Bangla Italia • Admin CRM Portal
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Logged in as: <span className="text-orange-400">{adminEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchStudents}
            disabled={isRefreshing}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            title="Refresh student list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Exit Admin Button */}
          <button
            type="button"
            onClick={onExitAdmin}
            className="py-2 px-4 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Firestore Database Setup Guidance Banner */}
      {firestoreStatus === 'not_created' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span>⚠️</span> Cloud Firestore ডাটাবেজ এখনও তৈরি করা হয়নি (Project: patenta-bangla)
            </span>
            <p className="text-[12px] opacity-90 leading-relaxed">
              লোকাল নেটওয়ার্ক ডাটাবেজ (students_db.json) সক্রিয় আছে এবং মোবাইল ও ডেস্কটপে ডেটা লোড হচ্ছে। তবে যেকোনো ডিভাইস থেকে আজীবন গ্লোবাল ক্লাউড সিঙ্ক চালু করতে Firebase Console-এ মাত্র ১-ক্লিকে ডাটাবেজ তৈরি করুন:
            </p>
          </div>
          <a
            href="https://console.firebase.google.com/project/patenta-bangla/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition"
          >
            <span>Firebase Console খুলুন (Create DB)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('crm')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'crm'
              ? 'bg-[#FB6C00] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Leads & CRM ({students.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-[#FB6C00] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Master Questions Explorer (7,165 Qs)</span>
        </button>
      </div>

      {activeTab === 'crm' ? (
        <div className="space-y-6">
          {/* Dynamic Marketing & Free Rounds Policy Control Panel */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#131B2E] to-slate-900 text-white border border-slate-700/80 shadow-2xl space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E52E2D] to-[#FB6C00] flex items-center justify-center text-white shadow-md">
                    <Sliders className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    মার্কেটিং ও ফ্রি রাউন্ড পলিসি (Free Rounds Access Policy)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Live Dynamic
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  মার্কেটিং অফার অনুযায়ী সাধারণ স্টুডেন্টদের জন্য ফ্রি রাউন্ড সংখ্যা নির্ধারণ করুন (০ থেকে ২৪০)। এখানে পরিবর্তন করলেই পুরো ওয়েবসাইটে সাথে সাথে কার্যকর হবে। এছাড়া নিচের টেবিল থেকে আপনার ঘনিষ্ঠ বা বিশেষ শিক্ষার্থীদের আলাদাভাবে <strong>"সব ২৪০ রাউন্ড ফ্রি (VIP Pass)"</strong> দিতে পারবেন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">বর্তমান সক্রিয় লিমিট</span>
                  <span className="text-base font-black text-[#FB6C00]">
                    {settings.freeRoundsLimit} রাউন্ড ফ্রি
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Presets Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>দ্রুত নির্বাচন করুন (Quick Presets):</span>
                {isSavingSettings && (
                  <span className="text-xs font-bold text-[#FB6C00] animate-pulse">
                    সংরক্ষণ ও ক্লাউড সিঙ্ক হচ্ছে...
                  </span>
                )}
                {settingsSaveMsg && (
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{settingsSaveMsg}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { value: 0, label: '০ ফ্রি (Full Paid)', desc: 'সম্পূর্ণ পেইড • কোনো ফ্রি নেই' },
                  { value: 5, label: '৫ রাউন্ড ফ্রি', desc: '১৫০টি কুইজ ফ্রি' },
                  { value: 10, label: '১০ রাউন্ড ফ্রি', desc: '৩০০টি কুইজ ফ্রি' },
                  { value: 20, label: '২০ রাউন্ড ফ্রি (স্ট্যান্ডার্ড)', desc: '৬০০টি কুইজ ফ্রি' },
                  { value: 240, label: '২৪০ রাউন্ড ফ্রি (সব ফ্রি)', desc: '১০০% উন্মুক্ত সিলেবাস' },
                ].map((preset) => {
                  const isActive = settings.freeRoundsLimit === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      disabled={isSavingSettings}
                      onClick={() => handleUpdateFreeRoundsLimit(preset.value)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] border-transparent text-white shadow-lg shadow-[#FB6C00]/25 ring-2 ring-white/20'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{preset.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-[10px] block pt-1 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Slider & Number Input */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>কাস্টম সংখ্যা স্লাইডার (০ থেকে ২৪০):</span>
                  <span className="font-mono text-orange-400 font-black">{settings.freeRoundsLimit} / ২৪০ রাউন্ড</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="240"
                  value={settings.freeRoundsLimit}
                  onChange={(e) => handleUpdateFreeRoundsLimit(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FB6C00]"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-400">সরাসরি ইনপুট:</span>
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={settings.freeRoundsLimit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) handleUpdateFreeRoundsLimit(val);
                  }}
                  className="w-20 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-center text-xs focus:ring-2 focus:ring-[#FB6C00] focus:outline-none"
                />
                <span className="text-xs text-slate-400">রাউন্ড</span>
              </div>
            </div>

            {/* Live Explanation Callout */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">
                {settings.freeRoundsLimit === 0 ? '🚫' : settings.freeRoundsLimit === 240 ? '🎉' : '💡'}
              </span>
              <p className="leading-relaxed">
                {settings.freeRoundsLimit === 0 ? (
                  <>
                    <strong className="text-white">সম্পূর্ণ পেইড পলিসি সক্রিয়:</strong> ওয়েবসাইটে কোনো ফ্রি রাউন্ড নেই। সাধারণ শিক্ষার্থীদের ১ম রাউন্ড থেকেই একাডেমি মেম্বারশিপ (€৪৯) নিতে হবে। তবে আপনার বিশেষ বা ঘনিষ্ঠ শিক্ষার্থীদের নিচের তালিকা থেকে <strong className="text-emerald-400">"🎁 সব ২৪০ রাউন্ড ফ্রি (VIP Pass)"</strong> বাটনে ক্লিক করে সব রাউন্ড ফ্রি করে দিতে পারবেন।
                  </>
                ) : settings.freeRoundsLimit === 240 ? (
                  <>
                    <strong className="text-white">সম্পূর্ণ উন্মুক্ত পলিসি সক্রিয়:</strong> ওয়েবসাইটের সকল ২৪০টি রাউন্ড ও ৭,১৬৫টি কুইজ প্রতিটি সাধারণ শিক্ষার্থীর জন্য সম্পূর্ণ ফ্রি ও উন্মুক্ত।
                  </>
                ) : (
                  <>
                    <strong className="text-white">বর্তমান পলিসি অনুযায়ী:</strong> সাধারণ শিক্ষার্থীরা প্রথম <strong className="text-emerald-400">{settings.freeRoundsLimit}টি রাউন্ড ({settings.freeRoundsLimit * 30}টি প্রশ্ন)</strong> ফ্রিতে অনুশীলন করতে পারবে। রাউন্ড <strong className="text-orange-400">{settings.freeRoundsLimit + 1} থেকে ২৪০</strong> একাডেমি প্রো মেম্বারশিপে লক থাকবে (যদি না আপনি কোনো শিক্ষার্থীকে আলাদাভাবে VIP Pass প্রদান করেন)।
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Executive CRM Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Total Students */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Total Students</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {metrics.total}
              </div>
              <p className="text-[10px] text-slate-400">Registered Accounts</p>
            </div>

            {/* WhatsApp Leads */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>WhatsApp Leads</span>
                <Phone className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {metrics.phoneLeads}
              </div>
              <p className="text-[10px] text-slate-400">With verified phone</p>
            </div>

            {/* Pro Passes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Pro Student Passes</span>
                <Sparkles className="w-4 h-4 text-[#FB6C00]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FB6C00]">
                {metrics.proPasses}
              </div>
              <p className="text-[10px] text-slate-400">€49 Lifetime Enrolled</p>
            </div>

            {/* Total Revenue */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Est. Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                €{metrics.totalRevenue}
              </div>
              <p className="text-[10px] text-slate-400">Based on €49 Pass</p>
            </div>

            {/* Total Questions Solved */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                <span>Questions Solved</span>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                {metrics.totalQuestions}
              </div>
              <p className="text-[10px] text-slate-400">Across all students</p>
            </div>
          </div>

          {/* Search, Filter & CSV Export Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, ইমেইল বা হোয়াটসঅ্যাপ নম্বর দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Membership Filter */}
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('pro')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === 'pro'
                      ? 'bg-white dark:bg-slate-900 text-[#FB6C00] shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Pro ({metrics.proPasses})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('free')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === 'free'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Free ({metrics.total - metrics.proPasses})
                </button>
              </div>

              {/* Add Student Button */}
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>+ Add Student</span>
              </button>

              {/* Export to CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Student Leads Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">WhatsApp / Contact</th>
                    <th className="py-3 px-4">Study Progress</th>
                    <th className="py-3 px-4">Membership</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400">
                        {isLoading ? 'Loading students from Cloud Firestore...' : 'কোনো স্টুডেন্ট পাওয়া যায়নি'}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const cleanPhone = student.phone ? student.phone.replace(/[^0-9+]/g, '') : '';
                      const whatsappUrl = cleanPhone
                        ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                            `Ciao ${student.name || 'Student'}, ti contatto da Patente Bangla Italia per la tua preparazione dell'esame di guida!`
                          )}`
                        : null;

                      return (
                        <tr
                          key={student.email}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                        >
                          {/* Student Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FB6C00] to-amber-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {(student.name || student.email)[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {student.name || 'Unnamed Student'}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* WhatsApp / Phone */}
                          <td className="py-3.5 px-4">
                            {cleanPhone ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                                  {student.phone}
                                </span>
                                {whatsappUrl && (
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1 transition border border-emerald-200 dark:border-emerald-800"
                                    title="Open WhatsApp chat"
                                  >
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>WhatsApp</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No phone</span>
                            )}
                          </td>

                          {/* Progress */}
                          <td className="py-3.5 px-4 space-y-0.5">
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              Round {student.unlockedRound || 1} / 240
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {student.totalQuestionsAnswered || 0} কুইজ সমাধান
                            </div>
                          </td>

                          {/* Membership Status */}
                          <td className="py-3.5 px-4">
                            {student.isVip ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-[#FB6C00] font-black text-[10px] border border-orange-300 dark:border-orange-700/60 shadow-xs">
                                <Sparkles className="w-3 h-3 fill-current text-[#FB6C00]" />
                                <span>PRO VIP (২৪০ রাউন্ড ফ্রি)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                                <span>
                                  {settings.freeRoundsLimit === 0
                                    ? 'পেইড স্টুডেন্ট (০ ফ্রি)'
                                    : `ফ্রি ট্রায়াল (${settings.freeRoundsLimit} রাউন্ড)`}
                                </span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {student.isVip && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenStudentInvoice(student)}
                                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-[11px] transition cursor-pointer border border-blue-200 dark:border-blue-800 flex items-center gap-1 shadow-2xs"
                                  title="Visualizza e Stampa Ricevuta Ufficiale"
                                >
                                  <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  <span>Fattura</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleToggleProPass(student)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer border flex items-center gap-1 ${
                                  student.isVip
                                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                                }`}
                                title={
                                  student.isVip
                                    ? 'VIP এক্সেস প্রত্যাহার করুন'
                                    : 'ঘনিষ্ঠদের জন্য সব ২৪০ রাউন্ড সম্পূর্ণ ফ্রি করে দিন'
                                }
                              >
                                {student.isVip ? (
                                  <span>Revoke VIP</span>
                                ) : (
                                  <>
                                    <span>🎁 সব ২৪০ রাউন্ড ফ্রি (VIP Pass)</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Master Questions Explorer */
        <AdminQuestionExplorer onBackToApp={() => setActiveTab('crm')} />
      )}

      {/* Manual Student Addition Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                নতুন স্টুডেন্ট যোগ করুন (Add Student)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পূর্ণ নাম (Student Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Marco Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল এড্রেস (Email Address) *
                </label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp / ফোন নম্বর (Optional)
                </label>
                <input
                  type="text"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="e.g. +39 328 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVipCheck"
                  checked={newStudentIsVip}
                  onChange={(e) => setNewStudentIsVip(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
                <label htmlFor="isVipCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  একাডেমি Pro VIP Pass (€49 লাইফটাইম এক্সেস)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-md"
                >
                  সেভ করুন (Save Student)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Invoice View & Print Modal */}
      <CourseInvoiceModal
        isOpen={Boolean(viewInvoice)}
        onClose={() => setViewInvoice(null)}
        invoice={viewInvoice}
      />
    </div>
  );
};
