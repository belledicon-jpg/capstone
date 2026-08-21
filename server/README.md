# Capstone - Dev Auth Server (Enhanced)

This development auth server supports OTP verification, registration, login, profile management,
avatar uploads (local or S3), and server-side sessions persisted in SQLite.

Quick start
1. Install dependencies
   cd server
   npm install

2. Configure environment
   - Copy .env.example to .env and set values if needed. By default the server will use Ethereal to send emails.
   - To send real emails with SendGrid, set SENDGRID_API_KEY
   - To store avatars in S3, set S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY

3. Start the server
   npm start

Files and behavior
- server/data.sqlite : SQLite database file (created on first run)
- server/uploads/ : local uploads folder (used if S3 is not configured)
- Endpoints:
  - POST /api/auth/send-otp { email }
  - POST /api/auth/verify-otp { email, code }
  - POST /api/auth/register { email, name, password, code }
  - POST /api/auth/login { email, password }
  - POST /api/auth/logout
  - GET  /api/auth/session
  - GET  /api/user
  - PATCH /api/user { name }
  - POST /api/user/avatar (multipart form) -> stores to S3 or local and returns URL
  - POST /api/user/password { currentPassword, newPassword }
  - POST /api/user/deactivate
  - POST /api/user/delete

Notes
- Sessions are stored server-side in the sessions table; the cookie contains a random sessionId only.
- OTPs and users are persisted to SQLite so they survive server restarts.
- Avatars can be stored on S3 if S3 env vars are provided; otherwise they are saved to server/uploads.
- This server is intended for development. Do not use as-is in production without hardening.
