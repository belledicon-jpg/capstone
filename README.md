# Capstone - GovServe Inspection Platform

A full-stack web application for managing sanitation inspections and reports. Built with React (Vite), Express.js, SQLite, and TypeScript.

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Local Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/belledicon-jpg/capstone.git
   cd capstone
   npm install
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm install
   npm start
   ```
   Server will listen on `http://localhost:4000` by default.

3. **Configure frontend environment**
   ```bash
   # Copy the example env file
   cp .env.example .env.local

   # For local dev (backend on localhost:4000), set:
   VITE_API_BASE=http://localhost:4000

   # Or leave it unset if frontend and backend are on the same origin.
   ```

4. **Start the frontend**
   ```bash
   npm run dev
   ```
   Open the Vite dev URL printed in the terminal (usually `http://localhost:5173`).

### Using a Dev Proxy (Optional, recommended for local dev)

To avoid CORS issues and simplify local development, you can configure Vite to proxy `/api` requests to your backend.

Edit `vite.config.ts` and enable the `server.proxy` config (already included):
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      rewrite: (path) => path,
    },
  },
}
```

With this config in place:
- Leave `VITE_API_BASE` unset in `.env.local`
- Frontend requests to `/api/*` will be proxied to `http://localhost:4000/api/*`
- No CORS issues or hardcoded API URLs needed during development

## Project Structure

```
.
├── src/
│   ├── pages/          # React pages (Signup, Profile, Settings, Dashboard, etc.)
│   ├── components/     # Reusable UI components (AppLayout, Header, etc.)
│   ├── hooks/          # Custom hooks (useAuth, etc.)
│   ├── lib/
│   │   ├── api/        # API client functions (auth, user)
│   │   └── utils.ts    # Utility functions
│   └── App.tsx         # Main app router
├── server/             # Express backend
│   ├── index.js        # Main server (auth, user endpoints)
│   ├── db.js           # SQLite database layer
│   ├── migrations/     # SQL migration files
│   ├── migrate.js      # Migration runner
│   ├── uploads/        # Avatar uploads (created at runtime)
│   └── data.sqlite     # SQLite database (created on first run)
├── vite.config.ts      # Vite build and dev config
├── package.json        # Frontend dependencies
├── .env.example        # Frontend env template
└── README.md           # This file
```

## Features

- **Authentication**: OTP-based signup with email verification and session-based access
- **Profile Management**: Edit name, upload avatar, change password
- **Session Management**: Server-side sessions with secure HTTP-only cookies
- **Account Actions**: Deactivate or delete account
- **Dashboard**: View and manage sanitation inspections
- **Responsive UI**: Mobile-friendly design with Tailwind CSS and shadcn/ui

## API

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/session` - Get current session user

### User Endpoints
- `GET /api/user` - Get user profile
- `PATCH /api/user` - Update user name
- `POST /api/user/avatar` - Upload avatar (returns URL)
- `POST /api/user/password` - Change password
- `POST /api/user/deactivate` - Deactivate account
- `POST /api/user/delete` - Delete account

## Environment Variables

### Frontend (.env or .env.local)

| Variable | Description | Example |
|----------|-------------|----------|
| `VITE_API_BASE` | API base URL (optional, defaults to relative `/api`) | `http://localhost:4000` |

### Backend (server/.env)

| Variable | Description | Example |
|----------|-------------|----------|
| `PORT` | Server port | `4000` |
| `SENDGRID_API_KEY` | SendGrid API key (optional, uses Ethereal if not set) | Your SendGrid key |
| `SENDGRID_FROM` | SendGrid from email address (optional) | `noreply@govserve.com` |
| `S3_BUCKET` | AWS S3 bucket name (optional) | `my-avatars` |
| `S3_REGION` | AWS S3 region (optional) | `us-east-1` |
| `S3_ACCESS_KEY_ID` | AWS access key (optional) | Your access key |
| `S3_SECRET_ACCESS_KEY` | AWS secret key (optional) | Your secret key |

See `server/.env.example` for a complete template.

## Deployment

### Frontend Deployment

The frontend is built with Vite and can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

1. **Build for production**
   ```bash
   npm run build
   ```
   Output is in `dist/`

2. **Environment variables**
   - Set `VITE_API_BASE` to your production API URL (e.g., `https://api.example.com`)
   - Or leave unset if the API is served from the same origin (recommended)

3. **Example deployment to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   Vercel will auto-detect Vite and build + deploy automatically.

4. **Example deployment to Netlify**
   - Connect your GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add env variables via Netlify UI or `netlify.toml`

### Backend Deployment

The backend is a Node.js Express app. Deployment targets include Heroku, AWS, DigitalOcean, Railway, etc.

1. **Prepare for production**
   - Use a production database (Postgres recommended over SQLite)
   - Set secure environment variables (SENDGRID_API_KEY, S3 credentials, etc.)
   - Enable HTTPS and set cookie `secure=true`
   - Configure CORS to allow your frontend origin only
   - Add rate-limiting and input validation

2. **Example deployment to Heroku**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```
   Set env vars via Heroku Dashboard or CLI:
   ```bash
   heroku config:set SENDGRID_API_KEY=your-key
   ```

3. **Example deployment to Railway**
   - Connect your GitHub repo to Railway
   - Railway auto-detects `package.json` and runs `npm start`
   - Set env variables in Railway Dashboard

4. **Frontend + Backend same origin (recommended)**
   - Build frontend and serve static files from the same backend server
   - Add this to `server/index.js` to serve the frontend:
     ```js
     app.use(express.static(path.join(__dirname, '../dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../dist/index.html'));
     });
     ```
   - Build frontend: `npm run build`
   - Deploy the whole repo to your backend host

## Development

### Frontend
- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

### Backend
- **Start**: `cd server && npm start` (runs migrations then starts server)
- **Migrate**: `cd server && npm run migrate`

### Database

The backend uses SQLite with a migration system. Migrations are applied automatically on server start.

To add a new migration:
1. Create a file `server/migrations/002-my-change.sql` with your SQL
2. Restart the server; the migration will run automatically
3. Check `server/data.sqlite` with `sqlite3` or a GUI

## Security Notes

This project is developed for educational/demo purposes. Before using in production:

- [ ] Replace SQLite with a managed DB (Postgres/MySQL)
- [ ] Set cookie `secure=true` and serve over HTTPS only
- [ ] Add rate-limiting on auth endpoints
- [ ] Add CAPTCHA to OTP/login flows
- [ ] Validate and sanitize all user inputs
- [ ] Scan uploaded files for malware
- [ ] Use S3 or object storage for avatar uploads
- [ ] Implement session expiry and cleanup
- [ ] Set strict CORS to allow only your frontend origin
- [ ] Add request logging and monitoring

## Contributing

Contributions welcome! Please open issues or PRs on GitHub.

## License

MIT
