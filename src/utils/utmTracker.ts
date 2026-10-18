// src/utils/utmTracker.ts - Marketing Campaign & UTM Attribution Tracker

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  first_seen?: string;
}

const UTM_STORAGE_KEY = 'patente_utm_params';
const UTM_SESSION_KEY = 'patente_utm_session';

/**
 * Capture URL parameters on landing and persist in session & local storage
 */
export const captureAndStoreUtm = (): UtmParams => {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source');
    const medium = urlParams.get('utm_medium');
    const campaign = urlParams.get('utm_campaign');
    const term = urlParams.get('utm_term');
    const content = urlParams.get('utm_content');
    const fbclid = urlParams.get('fbclid');
    const gclid = urlParams.get('gclid');

    // Only update if there are campaign parameters in URL
    if (source || medium || campaign || fbclid || gclid) {
      const detected: UtmParams = {
        utm_source: source || (fbclid ? 'facebook' : gclid ? 'google' : 'unknown'),
        utm_medium: medium || (fbclid ? 'cpc_social' : gclid ? 'cpc' : 'social'),
        utm_campaign: campaign || (fbclid ? 'facebook_ad' : 'direct_campaign'),
        utm_term: term || undefined,
        utm_content: content || undefined,
        fbclid: fbclid || undefined,
        gclid: gclid || undefined,
        referrer: document.referrer || 'direct',
        landing_page: window.location.pathname + window.location.search,
        first_seen: new Date().toISOString(),
      };

      // Store in sessionStorage (current visit) and localStorage (lifetime attribution)
      sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(detected));
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(detected));

      // Push to Google Analytics user properties
      if (typeof window.gtag === 'function') {
        window.gtag('set', 'user_properties', {
          campaign_source: detected.utm_source,
          campaign_name: detected.utm_campaign,
          campaign_medium: detected.utm_medium,
        });
      }

      return detected;
    }

    // Fallback to existing session or stored attribution
    const existingSession = sessionStorage.getItem(UTM_SESSION_KEY);
    if (existingSession) {
      return JSON.parse(existingSession);
    }

    const existingLocal = localStorage.getItem(UTM_STORAGE_KEY);
    if (existingLocal) {
      return JSON.parse(existingLocal);
    }
  } catch (err) {
    console.debug('[UTM Tracker] Attribution notice:', err);
  }

  return {};
};

/**
 * Get active stored UTM parameters
 */
export const getStoredUtmParams = (): UtmParams => {
  if (typeof window === 'undefined') return {};
  try {
    const session = sessionStorage.getItem(UTM_SESSION_KEY);
    if (session) return JSON.parse(session);

    const local = localStorage.getItem(UTM_STORAGE_KEY);
    if (local) return JSON.parse(local);
  } catch {}
  return {};
};

/**
 * Return formatted parameters ready for GA4 / Meta Pixel event payloads
 */
export const getUtmEventPayload = (): Record<string, string> => {
  const params = getStoredUtmParams();
  const payload: Record<string, string> = {};

  if (params.utm_source) payload.campaign_source = params.utm_source;
  if (params.utm_medium) payload.campaign_medium = params.utm_medium;
  if (params.utm_campaign) payload.campaign_name = params.utm_campaign;
  if (params.utm_content) payload.campaign_content = params.utm_content;
  if (params.fbclid) payload.fbclid = params.fbclid;

  return payload;
};

