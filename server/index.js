const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

// allow the frontend dev server to send requests with credentials
app.use(cors({ origin: true, credentials: true }));

// ensure uploads dir exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer setup
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

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;
  transporterPromise = (async () => {
    if (process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    }

    // otherwise, create a test account on Ethereal
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  })();
  return transporterPromise;
}

function setSession(res, email) {
  // In production use a secure, signed session ID stored server-side or HTTP-only cookie with proper flags
  res.cookie('session', email, { httpOnly: true, sameSite: 'lax', secure: false });
}

function clearSession(res) {
  res.clearCookie('session');
}

app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  db.setOTP(email, code, expiresAt);

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: 'no-reply@govserve.local',
      to: email,
      subject: 'Your GovServe verification code',
      text: `Your verification code is: ${code} (expires in 10 minutes)`,
      html: `<p>Your verification code is: <strong>${code}</strong> (expires in 10 minutes)</p>`,
    });

    const preview = nodemailer.getTestMessageUrl(info) || null;
    return res.json({ ok: true, previewUrl: preview });
  } catch (err) {
    console.error('Failed to send email', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
  const rec = db.getOTP(email);
  if (!rec) return res.status(400).json({ error: 'No OTP found' });
  if (Date.now() > rec.expiresAt) return res.status(400).json({ error: 'OTP expired' });
  if (rec.code !== code) return res.status(400).json({ error: 'Invalid code' });
  // OTP verified - remove it
  db.deleteOTP(email);
  return res.json({ ok: true });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, name, password, code } = req.body || {};
  if (!email || !name || !password || !code) return res.status(400).json({ error: 'email, name, password, code required' });
  // verify OTP
  const rec = db.getOTP(email);
  if (!rec || rec.code !== code || Date.now() > rec.expiresAt) return res.status(400).json({ error: 'Invalid or expired OTP' });

  const existing = db.getUser(email);
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = db.createUser({ email, name, passwordHash });
  db.deleteOTP(email);

  setSession(res, email);
  return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = db.getUser(email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.active) return res.status(400).json({ error: 'Account inactive' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  setSession(res, email);
  return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

app.post('/api/auth/logout', (req, res) => {
  clearSession(res);
  return res.json({ ok: true });
});

app.get('/api/auth/session', (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.json({ ok: true, user: null });
  const user = db.getUser(session);
  if (!user) return res.json({ ok: true, user: null });
  return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

// User endpoints
app.get('/api/user', (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUser(session);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar, active: user.active } });
});

app.patch('/api/user', (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUser(session);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name } = req.body || {};
  if (typeof name === 'string') db.updateUser(session, { name });
  const updated = db.getUser(session);
  res.json({ ok: true, user: { email: updated.email, name: updated.name, avatar: updated.avatar } });
});

app.post('/api/user/avatar', upload.single('avatar'), (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUser(session);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  db.updateUser(session, { avatar: url });
  res.json({ ok: true, url });
});

app.post('/api/user/password', async (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUser(session);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword required' });
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Current password incorrect' });
  const newHash = await bcrypt.hash(newPassword, 10);
  db.changePassword(session, newHash);
  res.json({ ok: true });
});

app.post('/api/user/deactivate', (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUser(session);
  if (!user) return res.status(404).json({ error: 'User not found' });
  db.deactivateUser(session);
  clearSession(res);
  res.json({ ok: true });
});

app.post('/api/user/delete', (req, res) => {
  const { session } = req.cookies || {};
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUser(session);
  if (!user) return res.status(404).json({ error: 'User not found' });
  db.deleteUser(session);
  clearSession(res);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Auth dev server listening on http://localhost:${PORT}`);
});
