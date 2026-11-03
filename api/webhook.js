// api/webhook.js - Real-time Stripe Webhook listener for guaranteed VIP unlocking
import { getStripe, getStripeWebhookSecret } from './_stripe.js';
import { getCollection } from './_db.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, stripe-signature'
  );
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // 1. Read raw stream body for Stripe signature validation
  const chunks = [];
  try {
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
  } catch (err) {
    return res.status(400).send(`Stream read error: ${err.message}`);
  }
  const rawBody = Buffer.concat(chunks);

  let event;
  try {
    const stripe = await getStripe();
    const webhookSecret = await getStripeWebhookSecret();
    const signature = req.headers['stripe-signature'];

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // Fallback if webhook secret is not set yet in test/dev
      event = JSON.parse(rawBody.toString('utf8'));
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle completed checkout sessions
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status === 'paid') {
      const meta = session.metadata || {};
      const studentEmail = (meta.studentEmail || session.customer_email || '').trim().toLowerCase();
      const studentName = meta.studentName || session.customer_details?.name || 'Studente Patente B';
      const studentPhone = meta.studentPhone || session.customer_details?.phone || '';
      const codiceFiscale = meta.codiceFiscale || 'REGOLARE';
      const address = meta.address || 'Italia';
      const city = meta.city || 'Bolzano';
      const amount = session.amount_total ? session.amount_total / 100 : 30.0;
      const transactionId = String(session.payment_intent || session.id);
      const promoCode = (meta.promoCode || '').trim().toUpperCase();
      const discountEur = Number(meta.discountEur) > 0 ? Number(meta.discountEur) : 0;
      const referrerName = meta.referrerName || '';

      // Plan determination
      let planId = meta.planId;
      if (!planId) {
        if (amount <= 15) planId = '1_month';
        else if (amount <= 35) planId = '3_months';
        else planId = 'lifetime';
      }

      let durationDays = null;
      if (meta.durationDays && meta.durationDays !== 'lifetime') {
        durationDays = Number(meta.durationDays) || null;
      } else if (planId === '1_month') {
        durationDays = 30;
      } else if (planId === '3_months') {
        durationDays = 90;
      }

      const now = new Date();
      let vipExpiresAt = null;
      if (durationDays && durationDays > 0) {
        const exp = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
        vipExpiresAt = exp.toISOString();
      }

      const invoiceNumber = `PG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const formattedDate = now.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const courseDescription =
        planId === '1_month'
          ? 'Corso Patente B 2026 - Abbonamento 1 Mese (30 Giorni) a tutti i 240 Round con traduzioni in Bengali e simulatore.'
          : planId === '3_months'
          ? 'Corso Patente B 2026 - Abbonamento 3 Mesi (90 Giorni) a tutti i 240 Round con traduzioni in Bengali e simulatore.'
          : 'Corso Completo Ufficiale Patente B 2026 - Accesso Illimitato Lifetime a tutti i 240 Round con spiegazioni in Bengali, Simulatore Orale e Assistenza Didattica.';

      const invoice = {
        id: invoiceNumber,
        date: now.toISOString(),
        formattedDate,
        studentName,
        studentEmail,
        studentPhone,
        codiceFiscale,
        address,
        city,
        amount,
        currency: 'EUR',
        planId,
        vipExpiresAt,
        ...(promoCode ? { promoCode, discountEur, referrerName } : {}),
        taxExemptionNote:
          "Operazione didattico-formativa esente da IVA ai sensi dell'art. 10, comma 1, n. 20 del D.P.R. 633/1972.",
        paymentMethod: 'card',
        paymentMethodLabel: 'Stripe Webhook (Carta / PostePay / Apple Pay)',
        transactionId,
        status: 'PAGATO',
        courseDescription,
        issuer: {
          name: 'PatenteGuru.it / Patente Bangla Italia',
          brand: 'PatenteGuru Autoscuola Digitale',
          instructor: 'Shifat Manjum (Founder & Lead Instructor)',
          location: 'Bolzano (BZ), Trentino-Alto Adige, Italia',
          email: 'khshifat@gmail.com',
          website: 'https://patenteguru.it',
        },
      };

      // A. Unlock VIP in MongoDB Atlas (guaranteed even if student closed browser)
      if (studentEmail) {
        try {
          const studentsCol = await getCollection('students');
          await studentsCol.updateOne(
            { email: studentEmail },
            {
              $set: {
                name: studentName,
                phone: studentPhone || undefined,
                isVip: true,
                vipPlan: planId,
                vipExpiresAt,
                vipUnlockedAt: now.toISOString(),
                transactionId,
                updatedAt: now.toISOString(),
              },
              $setOnInsert: {
                uid: 'std_' + Date.now(),
                email: studentEmail,
                unlockedRound: 1,
                totalQuestionsAnswered: 0,
                completedRounds: {},
                mistakeIds: [],
                createdAt: now.toISOString(),
              },
            },
            { upsert: true }
          );
          console.log(`[Webhook] Student ${studentEmail} unlocked as VIP with plan ${planId}.`);
        } catch (dbErr) {
          console.error('[Webhook] Failed to update student in MongoDB Atlas:', dbErr);
        }
      }

      // B. Save official invoice in MongoDB Atlas
      try {
        const invoicesCol = await getCollection('invoices');
        await invoicesCol.updateOne(
          { transactionId },
          { $set: invoice },
          { upsert: true }
        );
        console.log(`[Webhook] Invoice ${invoiceNumber} created for ${studentEmail}.`);
      } catch (invErr) {
        console.error('[Webhook] Failed to save invoice in MongoDB Atlas:', invErr);
      }
    }
  }

  return res.status(200).json({ received: true });
}
