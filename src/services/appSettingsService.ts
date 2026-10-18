// Dynamic Application Policy & Marketing Settings Service (MongoDB Atlas + LocalStorage)

export interface PromoCodeItem {
  code: string; // Uppercase e.g. "FRIEND5", "ITALIA10", "RAKIB10"
  discountEur: number; // Buyer discount in EUR (e.g. 5 or 10, or 0 for tracking only)
  commissionEur: number; // Commission earned by partner/student per paid sale (e.g. 10)
  ownerName: string; // Influencer or student name
  ownerPhone?: string; // WhatsApp / phone of the referrer
  active: boolean;
  usageCount?: number;
  createdAt?: string;
}

export interface AppSettings {
  freeRoundsLimit: number; // e.g. 0 (all paid), 5, 10, 20 (standard), 240 (all free)
  academyPriceEur: number; // e.g. 49
  regularPriceEur?: number; // e.g. 120 (regular price before discount)
  promoBannerText?: string;
  isPromoActive?: boolean;
  promoCodes?: PromoCodeItem[];
  lastUpdated?: string;
}

const SETTINGS_STORAGE_KEY = 'patente_app_settings';
export const SETTINGS_CHANGE_EVENT = 'patente_settings_changed';
export const REFERRAL_STORAGE_KEY = 'patente_referral_code';

export const DEFAULT_PROMO_CODES: PromoCodeItem[] = [
  {
    code: 'FRIEND5',
    discountEur: 5,
    commissionEur: 10,
    ownerName: 'Student Referral Program',
    ownerPhone: '',
    active: true,
    usageCount: 0,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    code: 'ITALIA10',
    discountEur: 10,
    commissionEur: 10,
    ownerName: 'Community Influencer Partner',
    ownerPhone: '',
    active: true,
    usageCount: 0,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
];

export const DEFAULT_APP_SETTINGS: AppSettings = {
  freeRoundsLimit: 20,
  academyPriceEur: 49,
  regularPriceEur: 120,
  promoBannerText: 'অফিসিয়াল ইতালিয়ান লাইসেন্স প্রস্তুতি • প্রথম প্রচেষ্টায় পাশের গ্যারান্টি',
  isPromoActive: false,
  promoCodes: DEFAULT_PROMO_CODES,
};

/**
 * Generate a clean, deterministic personal referral code for any registered student
 */
export const getStudentReferralCode = (nameOrEmail?: string): string => {
  if (!nameOrEmail) return 'REF-STUDENT';
  const clean = nameOrEmail
    .split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 8);
  return `REF-${clean || 'STUDENT'}`;
};

/**
 * Validate a promo or student referral code and return discount & partner details
 */
export const validatePromoCode = (
  rawCode: string,
  settings?: AppSettings
): PromoCodeItem | null => {
  const clean = (rawCode || '').trim().toUpperCase();
  if (!clean) return null;

  const activeSettings = settings || getAppSettings();
  const list = Array.isArray(activeSettings.promoCodes) && activeSettings.promoCodes.length > 0
    ? activeSettings.promoCodes
    : DEFAULT_PROMO_CODES;

  const matched = list.find((item) => item.code.toUpperCase() === clean && item.active);
  if (matched) {
    return matched;
  }

  // Also automatically honor any student personal referral code (REF-XXXX)
  if (clean.startsWith('REF-') && clean.length >= 6) {
    const studentTag = clean.slice(4);
    return {
      code: clean,
      discountEur: 5,
      commissionEur: 10,
      ownerName: `Student Referrer (${studentTag})`,
      active: true,
    };
  }

  return null;
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
          academyPriceEur: Number.isFinite(parsed.academyPriceEur) && parsed.academyPriceEur > 0
            ? parsed.academyPriceEur
            : DEFAULT_APP_SETTINGS.academyPriceEur,
          regularPriceEur: Number.isFinite(parsed.regularPriceEur) && parsed.regularPriceEur > 0
            ? parsed.regularPriceEur
            : DEFAULT_APP_SETTINGS.regularPriceEur,
          promoCodes: Array.isArray(parsed.promoCodes) && parsed.promoCodes.length > 0
            ? parsed.promoCodes
            : DEFAULT_PROMO_CODES,
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
 * Save settings locally, dispatch real-time UI event, and sync to MongoDB Server
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
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // 2. Dispatch real-time event so all components across the app update immediately (0ms)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: merged }));
  }

  // 3. Non-blocking network sync with a strict 1.8-second timeout
  const syncPromises: Promise<any>[] = [];

  if (typeof window !== 'undefined') {
    const apiPromise = fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    }).catch((err) => {
      console.warn('Server API settings sync notice:', err);
    });
    syncPromises.push(apiPromise);
  }

  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1800));
  await Promise.race([Promise.allSettled(syncPromises), timeoutPromise]);

  return merged;
};

/**
 * Fetch latest settings with smart timestamp conflict resolution
 */
export const fetchRemoteAppSettings = async (): Promise<AppSettings> => {
  const local = getAppSettings();
  const localTime = local.lastUpdated ? new Date(local.lastUpdated).getTime() : 0;

  let remoteSettings: AppSettings | null = null;

  // 1. Fetch from Server API (MongoDB Atlas) with 2.5-second timeout
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('/api/settings', { signal: controller.signal });
    clearTimeout(timer);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && (typeof data.freeRoundsLimit === 'number' || typeof data.academyPriceEur === 'number')) {
        remoteSettings = data;
      }
    }
  } catch (err) {
    console.warn('Settings API fetch notice:', err);
  }

  // 3. Smart Conflict Resolution based on timestamps
  if (remoteSettings) {
    const remoteTime = remoteSettings.lastUpdated ? new Date(remoteSettings.lastUpdated).getTime() : 0;

    // Only adopt remote if it is genuinely NEWER than local
    if (remoteTime > localTime) {
      const merged: AppSettings = {
        ...local,
        ...remoteSettings,
        freeRoundsLimit: typeof remoteSettings.freeRoundsLimit === 'number' && remoteSettings.freeRoundsLimit >= 0
          ? Math.min(240, Math.max(0, remoteSettings.freeRoundsLimit))
          : local.freeRoundsLimit,
        academyPriceEur: typeof remoteSettings.academyPriceEur === 'number' && remoteSettings.academyPriceEur > 0
          ? remoteSettings.academyPriceEur
          : local.academyPriceEur,
        regularPriceEur: typeof remoteSettings.regularPriceEur === 'number' && remoteSettings.regularPriceEur > 0
          ? remoteSettings.regularPriceEur
          : local.regularPriceEur,
        promoCodes: Array.isArray(remoteSettings.promoCodes) && remoteSettings.promoCodes.length > 0
          ? remoteSettings.promoCodes
          : local.promoCodes || DEFAULT_PROMO_CODES,
      };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem('patente_free_rounds_limit', String(merged.freeRoundsLimit));
      } catch {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: merged }));
      }
      return merged;
    } else if (localTime > remoteTime && localTime > 0) {
      // Local has newer changes that were not yet synced to remote -> push local to remote in background
      saveAppSettings(local).catch(() => {});
      return local;
    }
  }

  return local;
};
