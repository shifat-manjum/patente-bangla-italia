// Google Analytics 4 (GA4) & Event Tracking Service
// Measurement ID: G-5W892DWMHR

import { getUtmEventPayload } from '../utils/utmTracker';
import { trackPixelPageView } from '../utils/metaPixel';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-5W892DWMHR';

/**
 * Safe wrapper for sending gtag events with automatic UTM campaign attribution
 */
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, string | number | boolean | undefined | any> = {}
) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const utmParams = getUtmEventPayload();
      const enrichedParams = {
        ...utmParams,
        ...eventParams,
      };
      window.gtag('event', eventName, enrichedParams);
      console.log(`[GA4 Track] ${eventName}:`, enrichedParams);
    }
  } catch (err) {
    console.debug('Analytics trackEvent notice:', err);
  }
};

/**
 * Track navigation page or tab views with descriptive page title & clean path
 */
export const trackPageView = (pageTitle: string, path: string = window.location.pathname) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const utmParams = getUtmEventPayload();
      // Update GA4 session state for current route
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: path,
        ...utmParams,
      });
      console.log(`[GA4 PageView] "${pageTitle}" -> ${path}`);
    }
    // Also track in Meta Pixel for every tab/route change
    trackPixelPageView(pageTitle, path);
  } catch (err) {
    console.debug('Analytics trackPageView notice:', err);
  }
};

/**
 * KEY EVENT: Track student registration / signup
 */
export const trackStudentRegistration = (method: 'email_otp' | 'google' | 'mongodb' | 'local' = 'email_otp') => {
  trackEvent('sign_up', {
    method,
  });
};

/**
 * KEY EVENT: Track student login
 */
export const trackStudentLogin = (method: 'email' | 'google' | string = 'email') => {
  trackEvent('login', {
    method,
  });
};

/**
 * KEY EVENT: Track begin checkout / initiate enrollment payment
 */
export const trackPaymentStart = (roundId: number = 21, amountEur: number = 49) => {
  trackEvent('begin_checkout', {
    value: amountEur,
    currency: 'EUR',
    attempted_round: roundId,
    items: [
      {
        item_id: 'patente_pro_pass',
        item_name: 'Patente Bangla Pro Pass - 240 Rounds',
        price: amountEur,
        quantity: 1,
      },
    ],
  });
};

/**
 * KEY EVENT: Track successful purchase / Pro pass activation
 */
export const trackPurchase = (
  amountEur: number = 49,
  transactionId?: string,
  roundId: number = 240
) => {
  trackEvent('purchase', {
    transaction_id: transactionId || `txn_${Date.now()}`,
    value: amountEur,
    currency: 'EUR',
    items: [
      {
        item_id: 'patente_pro_pass',
        item_name: 'Patente Bangla Pro Pass - 240 Rounds',
        price: amountEur,
        quantity: 1,
      },
    ],
    unlocked_round: roundId,
  });
};

/**
 * KEY EVENT: Track lead capture (e.g. WhatsApp community join)
 */
export const trackLead = (source: string = 'general') => {
  trackEvent('generate_lead', {
    lead_source: source,
  });
};

/**
 * Track WhatsApp student group join click
 */
export const trackWhatsAppJoin = (source: string = 'registration_modal') => {
  trackEvent('whatsapp_group_join', {
    source,
    group_link: 'https://chat.whatsapp.com/ByoJ9BxIbRvF7Bu5LykErV?mode=gi_t',
  });
  trackLead(`whatsapp_${source}`);
};

/**
 * Track when a user starts an exam or round
 */
export const trackExamStart = (roundId?: number) => {
  trackEvent('exam_start', {
    round_id: roundId || 'mock_test',
    type: roundId ? 'curriculum_round' : 'standard_simulation',
  });
};

/**
 * Track exam completion and score
 */
export const trackExamSubmit = (
  roundId: number | undefined,
  score: number,
  passed: boolean,
  errors: number
) => {
  trackEvent('exam_complete', {
    round_id: roundId || 'mock_test',
    score_percentage: score,
    passed,
    error_count: errors,
  });
};

/**
 * Track theme change (Dark, Light, Sepia)
 */
export const trackThemeChange = (themeName: string) => {
  trackEvent('theme_change', {
    theme: themeName,
  });
};

/**
 * Track when audio pronunciation is played
 */
export const trackAudioPlay = (questionId?: string) => {
  trackEvent('audio_play', {
    question_id: questionId || 'unknown',
  });
};
