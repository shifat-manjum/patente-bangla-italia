import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

// Minimal client used exclusively for the one-click "Continue with Google" OAuth popup
const googleOAuthConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD2Yr1XIwejliA_25kG5ly-GHlXs9lDJ5s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'patenta-bangla.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'patenta-bangla',
};

let auth: Auth | null = null;

try {
  const app = getApps().length > 0 ? getApp() : initializeApp(googleOAuthConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn('Google OAuth popup initialization notice:', error);
}

export { auth };

