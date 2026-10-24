import { generateQuestionExplanation } from './_gemini.js';
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
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const raw = Buffer.concat(buffers).toString();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const body = await parseBody(req);
    const questionIt = body?.questionIt;
    const isCorrect = Boolean(body?.isCorrect);
    const questionBn = body?.questionBn || '';
    const questionId = body?.id || '';

    if (!questionIt || typeof questionIt !== 'string' || !questionIt.trim()) {
      return res.status(400).json({ error: 'Valid questionIt is required' });
    }

    const cleanIt = questionIt.trim();

    // 1. Check DB cache first
    try {
      const col = await getCollection('ai_explanations');
      const cached = await col.findOne({ questionIt: cleanIt });
      if (cached && cached.explanationBn) {
        return res.status(200).json({
          success: true,
          cached: true,
          explanationBn: cached.explanationBn,
          trapTipBn: cached.trapTipBn || '',
        });
      }
    } catch (dbErr) {
      console.warn('DB cache check notice:', dbErr.message);
    }

    // 2. Generate fresh explanation via Gemini
    const result = await generateQuestionExplanation(cleanIt, isCorrect, questionBn);

    // 3. Save to DB cache asynchronously
    try {
      const col = await getCollection('ai_explanations');
      await col.updateOne(
        { questionIt: cleanIt },
        {
          $set: {
            questionId,
            questionIt: cleanIt,
            isCorrect,
            explanationBn: result.explanationBn,
            trapTipBn: result.trapTipBn,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    } catch {}

    return res.status(200).json({
      success: true,
      explanationBn: result.explanationBn,
      trapTipBn: result.trapTipBn,
    });
  } catch (err) {
    console.error('Error generating explanation:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  }
}
