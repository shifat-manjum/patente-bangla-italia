import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { getCollection } from './_db.js';

let cachedStripeKey = '';

async function getStripeSecretKey() {
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY.trim();
  }

  if (cachedStripeKey) {
    return cachedStripeKey;
  }

  // Gracefully fallback to local .env in development
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/STRIPE_SECRET_KEY\s*=\s*([^\s\r\n]+)/);
      if (match && match[1]) {
        cachedStripeKey = match[1].trim();
        return cachedStripeKey;
      }
    }
  } catch {}

  // Fallback to MongoDB Atlas settings
  try {
    const settingsCol = await getCollection('settings');
    const doc = await settingsCol.findOne({ key: 'app_settings' });
    if (doc?.stripeSecretKey) {
      cachedStripeKey = doc.stripeSecretKey.trim();
      return cachedStripeKey;
    }
  } catch (err) {
    console.warn('Could not read stripeSecretKey from MongoDB settings:', err.message);
  }

  return '';
}

export async function getStripe() {
  const secretKey = await getStripeSecretKey();
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured in environment variables or database');
  }
  return new Stripe(secretKey);
}

