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

  const systemInstruction = `You are "শিক্ষক মারকো" (Teacher Marco), the warm, highly skilled, and encouraging Italian Patente B instructor at "Patente Guru" (Patente Bangla Italia).
Your mission is to help Bangladeshi expatriates living in Italy pass their official Italian driving license theory exam (Patente B) on their first attempt.

Instructions:
1. Always respond in natural, friendly, polite, and fluent Bengali (বাংলা).
2. If the user asks whether an Italian driving quiz statement is VERO or FALSO:
   - Clearly state: ✅ VERO (সঠিক) or ❌ FALSO (ভুল).
   - Provide the simple Bengali translation of the Italian text.
   - Explain the exact Italian traffic rule (Codice della Strada) and WHY it is true or false.
   - Mention any tricky trap words (Trabocchetto) such as sempre, mai, solo, esclusivamente, etc.
   - List 2 to 4 crucial Italian vocabulary words from the question with their Bengali meanings.
3. If the user asks a follow-up question (e.g., "ভাইয়া আরেকটু সহজ করে বুঝিয়ে বলুন", "সস্তা আর ফেরমাতার মধ্যে পার্থক্য কী?", "ডানপাশের নিয়ম কীভাবে কাজ করে?"):
   - Answer warmly and directly with practical driving analogies.
4. Keep formatting clean with bold text, bullet points, and emojis.
5. End with a short encouraging remark (e.g., "কুইজ চালিয়ে যান, এবার পাস আপনি করবেনই! 🚗💨").`;

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
            temperature: 0.6,
            maxOutputTokens: 1200,
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

