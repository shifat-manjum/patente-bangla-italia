import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  unlockedRound: number;
  totalQuestionsAnswered: number;
  completedRounds: Record<number, { errors: number; passed: boolean }>;
  mistakeIds: string[];
  isVip: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

const LOCAL_STORAGE_KEY = 'patente_student_user';
const LOCAL_STUDENTS_LIST_KEY = 'patente_registered_students';

// Helper to get local mock user
export const getCachedStudent = (): StudentProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Register a new student
export const registerStudent = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<StudentProfile> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  // If Firebase is configured with valid credentials, use Firebase Auth + Firestore!
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: cleanName });

      // Save initial student progress in Cloud Firestore
      const newProfile: StudentProfile = {
        uid: firebaseUser.uid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        unlockedRound: 1,
        totalQuestionsAnswered: 0,
        completedRounds: {},
        mistakeIds: [],
        isVip: false,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'students', firebaseUser.uid), newProfile);

      // Cache locally and permanently log to registered students directory
      const clientProfile = {
        ...newProfile,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clientProfile));
        const all = JSON.parse(localStorage.getItem(LOCAL_STUDENTS_LIST_KEY) || '[]');
        const filtered = all.filter((s: any) => s.email?.toLowerCase() !== cleanEmail);
        filtered.unshift(clientProfile);
        localStorage.setItem(LOCAL_STUDENTS_LIST_KEY, JSON.stringify(filtered));
      } catch (storageErr) {
        console.warn('Local student list update error:', storageErr);
      }

      return newProfile;
    } catch (err: any) {
      console.error('Firebase registration error:', err);
      throw err;
    }
  }

  // Graceful local-first fallback if Firebase credentials are not yet entered
  const fallbackProfile: StudentProfile = {
    uid: 'std_' + Date.now(),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone || undefined,
    unlockedRound: 1,
    totalQuestionsAnswered: 0,
    completedRounds: {},
    mistakeIds: [],
    isVip: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProfile));
    const all = JSON.parse(localStorage.getItem(LOCAL_STUDENTS_LIST_KEY) || '[]');
    all.push(fallbackProfile);
    localStorage.setItem(LOCAL_STUDENTS_LIST_KEY, JSON.stringify(all));
  } catch {}

  return fallbackProfile;
};

// Login an existing student
export const loginStudent = async (
  email: string,
  password: string
): Promise<StudentProfile> => {
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      // Fetch student document from Firestore
      const studentDocRef = doc(db, 'students', firebaseUser.uid);
      const studentDocSnap = await getDoc(studentDocRef);

      let profile: StudentProfile;

      if (studentDocSnap.exists()) {
        profile = studentDocSnap.data() as StudentProfile;
        // Update last login timestamp
        await updateDoc(studentDocRef, {
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Fallback document if not found in Firestore
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          unlockedRound: 1,
          totalQuestionsAnswered: 0,
          completedRounds: {},
          mistakeIds: [],
          isVip: false,
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(studentDocRef, profile);
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.error('Firebase login error:', err);
      throw err;
    }
  }

  // Local-first fallback login
  let existingProfile: StudentProfile | null = null;
  try {
    const all: StudentProfile[] = JSON.parse(localStorage.getItem(LOCAL_STUDENTS_LIST_KEY) || '[]');
    existingProfile = all.find((s) => s.email === cleanEmail) || null;
  } catch {}

  const localProfile: StudentProfile = existingProfile || {
    uid: 'std_' + Date.now(),
    name: cleanEmail.split('@')[0],
    email: cleanEmail,
    unlockedRound: 1,
    totalQuestionsAnswered: 0,
    completedRounds: {},
    mistakeIds: [],
    isVip: false,
    lastLoginAt: new Date().toISOString(),
  };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProfile));
  return localProfile;
};

// Log out student
export const logoutStudent = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
};

// Sync student progress to Cloud Firestore
export const syncStudentProgressToCloud = async (
  uid: string,
  progress: Partial<StudentProfile>
): Promise<void> => {
  // Update local storage first
  try {
    const current = getCachedStudent();
    if (current && current.uid === uid) {
      const updated = { ...current, ...progress };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {}

  // Update in Cloud Firestore if configured
  if (isFirebaseConfigured && db && uid) {
    try {
      const docRef = doc(db, 'students', uid);
      await updateDoc(docRef, {
        ...progress,
        lastUpdated: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore sync error:', err);
    }
  }
};

// Subscribe to real-time auth changes
export const subscribeToAuthChanges = (
  callback: (student: StudentProfile | null) => void
): (() => void) => {
  if (isFirebaseConfigured && auth && db) {
    const currentDb = db;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && currentDb) {
        try {
          const studentDocSnap = await getDoc(doc(currentDb, 'students', firebaseUser.uid));
          if (studentDocSnap.exists()) {
            const data = studentDocSnap.data() as StudentProfile;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            callback(data);
            return;
          }
        } catch (err) {
          console.warn('Error fetching Firestore student on auth change:', err);
        }

        // Default user if no doc yet
        const defaultProfile: StudentProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
          email: firebaseUser.email || '',
          unlockedRound: 1,
          totalQuestionsAnswered: 0,
          completedRounds: {},
          mistakeIds: [],
          isVip: false,
        };
        callback(defaultProfile);
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }

  // If Firebase not configured, return cached student once
  const cached = getCachedStudent();
  callback(cached);
  return () => {};
};
