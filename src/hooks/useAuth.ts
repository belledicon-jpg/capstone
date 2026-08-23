import * as React from "react";
import * as api from "@/lib/api/auth";
import { Navigate, useLocation } from "react-router-dom";

type AuthUser = NonNullable<api.ApiResponse["user"]>;

type RegisterPayload = {
  email: string;
  name: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  register: (payload: RegisterPayload) => Promise<api.ApiResponse>;
  login: (email: string, password: string) => Promise<api.ApiResponse>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    api.apiGetSession()
      .then((json) => {
        if (!mounted) return;
        if (json?.user) setUser(json.user);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const register = async ({ email, name, password }: RegisterPayload) => {
    const res = await api.apiRegister({ email, name, password });
    if (res?.ok) {
      const s = await api.apiGetSession();
      setUser(s.user || null);
    }
    return res;
  };

  const login = async (email: string, password: string) => {
    const res = await api.apiLogin(email, password);
    if (res?.ok) {
      const s = await api.apiGetSession();
      setUser(s.user || null);
    }
    return res;
  };

  const logout = async () => {
    await api.apiLogout();
    setUser(null);
  };

  const value = React.useMemo(() => ({ user, loading, register, login, logout }), [user, loading]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(AuthContext);
  const location = useLocation();
  if (ctx?.loading) return React.createElement("div", { className: "p-6" }, "Loading...");
  if (!ctx?.user) return React.createElement(Navigate, { to: "/login", state: { from: location }, replace: true });
  return React.createElement(React.Fragment, null, children);
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
