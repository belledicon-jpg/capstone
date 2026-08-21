import * as React from "react";
import * as api from "@/lib/api/auth";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = React.createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
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

  const sendOTP = async (email: string) => {
    const res = await api.apiSendOTP(email);
    return res;
  };

  const verifyOTP = async (email: string, code: string) => {
    const res = await api.apiVerifyOTP(email, code);
    return res;
  };

  const register = async ({ email, name, password, code }: any) => {
    const res = await api.apiRegister({ email, name, password, code });
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

  const value = React.useMemo(() => ({ user, loading, sendOTP, verifyOTP, register, login, logout }), [user, loading]);

  return React.createElement(AuthContext.Provider, { value }, children) as any;
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
