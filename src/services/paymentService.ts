export type PaymentMethodType = 'card' | 'postepay' | 'paypal' | 'applepay' | 'bonifico';

export type SubscriptionPlanId = '1_month' | '3_months' | 'lifetime';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  nameBn: string;
  durationLabelBn: string;
  badgeNumberBn: string;
  badgeUnitBn: string;
  priceEur: number;
  regularPriceEur: number;
  monthlyRateBn: string;
  isPopular?: boolean;
  popularBadgeBn?: string;
  durationDays: number | null;
  descriptionBn: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: '1_month',
    nameBn: '১ মাস মেয়াদী প্ল্যান',
    durationLabelBn: '১ মাস মেয়াদী এক্সেস',
    badgeNumberBn: '১',
    badgeUnitBn: 'মাস',
    priceEur: 11,
    regularPriceEur: 15,
    monthlyRateBn: '€১১ / মাস',
    isPopular: false,
    durationDays: 30,
    descriptionBn: '৩০ দিনের জন্য ২৪০টি রাউন্ড ও সম্পূর্ণ কোর্স',
  },
  {
    id: '3_months',
    nameBn: '৩ মাস মেয়াদী প্ল্যান',
    durationLabelBn: '৩ মাস মেয়াদী এক্সেস',
    badgeNumberBn: '৩',
    badgeUnitBn: 'মাস',
    priceEur: 30,
    regularPriceEur: 45,
    monthlyRateBn: '€১০ / মাস',
    isPopular: true,
    popularBadgeBn: 'সবচেয়ে জনপ্রিয়',
    durationDays: 90,
    descriptionBn: '৯০ দিনের জন্য ২৪০টি রাউন্ড ও সম্পূর্ণ কোর্স (সর্বাধিক জনপ্রিয়)',
  },
  {
    id: 'lifetime',
    nameBn: 'লাইফটাইম প্ল্যান (Fino alla Patente)',
    durationLabelBn: 'লাইসেন্স পাওয়ার আগ পর্যন্ত আনলিমিটেড',
    badgeNumberBn: 'লাইফ',
    badgeUnitBn: 'টাইম',
    priceEur: 44,
    regularPriceEur: 99,
    monthlyRateBn: 'এককালীন পেমেন্ট • পাশ না করা পর্যন্ত',
    isPopular: false,
    durationDays: null,
    descriptionBn: 'পাস করার আগ পর্যন্ত আজীবন আনলিমিটেড এক্সেস',
  },
];

export interface InvoiceRecord {
  id: string; // e.g. "PG-2026-84729"
  date: string; // ISO string
  formattedDate: string; // e.g. "24/09/2026, 21:40"
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  codiceFiscale: string; // Italian Codice Fiscale
  address?: string;
  city?: string;
  amount: number; // e.g. 11, 30, 44
  currency: string; // "EUR"
  planId?: SubscriptionPlanId;
  vipExpiresAt?: string | null;
  taxExemptionNote: string;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  transactionId: string;
  status: 'PAGATO';
  courseDescription: string;
  issuer: {
    name: string;
    brand: string;
    instructor: string;
    location: string;
    email: string;
    website: string;
  };
}

export interface PaymentFormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  codiceFiscale: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethodType;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

const INVOICES_STORAGE_KEY = 'patente_student_invoices';

export const generateInvoiceNumber = (): string => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `PG-2026-${randomSuffix}`;
};

export const generateTransactionId = (method: PaymentMethodType): string => {
  const prefix = method.toUpperCase().slice(0, 4);
  const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${prefix}-${randomHex}`;
};

export const getPaymentMethodLabel = (method: PaymentMethodType): string => {
  switch (method) {
    case 'card':
      return 'Carta di Credito / Debito (Visa / Mastercard)';
    case 'postepay':
      return 'PostePay (Poste Italiane)';
    case 'paypal':
      return 'PayPal Express Checkout';
    case 'applepay':
      return 'Apple Pay / Google Pay';
    case 'bonifico':
      return 'Bonifico Bancario SEPA';
    default:
      return 'Pagamento Elettronico';
  }
};

export const createInvoiceRecord = (
  formData: PaymentFormData,
  amount: number = 30.0,
  planId: SubscriptionPlanId = '3_months'
): InvoiceRecord => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[1];

  let vipExpiresAt: string | null = null;
  if (plan.durationDays) {
    const exp = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    vipExpiresAt = exp.toISOString();
  }

  return {
    id: generateInvoiceNumber(),
    date: now.toISOString(),
    formattedDate,
    studentName: formData.studentName.trim() || 'Studente Patente B',
    studentEmail: formData.studentEmail.trim(),
    studentPhone: formData.studentPhone.trim() || '+39',
    codiceFiscale: formData.codiceFiscale.trim().toUpperCase() || 'NON SPECIFICATO',
    address: formData.address.trim() || 'Italia',
    city: formData.city.trim() || 'Bolzano',
    amount: typeof amount === 'number' && amount > 0 ? amount : plan.priceEur,
    currency: 'EUR',
    planId: plan.id,
    vipExpiresAt,
    taxExemptionNote:
      "Operazione didattico-formativa esente da IVA ai sensi dell'art. 10, comma 1, n. 20 del D.P.R. 633/1972.",
    paymentMethod: formData.paymentMethod,
    paymentMethodLabel: getPaymentMethodLabel(formData.paymentMethod),
    transactionId: generateTransactionId(formData.paymentMethod),
    status: 'PAGATO',
    courseDescription:
      plan.id === '1_month'
        ? 'Corso Patente B 2026 - Abbonamento 1 Mese (30 Giorni) a tutti i 240 Round con traduzioni in Bengali e simulatore.'
        : plan.id === '3_months'
        ? 'Corso Patente B 2026 - Abbonamento 3 Mesi (90 Giorni) a tutti i 240 Round con traduzioni in Bengali e simulatore.'
        : 'Corso Completo Ufficiale Patente B 2026 - Accesso Illimitato Lifetime a tutti i 240 Round con spiegazioni in Bengali, Simulatore Orale e Assistenza Didattica.',
    issuer: {
      name: 'PatenteGuru.it / Patente Bangla Italia',
      brand: 'PatenteGuru Autoscuola Digitale',
      instructor: 'Shifat Manjum (Founder & Lead Instructor)',
      location: 'Bolzano (BZ), Trentino-Alto Adige, Italia',
      email: 'khshifat@gmail.com',
      website: 'https://patenteguru.it',
    },
  };
};

export const saveInvoice = (invoice: InvoiceRecord): void => {
  try {
    const existing = getInvoices();
    const updated = [invoice, ...existing.filter((inv) => inv.id !== invoice.id)];
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save invoice locally:', err);
  }
};

export const getInvoices = (studentEmail?: string): InvoiceRecord[] => {
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) return [];
    const list: InvoiceRecord[] = JSON.parse(raw);
    if (studentEmail) {
      const clean = studentEmail.trim().toLowerCase();
      return list.filter((inv) => (inv?.studentEmail || '').toLowerCase() === clean);
    }
    return list;
  } catch {
    return [];
  }
};

export const getLatestInvoice = (studentEmail?: string): InvoiceRecord | null => {
  const list = getInvoices(studentEmail);
  return list.length > 0 ? list[0] : null;
};
