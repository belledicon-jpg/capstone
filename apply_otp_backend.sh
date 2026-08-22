cd server

# 1) Install deps
npm i express cors dotenv bcryptjs jsonwebtoken nodemailer
npm i -D @types/express @types/cors @types/jsonwebtoken @types/nodemailer ts-node-dev typescript

# 2) Create src folder if missing
mkdir -p src

# 3) Write server/src/index.ts
cat > src/index.ts << 'EOF'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

type User = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
};

type OtpRecord = {
  email: string;
  otpHash: string;
  expiresAt: number;
  attemptsLeft: number;
  lastSentAt: number;
  verified: boolean;
};

const users = new Map<string, User>();
const otpStore = new Map<string, OtpRecord>();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function now() {
  return Date.now();
}

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/auth/send-otp", async (req, res) => {
  try {
    const emailRaw = (req.body?.email || "").toString().trim().toLowerCase();
    if (!isEmailValid(emailRaw)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const existing = otpStore.get(emailRaw);
    if (existing && now() - existing.lastSentAt < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${waitSec}s before requesting another code` });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    otpStore.set(emailRaw, {
      email: emailRaw,
      otpHash,
      expiresAt: now() + OTP_TTL_MS,
      attemptsLeft: MAX_VERIFY_ATTEMPTS,
      lastSentAt: now(),
      verified: false,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: emailRaw,
      subject: "Your verification code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `<div style="font-family:Arial,sans-serif"><h2>Email verification</h2><p>Your OTP code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</p><p>This code expires in 5 minutes.</p></div>`,
    });

    return res.json({ ok: true, message: "OTP sent" });
  } catch {
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/auth/verify-otp", async (req, res) => {
  try {
    const emailRaw = (req.body?.email || "").toString().trim().toLowerCase();
    const code = (req.body?.code || "").toString().trim();

    if (!isEmailValid(emailRaw) || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: "Invalid email or code format" });
    }

    const record = otpStore.get(emailRaw);
    if (!record) return res.status(400).json({ error: "No OTP request found for this email" });

    if (now() > record.expiresAt) {
      otpStore.delete(emailRaw);
      return res.status(400).json({ error: "OTP expired. Please request a new code." });
    }

    if (record.attemptsLeft <= 0) {
      otpStore.delete(emailRaw);
      return res.status(429).json({ error: "Too many attempts. Request a new OTP." });
    }

    const match = await bcrypt.compare(code, record.otpHash);
    if (!match) {
      record.attemptsLeft -= 1;
      otpStore.set(emailRaw, record);
      return res.status(400).json({ error: `Invalid code. Attempts left: ${record.attemptsLeft}` });
    }

    record.verified = true;
    otpStore.set(emailRaw, record);
    return res.json({ ok: true, message: "OTP verified" });
  } catch {
    return res.status(500).json({ error: "Verification failed" });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const emailRaw = (req.body?.email || "").toString().trim().toLowerCase();
    const name = (req.body?.name || "").toString().trim();
    const password = (req.body?.password || "").toString();
    const code = (req.body?.code || "").toString().trim();

    if (!isEmailValid(emailRaw)) return res.status(400).json({ error: "Invalid email" });
    if (!name || name.length < 2) return res.status(400).json({ error: "Name is too short" });
    if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 chars" });
    if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: "Invalid code format" });
    if (users.has(emailRaw)) return res.status(409).json({ error: "Email is already registered" });

    const record = otpStore.get(emailRaw);
    if (!record) return res.status(400).json({ error: "No OTP session found" });
    if (now() > record.expiresAt) return res.status(400).json({ error: "OTP expired" });

    const match = await bcrypt.compare(code, record.otpHash);
    if (!match || !record.verified) return res.status(400).json({ error: "OTP not verified" });

    const passwordHash = await bcrypt.hash(password, 10);
    users.set(emailRaw, { email: emailRaw, name, passwordHash, createdAt: now() });

    otpStore.delete(emailRaw);

    const token = jwt.sign({ email: emailRaw, name }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({ ok: true, user: { email: emailRaw, name }, token });
  } catch {
    return res.status(500).json({ error: "Failed to register" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const emailRaw = (req.body?.email || "").toString().trim().toLowerCase();
    const password = (req.body?.password || "").toString();

    const user = users.get(emailRaw);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ ok: true, user: { email: user.email, name: user.name }, token });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
EOF

# 4) Create .env.example
cat > .env.example << 'EOF'
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_this_super_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Capstone OTP <your_email@gmail.com>"
EOF

# 5) Ensure package.json has dev script
node -e '
const fs=require("fs");
const p="package.json";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
j.scripts=j.scripts||{};
if(!j.scripts.dev) j.scripts.dev="ts-node-dev --respawn --transpile-only src/index.ts";
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log("updated package.json scripts.dev");
'

echo "Done. Next: copy .env.example -> .env, fill SMTP values, then run: npm run dev"
