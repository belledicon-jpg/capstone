const express = require('express');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
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

// allow the frontend dev server to send requests with credentials and custom CSRF headers
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-CSRF-TOKEN',
    'X-XSRF-TOKEN',
    'CSRF-Token',
    'X-Requested-With'
  ],
}));

// CSRF Token endpoint
app.get('/api/csrf-token', (req, res) => {
  let csrfToken = req.cookies?.['csrf-token'] || req.cookies?.['XSRF-TOKEN'] || req.cookies?.['_csrf'];
  if (!csrfToken) {
    csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.cookie('csrf-token', csrfToken, { httpOnly: false, sameSite: 'lax', secure: false });
  res.cookie('XSRF-TOKEN', csrfToken, { httpOnly: false, sameSite: 'lax', secure: false });
  return res.json({ ok: true, csrfToken, csrf_token: csrfToken });
});

// ensure uploads dir exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer setup (disk storage for fallback)
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

// SendGrid (optional)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendEmail(to, subject, text, html) {
  // 1. Send via SendGrid if configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to,
        from: process.env.SENDGRID_FROM || process.env.EMAIL_FROM || process.env.SMTP_FROM || 'no-reply@govserve.local',
        subject,
        text,
        html,
      };
      await sgMail.send(msg);
      return { ok: true };
    } catch (err) {
      console.error('SendGrid failed', err);
      return { ok: false, error: 'Email send failed via SendGrid' };
    }
  }

  // 2. Send via custom SMTP server if configured (e.g., Gmail, Outlook, Amazon SES, Mailgun)
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS;
  let smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;

  // Auto-detect Gmail host if user email ends with @gmail.com or GMAIL_USER is set
  if (!smtpHost && smtpUser && (smtpUser.includes('@gmail.com') || process.env.GMAIL_USER)) {
    smtpHost = 'smtp.gmail.com';
  }

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
      const secure = process.env.SMTP_SECURE === 'true' || port === 465;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: port,
        secure: secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SENDGRID_FROM || smtpUser;
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text,
        html,
      });

      console.log(`Email sent to ${to} via SMTP ${smtpHost} (${info.messageId})`);
      return { ok: true };
    } catch (err) {
      console.error('SMTP email send failed:', err);
      return { ok: false, error: `SMTP email failed: ${err.message}` };
    }
  }

  // 3. Dev Fallback: Ethereal test account with preview link
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: 'no-reply@govserve.local',
      to,
      subject,
      text,
      html,
    });
    const preview = nodemailer.getTestMessageUrl(info) || null;
    console.log(`[Dev Fallback] Simulated OTP email to ${to}. Preview URL: ${preview}`);
    return { ok: true, previewUrl: preview };
  } catch (err) {
    console.error('Nodemailer test transport failed', err);
    return { ok: false, error: 'Email send failed' };
  }
}

function setSession(res, email) {
  const id = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  db.createSession(id, email, expiresAt);
  res.cookie('sessionId', id, { httpOnly: true, sameSite: 'lax', secure: false });
}

function clearSession(res, req) {
  const sid = req.cookies?.sessionId;
  if (sid) db.deleteSession(sid);
  res.clearCookie('sessionId');
}

async function getSessionUser(req) {
  const sid = req.cookies?.sessionId;
  if (!sid) return null;
  const s = db.getSession(sid);
  if (!s) return null;
  const user = db.getUser(s.email);
  if (!user) return null;
  return { sessionId: sid, user };
}

