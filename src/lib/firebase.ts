import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD2Yr1XIwejliA_25kG5ly-GHlXs9lDJ5s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'patenta-bangla.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'patenta-bangla',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'patenta-bangla.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '873900415744',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:873900415744:web:306ac0261281a1a9e531e5',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-5W892DWMHR',
};

export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.startsWith('AIzaSy') &&
  firebaseConfig.projectId === 'patenta-bangla'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Initialize Analytics in supported browser environments
  if (typeof window !== 'undefined') {
    isSupported().then((yes) => {
      if (yes && app) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

export { app, auth, db, analytics };
