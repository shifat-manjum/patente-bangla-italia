import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

function getStripeSecretKey() {
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY.trim();
  }

  // Gracefully fallback to local .env in development
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/STRIPE_SECRET_KEY\s*=\s*([^\s\r\n]+)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch {}

  return '';
}

export function getStripe() {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
  }
  return new Stripe(secretKey);
}
