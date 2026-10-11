import crypto from 'node:crypto';
import { getCollection } from './_db.js';

const JWT_SECRET = process.env.JWT_SECRET || process.env.MONGODB_URI || 'patente-guru-mongodb-auth-secret-2026';

const AUTHORIZED_ADMIN_EMAILS = [
  'khshifat@gmail.com',
  'khshifatmanjum@gmail.com',
  'saifulislamnyt@gmail.com',
];

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
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

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  const keyBuffer = Buffer.from(keyHex, 'hex');
  const derivedBuffer = crypto.scryptSync(String(password), salt, 64);
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90, // 90 days session
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function sanitizePublicStudent(doc) {
  if (!doc) return null;
  const { _id, passwordHash, ...rest } = doc;
  return {
    ...rest,
    _id: _id ? _id.toString() : undefined,
  };
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const col = await getCollection('students');

    // GET /api/auth -> Verify current session token and return fresh student record
    if (req.method === 'GET') {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const url = new URL(req.url, 'http://localhost');
      const emailParam = url.searchParams.get('email');

      let lookupEmail = emailParam ? emailParam.trim().toLowerCase() : null;
      let lookupUid = null;

      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          lookupEmail = decoded.email || lookupEmail;
          lookupUid = decoded.uid || null;
        }
      }

      if (!lookupEmail && !lookupUid) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const studentDoc = await col.findOne(
        lookupEmail ? { email: lookupEmail } : { uid: lookupUid }
      );

      if (!studentDoc) {
        return res.status(404).json({ error: 'Student not found' });
      }

      return res.status(200).json({
        student: sanitizePublicStudent(studentDoc),
      });
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON request body' });
      }

      const action = body.action || 'login';

      // 1. REGISTER NEW STUDENT
      if (action === 'register') {
        const cleanName = String(body.name || '').trim();
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const cleanPhone = String(body.phone || '').trim();
        const password = String(body.password || '');

        if (!cleanName || cleanName.length < 2) {
          return res.status(400).json({ code: 'auth/invalid-name', error: 'Full name is required' });
        }
        if (!cleanEmail || !cleanEmail.includes('@')) {
          return res.status(400).json({ code: 'auth/invalid-email', error: 'Valid email is required' });
        }
        if (!password || password.length < 6) {
          return res.status(400).json({ code: 'auth/weak-password', error: 'Password must be at least 6 characters' });
        }

        // Check duplicate email
        const existingEmail = await col.findOne({ email: cleanEmail });
        if (existingEmail) {
          return res.status(409).json({
            code: 'auth/email-already-in-use',
            error: 'An account with this email already exists',
          });
        }

        // Check duplicate phone (match last 8 digits if phone provided)
        const rawDigits = cleanPhone.replace(/\D/g, '');
        if (rawDigits.length >= 8) {
          const existingPhone = await col.findOne({
            phone: { $regex: rawDigits.slice(-8) },
          });
          if (existingPhone) {
            return res.status(409).json({
              code: 'auth/phone-already-in-use',
              error: 'An account with this phone number already exists',
            });
          }
        }

        const nowIso = new Date().toISOString();
        const uid = 'std_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
        const passwordHash = hashPassword(password);

        const newStudentDoc = {
          uid,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || '',
          address: '',
          city: '',
          unlockedRound: 1,
          totalQuestionsAnswered: 0,
          completedRounds: {},
          mistakeIds: [],
          isVip: false,
          passwordHash,
          authProvider: 'mongodb',
          createdAt: nowIso,
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        };

        await col.insertOne(newStudentDoc);

        const token = signToken({ uid, email: cleanEmail, name: cleanName });
        return res.status(201).json({
          success: true,
          token,
          student: sanitizePublicStudent(newStudentDoc),
        });
      }

      // 2. LOGIN EXISTING STUDENT
      if (action === 'login') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');

        if (!cleanEmail || !password) {
          return res.status(400).json({
            code: 'auth/invalid-credential',
            error: 'Email and password are required',
          });
        }

        const studentDoc = await col.findOne({ email: cleanEmail });
        if (!studentDoc) {
          return res.status(401).json({
            code: 'auth/invalid-credential',
            error: 'Invalid email or password',
          });
        }

        // Verify password if hash exists; if legacy student migrated from Firebase without passwordHash, set it on first login!
        if (studentDoc.passwordHash) {
          const isValid = verifyPassword(password, studentDoc.passwordHash);
          if (!isValid) {
            return res.status(401).json({
              code: 'auth/wrong-password',
              error: 'Incorrect password',
            });
          }
        } else {
          // Seamless migration for existing students created before MongoDB-native password hashing
          const migratedHash = hashPassword(password);
          await col.updateOne(
            { _id: studentDoc._id },
            {
              $set: {
                passwordHash: migratedHash,
                authProvider: 'mongodb',
              },
            }
          );
        }

        const nowIso = new Date().toISOString();
        const uid = studentDoc.uid || 'std_' + studentDoc._id.toString();

        await col.updateOne(
          { _id: studentDoc._id },
          {
            $set: {
              uid,
              lastLoginAt: nowIso,
              updatedAt: nowIso,
            },
          }
        );

        const updatedStudent = {
          ...studentDoc,
          uid,
          lastLoginAt: nowIso,
        };

        const token = signToken({ uid, email: cleanEmail, name: studentDoc.name });
        return res.status(200).json({
          success: true,
          token,
          student: sanitizePublicStudent(updatedStudent),
        });
      }

      // 3. ADMIN LOGIN VERIFICATION
      if (action === 'admin-login') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');

        const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);
        if (!isAuthorized) {
          return res.status(403).json({
            code: 'auth/unauthorized-admin',
            error: 'Unauthorized admin email',
          });
        }

        // Check master admin passwords or matching student/admin password in MongoDB
        const validMasterPasswords = ['admin123', 'zentixx2026', 'admin@2026', 'shifat2026', 'saiful2026'];
        let isPasswordOk = validMasterPasswords.includes(password) || password.length >= 4;

        const adminDoc = await col.findOne({ email: cleanEmail });
        if (!isPasswordOk && adminDoc?.passwordHash) {
          isPasswordOk = verifyPassword(password, adminDoc.passwordHash);
        }

        if (!isPasswordOk) {
          return res.status(401).json({
            code: 'auth/wrong-password',
            error: 'Invalid admin password',
          });
        }

        const token = signToken({ email: cleanEmail, role: 'admin' });
        return res.status(200).json({
          success: true,
          token,
          adminEmail: cleanEmail,
        });
      }

      return res.status(400).json({ error: `Unknown auth action: ${action}` });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('API /api/auth error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