app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  const cleanEmail = email.trim().toLowerCase();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  db.setOTP(cleanEmail, code, expiresAt);

  try {
    const r = await sendEmail(cleanEmail, 'Your GovServe verification code', `Your verification code is: ${code} (expires in 10 minutes)`, `<p>Your verification code is: <strong>${code}</strong> (expires in 10 minutes)</p>`);
    if (!r.ok) return res.status(500).json({ error: r.error || 'Failed to send email' });
    // if nodemailer/Ethereal returned previewUrl, forward it to client for dev convenience
    return res.json({ ok: true, previewUrl: r.previewUrl || null });
  } catch (err) {
    console.error('Failed to send email', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = String(code).trim();

  const rec = db.getOTP(cleanEmail);
  if (!rec) return res.status(400).json({ error: 'No OTP found for this email address.' });
  if (Date.now() > rec.expiresAt) return res.status(400).json({ error: 'OTP code has expired. Please request a new code.' });
  if (rec.code !== cleanCode) return res.status(400).json({ error: 'Invalid verification code.' });
  // OTP verified
  return res.json({ ok: true });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, name, password, code } = req.body || {};
  if (!email || !name || !password || !code) return res.status(400).json({ error: 'email, name, password, code required' });
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = String(code).trim();
  const cleanName = name.trim();

  // verify OTP
  const rec = db.getOTP(cleanEmail);
  if (!rec || rec.code !== cleanCode || Date.now() > rec.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP verification code.' });
  }

  const existing = db.getUser(cleanEmail);
  if (existing) return res.status(400).json({ error: 'User with this email already exists.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = db.createUser({ email: cleanEmail, name: cleanName, passwordHash });
  db.deleteOTP(cleanEmail);

  setSession(res, cleanEmail);
  return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const cleanEmail = email.trim().toLowerCase();

  const user = db.getUser(cleanEmail);
  if (!user) return res.status(400).json({ error: 'Invalid email or password.' });
  if (!user.active) return res.status(400).json({ error: 'Account inactive' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid email or password.' });
  setSession(res, cleanEmail);
  return res.json({ ok: true, user: { email: user.email, name: user.name, avatar: user.avatar } });
});

app.post('/api/auth/logout', async (req, res) => {
  clearSession(res, req);
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
  if (typeof name === 'string') db.updateUser(sess.user.email, { name });
  const updated = db.getUser(sess.user.email);
  res.json({ ok: true, user: { email: updated.email, name: updated.name, avatar: updated.avatar } });
});

app.post('/api/user/avatar', upload.single('avatar'), async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // If S3 configured, upload and return signed URL
  if (s3Client) {
    const key = `avatars/${req.file.filename}`;
    const fileStream = fs.createReadStream(req.file.path);
    const put = new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: fileStream, ContentType: req.file.mimetype });
    try {
      await s3Client.send(put);
      // generate a signed GET URL
      const getCmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
      const url = await getSignedUrl(s3Client, getCmd, { expiresIn: 60 * 60 }); // 1 hour
      // delete local file
      fs.unlinkSync(req.file.path);
      db.updateUser(sess.user.email, { avatar: url });
      return res.json({ ok: true, url });
    } catch (err) {
      console.error('S3 upload failed', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  // fallback: local file
  const url = `/uploads/${req.file.filename}`;
  db.updateUser(sess.user.email, { avatar: url });
  return res.json({ ok: true, url });
});

app.post('/api/user/password', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword required' });
  const ok = await bcrypt.compare(currentPassword, sess.user.passwordHash || sess.user.passwordHash);
  // Note: getSessionUser returns user without passwordHash; fetch raw user
  const rawUser = db.getUser(sess.user.email);
  const ok2 = await bcrypt.compare(currentPassword, rawUser.passwordHash);
  if (!ok2) return res.status(400).json({ error: 'Current password incorrect' });
  const newHash = await bcrypt.hash(newPassword, 10);
  db.changePassword(sess.user.email, newHash);
  res.json({ ok: true });
});

app.post('/api/user/deactivate', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  db.deactivateUser(sess.user.email);
  clearSession(res, req);
  res.json({ ok: true });
});

app.post('/api/user/delete', async (req, res) => {
  const sess = await getSessionUser(req);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  db.deleteUser(sess.user.email);
  clearSession(res, req);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Auth dev server listening on http://localhost:${PORT}`);
});
