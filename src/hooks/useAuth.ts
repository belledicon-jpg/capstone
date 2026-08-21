import * as React from "react";

type User = {
  email: string;
  name?: string;
  password?: string; // demo-only; don't store plaintext in production
  verified?: boolean;
  createdAt?: string;
};

const USERS_KEY = "govserve_users_v1";
const SESSION_KEY = "govserve_session_v1";

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [];
}

function saveUsers(users: User[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users", e);
  }
}

function saveSession(email: string | null) {
  try {
    if (email) localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    else localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("Failed to save session", e);
  }
}

function loadSession(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj.email || null;
  } catch (e) {
    return null;
  }
}

// OTP helpers
function saveOTP(email: string, code: string) {
  const key = `govserve_otp_${email}`;
  const payload = { code, expiresAt: Date.now() + 1000 * 60 * 10 }; // 10 minutes
  localStorage.setItem(key, JSON.stringify(payload));
}

function verifyOTPCode(email: string, code: string) {
  const key = `govserve_otp_${email}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const { code: real, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) return false;
    return real === code;
  } catch (e) {
    return false;
  }
}

const AuthContext = React.createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    // load session user
    const email = loadSession();
    if (email) {
      const u = loadUsers().find((x) => x.email === email) || null;
      setUser(u);
    }
  }, []);

  const register = async (u: User) => {
    const users = loadUsers();
    if (users.find((x) => x.email === u.email)) {
      throw new Error("User already exists");
    }
    const newUser = { ...u, verified: true, createdAt: new Date().toISOString() };
    users.unshift(newUser);
    saveUsers(users);
    saveSession(newUser.email);
    setUser(newUser);
    return newUser;
  };

  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    saveSession(found.email);
    setUser(found);
    return found;
  };

  const logout = () => {
    saveSession(null);
    setUser(null);
  };

  const sendOTP = async (email: string) => {
    // generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    saveOTP(email, code);
    // In production you'd send code via email provider. For dev we keep it in localStorage.
    // Also return the code so UI can show it in dev mode (optional)
    return code;
  };

  const verifyOTP = async (email: string, code: string) => {
    const ok = verifyOTPCode(email, code);
    return ok;
  };

  const value = React.useMemo(
    () => ({ user, register, login, logout, sendOTP, verifyOTP }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import { Navigate } from "react-router-dom";
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
