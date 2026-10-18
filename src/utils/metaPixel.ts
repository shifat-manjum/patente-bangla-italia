// src/utils/metaPixel.ts - Meta (Facebook) Pixel Event Tracker

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safely trigger any Meta Pixel custom or standard event
 */
export const trackPixelEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
      console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
    }
  } catch (err) {
    console.warn('[Meta Pixel] Failed to send event:', err);
  }
};

/**
 * Step 1: When student views quiz / free round content
 */
export const trackViewContent = (
  contentName: string = 'Free Quiz Round',
  contentCategory: string = 'Patente B Trial'
) => {
  trackPixelEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
  });
};

/**
 * Step 2: When student registers an account (OTP or Google)
 */
export const trackCompleteRegistration = (
  method: string = 'email_otp',
  status: boolean = true
) => {
  trackPixelEvent('CompleteRegistration', {
    content_name: 'Student Account Registration',
    status: status ? 'success' : 'failed',
    registration_method: method,
  });
};

/**
 * Step 3: When student clicks to join WhatsApp community or requests info
 */
export const trackPixelLead = (
  leadType: string = 'whatsapp_community'
) => {
  trackPixelEvent('Lead', {
    content_name: 'Student Lead',
    content_category: leadType,
  });
};

/**
 * Step 4: When student clicks "Pay Now" / "ভর্তি হন" to initiate checkout
 */
export const trackInitiateCheckout = (
  value: number = 49,
  currency: string = 'EUR',
  contentName: string = 'Patente Bangla Pro Pass'
) => {
  trackPixelEvent('InitiateCheckout', {
    value,
    currency,
    content_name: contentName,
  });
};

/**
 * Step 5: When student successfully completes purchase / unlocks full course
 */
export const trackPixelPurchase = (
  value: number = 49,
  currency: string = 'EUR',
  contentName: string = 'Patente Bangla Pro Pass - 240 Rounds'
) => {
  trackPixelEvent('Purchase', {
    value,
    currency,
    content_name: contentName,
  });
};

// Backwards-compatibility alias
export const trackPurchase = trackPixelPurchase;
