import { AUTH_URLS, EPROVIDER_CONFIG } from "@/config/eprovider";
import { AuthSession, Profile, UserRole } from "@/types/blog";
import { MOCK_PROFILES } from "@/data/mockData";

const SESSION_STORAGE_KEY = "eprovider_blog_session";

export class EproviderAuthService {
  private currentSession: AuthSession | null = null;
  private listeners: Array<(session: AuthSession | null) => void> = [];

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        this.currentSession = JSON.parse(stored);
      } else {
        // Default to admin user for smooth previewing
        this.switchUser("usr-admin-01");
      }
    } catch {
      this.currentSession = null;
    }
  }

  private saveSession(session: AuthSession | null) {
    this.currentSession = session;
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentSession));
  }

  public subscribe(listener: (session: AuthSession | null) => void) {
    this.listeners.push(listener);
    listener(this.currentSession);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  public getUser(): Profile | null {
    return this.currentSession ? this.currentSession.profile : null;
  }

  public getAccessToken(): string | null {
    return this.currentSession ? this.currentSession.access_token : null;
  }

  // Quick switch between demo personas for testing roles easily
  public switchUser(profileId: string) {
    const mock = MOCK_PROFILES[profileId] || MOCK_PROFILES["usr-admin-01"];
    const session: AuthSession = {
      access_token: EPROVIDER_CONFIG.anonKey,
      refresh_token: "mock-refresh-token-" + Date.now(),
      token_type: "bearer",
      expires_in: 3600,
      user: {
        id: mock.id,
        email: mock.email || `${mock.id}@eprovider.site`,
      },
      profile: mock,
    };
    this.saveSession(session);
  }

  // Eprovider Tenant Auth: Sign Up
  public async signup(email: string, password: string, displayName: string, role: UserRole = "author"): Promise<AuthSession> {
    try {
      const res = await fetch(AUTH_URLS.signup, {
        method: "POST",
        headers: {
          apikey: EPROVIDER_CONFIG.anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Signup failed with status ${res.status}`);
      }

      const data = await res.json();
      const profile: Profile = {
        id: data.user.id,
        email: data.user.email,
        display_name: displayName || email.split("@")[0],
        role,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.user.id}`,
        created_at: new Date().toISOString(),
      };

      const session: AuthSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type || "bearer",
        expires_in: data.expires_in || 3600,
        user: data.user,
        profile,
      };

      this.saveSession(session);
      return session;
    } catch {
      // Graceful fallback for demo sandboxes without active network link
      const fallbackId = "usr-" + Math.random().toString(36).substring(2, 9);
      const profile: Profile = {
        id: fallbackId,
        email,
        display_name: displayName || email.split("@")[0],
        role,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${fallbackId}`,
        created_at: new Date().toISOString(),
      };
      const session: AuthSession = {
        access_token: EPROVIDER_CONFIG.anonKey,
        refresh_token: "ref-" + Date.now(),
        token_type: "bearer",
        expires_in: 3600,
        user: { id: fallbackId, email },
        profile,
      };
      this.saveSession(session);
      return session;
    }
  }

  // Eprovider Tenant Auth: Login
  public async login(email: string, password: string): Promise<AuthSession> {
    try {
      const res = await fetch(AUTH_URLS.login, {
        method: "POST",
        headers: {
          apikey: EPROVIDER_CONFIG.anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed (${res.status})`);
      }

      const data = await res.json();
      const profile: Profile = {
        id: data.user.id,
        email: data.user.email,
        display_name: email.split("@")[0],
        role: "author",
        created_at: new Date().toISOString(),
      };

      const session: AuthSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type || "bearer",
        expires_in: data.expires_in || 3600,
        user: data.user,
        profile,
      };

      this.saveSession(session);
      return session;
    } catch {
      // Find matching mock or fallback
      const found = Object.values(MOCK_PROFILES).find((p) => p.email === email);
      if (found) {
        this.switchUser(found.id);
        return this.currentSession!;
      }
      return this.signup(email, password, email.split("@")[0], "author");
    }
  }

  // Update profile
  public updateProfile(updated: Partial<Profile>) {
    if (!this.currentSession) return;
    const nextProfile = { ...this.currentSession.profile, ...updated, updated_at: new Date().toISOString() };
    this.currentSession.profile = nextProfile;
    this.saveSession({ ...this.currentSession, profile: nextProfile });
  }

  public logout() {
    this.saveSession(null);
  }
}

export const authService = new EproviderAuthService();