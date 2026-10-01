import { getCollection } from './_db.js';

let cachedGeminiKey = '';

async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  if (cachedGeminiKey) {
    return cachedGeminiKey;
  }

  // Gracefully read from local .env in development
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*([^\s\r\n]+)/);
      if (match && match[1]) {
        cachedGeminiKey = match[1].trim();
        return cachedGeminiKey;
      }
    }
  } catch {}

  // Read from MongoDB Atlas settings
  try {
    const settingsCol = await getCollection('settings');
    const doc = await settingsCol.findOne({ key: 'app_settings' });
    if (doc?.geminiApiKey) {
      cachedGeminiKey = doc.geminiApiKey.trim();
      return cachedGeminiKey;
    }
  } catch (err) {
    console.warn('Could not read geminiApiKey from MongoDB settings:', err.message);
  }

  return '';
}

export async function generateTutorResponse(prompt, history = []) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment or database');
  }

  // Available high-performance models
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.6-flash',
  ];

  const systemInstruction = `You are "শিক্ষক মারকো" (Teacher Marco), the laser-focused, precise, and direct Italian Patente B instructor at "Patente Guru".
CRITICAL REQUIREMENT: Talk LESS, be hyper-focused on the exact question, avoid long explanations or conversational filler, and get the job done concisely.

Rules for response:
1. NO long pleasantries, greetings, or filler intros/outros. Start immediately with the direct answer.
2. If asked about a quiz statement (VERO or FALSO):
   • উত্তর: ✅ VERO (সঠিক) or ❌ FALSO (ভুল) [Put this on line 1 in bold]
   • বাংলা অর্থ: [1 short, simple sentence]
   • মূল কারণ / নিয়ম: [1-2 short crisp sentences explaining WHY according to Codice della Strada]
   • ট্র্যাপ শব্দ: [Only if applicable, e.g. "sempre / mai থাকলে সাধারণত FALSO হয়". If none, omit this line entirely]
   • শব্দার্থ: [Max 2 key Italian words: e.g. carreggiata = পাকা রাস্তা, corsia = লেন]
3. If asked a concept question (e.g. difference between sosta and fermata):
   • Give maximum 2-3 short bullet points directly answering the question.
4. Total length MUST be under 80-100 words. Keep it ultra-readable on mobile screens.
5. Language: Clear, modern Bengali (বাংলা) with Italian driving terms.`;

  // Build contents array with conversation history
  const contents = [];

  // Add relevant past conversation turns
  if (Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'ai' ? 'model' : 'user',
          parts: [{ text: h.text }],
        });
      }
    }
  }

  // Add the current user prompt with system instruction context
  contents.push({
    role: 'user',
    parts: [
      {
        text: `${systemInstruction}\n\nUser Question/Query:\n"${prompt}"`,
      },
    ],
  });

  // Try candidate models in order with fast failover
  let lastError = null;
  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 350,
          },
        }),
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error) {
        lastError = new Error(data.error.message || `Model ${model} returned error`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All AI models temporarily busy');
}

