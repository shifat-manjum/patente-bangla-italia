// Dynamic Application Policy & Marketing Settings Service
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export interface AppSettings {
  freeRoundsLimit: number; // e.g. 0 (all paid), 5, 10, 20 (standard), 240 (all free)
  academyPriceEur: number;
  promoBannerText?: string;
  isPromoActive?: boolean;
  lastUpdated?: string;
}

const SETTINGS_STORAGE_KEY = 'patente_app_settings';
export const SETTINGS_CHANGE_EVENT = 'patente_settings_changed';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  freeRoundsLimit: 20,
  academyPriceEur: 49,
  promoBannerText: 'অফিসিয়াল ইতালিয়ান লাইসেন্স প্রস্তুতি • প্রথম প্রচেষ্টায় পাশের গ্যারান্টি',
  isPromoActive: false,
};

/**
 * Returns current application settings synchronously from local storage with fallback
 */
export const getAppSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          ...DEFAULT_APP_SETTINGS,
          ...parsed,
          freeRoundsLimit: Number.isFinite(parsed.freeRoundsLimit) && parsed.freeRoundsLimit >= 0
            ? Math.min(240, Math.max(0, parsed.freeRoundsLimit))
            : DEFAULT_APP_SETTINGS.freeRoundsLimit,
        };
      }
    }
  } catch {}

  // Fallback to legacy single key if present
  try {
    const legacyLimit = localStorage.getItem('patente_free_rounds_limit');
    if (legacyLimit !== null) {
      const num = parseInt(legacyLimit, 10);
      if (Number.isFinite(num) && num >= 0) {
        return {
          ...DEFAULT_APP_SETTINGS,
          freeRoundsLimit: Math.min(240, Math.max(0, num)),
        };
      }
    }
  } catch {}

  return DEFAULT_APP_SETTINGS;
};

/**
 * Save settings locally, dispatch real-time UI event, and sync to Cloud & Server
 */
export const saveAppSettings = async (newSettings: Partial<AppSettings>): Promise<AppSettings> => {
  const current = getAppSettings();
  const merged: AppSettings = {
    ...current,
    ...newSettings,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Save to LocalStorage immediately
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem('patente_free_rounds_limit', String(merged.freeRoundsLimit));
  } catch {}

  // 2. Dispatch real-time event so all components update in real-time
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: merged }));
  }

  // 3. Sync to Cloud Firestore if connected
  if (isFirebaseConfigured && db) {
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, merged, { merge: true });
    } catch (err) {
      console.warn('Firestore settings sync notice:', err);
    }
  }

  // 4. Sync to Server JSON DB if available
  try {
    if (typeof window !== 'undefined') {
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      }).catch(() => {});
    }
  } catch {}

  return merged;
};

/**
 * Fetch latest settings from Cloud Firestore and local server
 */
export const fetchRemoteAppSettings = async (): Promise<AppSettings> => {
  // Try Firestore
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) {
        const data = snap.data() as AppSettings;
        if (data && typeof data.freeRoundsLimit === 'number') {
          saveAppSettings(data);
          return data;
        }
      }
    } catch {}
  }

  // Try server API (MongoDB Atlas)
  try {
    const res = await fetch('/api/settings');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && typeof data.freeRoundsLimit === 'number') {
        saveAppSettings(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Settings API fetch notice:', err);
  }

  return getAppSettings();
};

