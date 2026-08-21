# Capstone - Dev Auth Server

This is a minimal development authentication server used for local testing.
It provides OTP-based email verification using Nodemailer (Ethereal) and simple session cookies.

Usage:

1. Install dependencies:
   cd server
   npm install

2. Start the server:
   npm start

By default the server will use Ethereal (no credentials required) to send test email messages. When an email is sent
Nodemailer will provide a preview URL which is included in the API response so you can open the message in your browser.

Endpoints:
- POST /api/auth/send-otp { email }
- POST /api/auth/verify-otp { email, code }
- POST /api/auth/register { email, name, password, code }
- POST /api/auth/login { email, password }
- POST /api/auth/logout
- GET  /api/auth/session

Note: This server is for development only. Do NOT use it in production. Passwords are hashed with bcrypt but persistent
storage and additional security are required for production use.
