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

// allow the frontend dev server to send requests with credentials
app.use(cors({ origin: true, credentials: true }));

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
  if (process.env.SENDGRID_API_KEY) {
    // Send via SendGrid
    try {
      const msg = { to, from: process.env.SENDGRID_FROM || 'no-reply@govserve.local', subject, text, html };
      await sgMail.send(msg);
      return { ok: true };
    } catch (err) {
      console.error('SendGrid failed', err);
      return { ok: false, error: 'Email send failed' };
    }
  }

  // fallback to Ethereal/Nodemailer
  try {
    const transporter = await (async () => {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    })();

    const info = await transporter.sendMail({ from: 'no-reply@govserve.local', to, subject, text, html });
    const preview = nodemailer.getTestMessageUrl(info) || null;
    return { ok: true, previewUrl: preview };
  } catch (err) {
    console.error('Nodemailer failed', err);
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

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  db.setOTP(email, code, expiresAt);

  try {
    const r = await sendEmail(email, 'Your GovServe verification code', `Your verification code is: ${code} (expires in 10 minutes)`, `<p>Your verification code is: <strong>${code}</strong> (expires in 10 minutes)</p>`);
    if (!r.ok) return res.status(500).json({ error: 'Failed to send email' });
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
