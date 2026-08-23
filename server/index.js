const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

// allow frontend requests with credentials + CSRF header
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
}));

// CSRF Token endpoint
app.get('/api/csrf-token', (req, res) => {
  let csrfToken = req.cookies?.['csrf-token'];
  if (!csrfToken) {
    csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf-token', csrfToken, { httpOnly: false, sameSite: 'lax', secure: false });
  }
  return res.json({ ok: true, csrfToken });
});

// CSRF protection middleware
function isSafeMethod(method) {
  return method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
}

function requireCsrf(req, res, next) {
  if (isSafeMethod(req.method)) return next();

  // Keep auth bootstrap routes unblocked for login/register
  const csrfExemptPaths = new Set([
    '/api/auth/register',
    '/api/auth/login',
  ]);
  if (csrfExemptPaths.has(req.path)) return next();

  const cookieToken = req.cookies?.['csrf-token'];
  const headerToken = req.get('X-CSRF-Token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'CSRF token missing or invalid' });
  }
  return next();
}

// Apply CSRF checks after token endpoint
app.use(requireCsrf);

// ensure uploads dir exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer setup (disk storage fallback)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});
const upload = multer({ storage });

// S3 client (optional)
let s3Client = null;
const S3_BUCKET = process.env.S3_BUCKET;
if (process.env.S3_BUCKET && process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
}

async function setSession(res, email) {
 const id = crypto.randomBytes(24).toString('hex');
 const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;
 await db.createSession(id, email, expiresAt);
 res.cookie('sessionId', id, {
   httpOnly: true,
   sameSite: 'lax',
   secure: process.env.NODE_ENV === 'production',
 });
}

async function clearSession(res, req) {
 const sid = req.cookies?.sessionId;
 if (sid) await db.deleteSession(sid);
 res.clearCookie('sessionId');
}

async function getSessionUser(req) {
 const sid = req.cookies?.sessionId;
 if (!sid) return null;
 const s = await db.getSession(sid);
 if (!s) return null;
 const user = await db.getUser(s.email);
 if (!user) return null;
 return { sessionId: sid, user };
}

app.post('/api/auth/register', async (req, res) => {
 const { email, name, password } = req.body || {};
 if (!email || !name || !password) return res.status(400).json({ error: 'email, name, and password required' });
 const cleanEmail = email.trim().toLowerCase();
 const cleanName = name.trim();

 const existing = await db.getUser(cleanEmail);
 if (existing) return res.status(400).json({ error: 'User with this email already exists.' });

 const passwordHash = await bcrypt.hash(password, 10);
 const user = await db.createUser({ email: cleanEmail, name: cleanName, passwordHash });

 await setSession(res, cleanEmail);
 return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const cleanEmail = email.trim().toLowerCase();

  const user = await db.getUser(cleanEmail);
  if (!user) return res.status(400).json({ error: 'Invalid email or password.' });
  if (!user.active) return res.status(400).json({ error: 'Account inactive' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid email or password.' });

  await setSession(res, cleanEmail);
  return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

app.post('/api/auth/logout', async (req, res) => {
  await clearSession(res, req);
  return res.json({ ok: true });
});

app.get('/api/auth/session', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.json({ ok: true, user: null });
  return res.json({ ok: true, user: { email: sess.user.email, name: sess.user.name, avatar: sess.user.avatar } });
});

// User endpoints
app.get('/api/user', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  const { user } = sess;
  res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar, active: user.active } });
});

app.patch('/api/user', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  const { name } = req.body || {};
  if (typeof name === 'string') await db.updateUser(sess.user.email, { name });
  const updated = await db.getUser(sess.user.email);
  res.json({ ok: true, user: { email: updated.email, name: updated.name, avatar: updated.avatar } });
});

app.post('/api/user/avatar', upload.single('avatar'), async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  if (s3Client) {
    const key = `avatars/${req.file.filename}`;
    const fileStream = fs.createReadStream(req.file.path);
    const put = new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: fileStream, ContentType: req.file.mimetype });
    try {
      await s3Client.send(put);
      const getCmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
      const url = await getSignedUrl(s3Client, getCmd, { expiresIn: 60 * 60 });
      fs.unlinkSync(req.file.path);
      await db.updateUser(sess.user.email, { avatar: url });
      return res.json({ ok: true, url });
    } catch (err) {
      console.error('S3 upload failed', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  const url = `/uploads/${req.file.filename}`;
  await db.updateUser(sess.user.email, { avatar: url });
  return res.json({ ok: true, url });
});

app.post('/api/user/password', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword required' });

  const rawUser = await db.getUser(sess.user.email);
  const ok = await bcrypt.compare(currentPassword, rawUser.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Current password incorrect' });

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.changePassword(sess.user.email, newHash);
  res.json({ ok: true });
});

app.post('/api/user/deactivate', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  await db.deactivateUser(sess.user.email);
  await clearSession(res, req);
  res.json({ ok: true });
});

app.post('/api/user/delete', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  await db.deleteUser(sess.user.email);
  await clearSession(res, req);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Auth dev server listening on http://localhost:${PORT}`);
});
