import { getStripe } from './_stripe.js';
import { getCollection } from './_db.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const raw = Buffer.concat(buffers).toString();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
}

// Multi-Tier Subscription Plans
const PLAN_CONFIGS = {
  '1_month': {
    id: '1_month',
    name: 'PatenteGuru - Abbonamento 1 Mese (€11)',
    nameBn: '১ মাস মেয়াদী প্ল্যান',
    priceEur: 11,
    durationDays: 30,
    description:
      'Accesso completo a tutti i 240 Round con traduzioni e spiegazioni in Bengali per 30 giorni.',
  },
  '3_months': {
    id: '3_months',
    name: 'PatenteGuru - Abbonamento 3 Mesi (€30) [Più Popolare]',
    nameBn: '৩ মাস মেয়াদী প্ল্যান (সবচেয়ে জনপ্রিয়)',
    priceEur: 30,
    durationDays: 90,
    description:
      'Accesso completo a tutti i 240 Round con traduzioni e spiegazioni in Bengali per 90 giorni.',
  },
  'lifetime': {
    id: 'lifetime',
    name: 'PatenteGuru - Accesso Illimitato Lifetime (€44) [Fino alla Patente]',
    nameBn: 'লাইফটাইম প্ল্যান (পাস না করা পর্যন্ত)',
    priceEur: 44,
    durationDays: null,
    description:
      'Accesso illimitato senza scadenza a tutti i 240 Round fino al conseguimento della Patente B.',
  },
};

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const stripe = await getStripe();
    const body = await parseBody(req);
    if (!body) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    const {
      studentName = 'Studente Patente B',
      studentEmail,
      studentPhone = '',
      codiceFiscale = '',
      address = '',
      city = 'Bolzano',
      promoCode = '',
      planId = '3_months',
    } = body;

    if (!studentEmail || !studentEmail.includes('@')) {
      return res.status(400).json({ error: 'Valid student email is required' });
    }

    // Determine target plan
    let selectedPlan = PLAN_CONFIGS[planId];
    if (!selectedPlan) {
      if (typeof body.priceEur === 'number') {
        if (body.priceEur <= 15) selectedPlan = PLAN_CONFIGS['1_month'];
        else if (body.priceEur <= 35) selectedPlan = PLAN_CONFIGS['3_months'];
        else selectedPlan = PLAN_CONFIGS['lifetime'];
      } else {
        selectedPlan = PLAN_CONFIGS['3_months']; // Default to most popular
      }
    }

    let basePriceEur = selectedPlan.priceEur;

    // Optional override from MongoDB settings if defined
    let settingsPromoCodes = [];
    try {
      const settingsCol = await getCollection('settings');
      const settingsDoc = await settingsCol.findOne({ key: 'app_settings' });
      if (settingsDoc && Array.isArray(settingsDoc.promoCodes)) {
        settingsPromoCodes = settingsDoc.promoCodes;
      }
    } catch (e) {
      console.warn('Could not read settings from DB:', e);
    }

    // Validate Promo / Referral Code
    const cleanPromoCode = String(promoCode || '').trim().toUpperCase();
    let appliedCode = '';
    let discountEur = 0;
    let referrerName = '';

    if (cleanPromoCode) {
      const defaultPromos = [
        { code: 'FRIEND5', discountEur: 5, ownerName: 'Student Referral Program', active: true },
        { code: 'ITALIA10', discountEur: 10, ownerName: 'Community Influencer Partner', active: true },
      ];
      const promoList = settingsPromoCodes.length > 0 ? settingsPromoCodes : defaultPromos;
      const matched = promoList.find(
        (p) => String(p.code || '').toUpperCase() === cleanPromoCode && p.active !== false
      );

      if (matched) {
        appliedCode = cleanPromoCode;
        discountEur = Number(matched.discountEur) > 0 ? Number(matched.discountEur) : 0;
        referrerName = matched.ownerName || '';
      } else if (cleanPromoCode.startsWith('REF-') && cleanPromoCode.length >= 6) {
        appliedCode = cleanPromoCode;
        discountEur = 5;
        referrerName = `Student (${cleanPromoCode.slice(4)})`;
      }
    }

    // Minimum price is €5 after discount
    const priceEur = Math.max(5, basePriceEur - discountEur);

    // Determine origin for redirection
    const host = req.headers.host || '';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const origin =
      req.headers.origin ||
      (host ? `${protocol}://${host}` : null) ||
      'https://www.patenteguru.it';

    const baseSessionParams = {
      mode: 'payment',
      customer_email: studentEmail.trim().toLowerCase(),
      client_reference_id: studentEmail.trim().toLowerCase(),
      branding_settings: {
        display_name: 'PatenteGuru Italia',
        background_color: '#0D1117',
        button_color: '#0284c7',
        border_style: 'rounded',
      },
      custom_text: {
        submit: {
          message:
            `Attivazione immediata ${selectedPlan.nameBn} (Tutti i 240 Round + 7.165 Quiz) + Ricevuta Ufficiale.`,
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(priceEur * 100),
            product_data: {
              name: appliedCode
                ? `${selectedPlan.name} (Promo: ${appliedCode})`
                : selectedPlan.name,
              description: selectedPlan.description,
              images: ['https://patente-bangla-italia.vercel.app/car-logo.png'],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim().toLowerCase(),
        studentPhone: studentPhone.trim(),
        codiceFiscale: (codiceFiscale || '').trim().toUpperCase(),
        address: address.trim(),
        city: city.trim(),
        planId: selectedPlan.id,
        planName: selectedPlan.nameBn,
        durationDays: selectedPlan.durationDays ? String(selectedPlan.durationDays) : 'lifetime',
        amount: String(priceEur),
        promoCode: appliedCode,
        discountEur: String(discountEur),
        referrerName,
      },
      success_url: `${origin}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment_cancelled=true`,
    };

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        ...baseSessionParams,
        branding_settings: {
          ...baseSessionParams.branding_settings,
          icon: {
            type: 'file',
            file: 'file_1UPPLw0lRuQcN4CldLir3C5Z',
          },
        },
      });
    } catch {
      session = await stripe.checkout.sessions.create(baseSessionParams);
    }

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      planId: selectedPlan.id,
      priceEur,
    });
  } catch (err) {
    console.error('Stripe session creation error:', err);
    return res.status(500).json({ error: err.message || 'Payment session creation failed' });
  }
}
