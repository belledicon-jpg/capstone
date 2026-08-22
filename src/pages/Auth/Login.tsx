import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CalendarDays,
  FileCheck2,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CircleHelp,
  HeartPulse,
} from "lucide-react";
import logoSrc from "@/assets/logo.png";

import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-white text-slate-800">
        <header className="h-[70px] border-b border-slate-100 bg-white">
          <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 lg:px-10">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoSrc} alt="Government Seal" className="h-9 w-9 rounded-full object-cover" />

              <div>
                <h1 className="text-[13px] font-bold tracking-tight text-slate-800">
                  HEALTH & SANITATION
                </h1>
                <p className="text-[9px] tracking-[0.22em] text-slate-400">
                  MANAGEMENT SYSTEM
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              <Link to="/" className="text-xs text-slate-500 transition hover:text-blue-600">
                Home
              </Link>
              <Link to="/services" className="text-xs text-slate-500 transition hover:text-blue-600">
                Services
              </Link>
              <Link to="/appointments" className="text-xs text-slate-500 transition hover:text-blue-600">
                Appointments
              </Link>
              <Link to="/announcements" className="text-xs text-slate-500 transition hover:text-blue-600">
                Announcements
              </Link>
              <Link to="/how-it-works" className="text-xs text-slate-500 transition hover:text-blue-600">
                How it works
              </Link>
              <Link to="/contact" className="text-xs text-slate-500 transition hover:text-blue-600">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="hidden text-xs font-medium text-slate-600 sm:block">
                Sign in
              </span>

              <Link
                to="/signup"
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-70px)] lg:grid-cols-2">
          <section className="relative flex items-center overflow-hidden bg-[linear-gradient(135deg,#2151df_0%,#2b5fe8_45%,#2457e2_100%)] px-8 py-16 sm:px-12 lg:px-16">
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/8" />
            <div className="absolute -bottom-36 -left-28 h-88 w-88 rounded-full bg-[#143fb8]/35" />

            <div className="relative z-10 max-w-[520px]">
              <ScrollReveal>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Public Health Services
                </div>

                <h2 className="max-w-lg text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-[44px]">
                  Health & Sanitation
                  <br />
                  services, online.
                </h2>

                <p className="mt-5 max-w-md text-[14px] leading-7 text-blue-50/90 sm:text-[15px]">
                  Access health services, appointments, sanitation permits,
                  health records, and community health programs through one
                  convenient platform.
                </p>

                <div className="mt-8 grid max-w-[440px] grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-sm">
                    <HeartPulse className="h-4 w-4 text-white" />
                    <span className="text-xs font-medium text-white">Health Services</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-sm">
                    <CalendarDays className="h-4 w-4 text-white" />
                    <span className="text-xs font-medium text-white">Appointments</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-sm">
                    <FileCheck2 className="h-4 w-4 text-white" />
                    <span className="text-xs font-medium text-white">Sanitation Permits</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-sm">
                    <ShieldCheck className="h-4 w-4 text-white" />
                    <span className="text-xs font-medium text-white">Health Records</span>
                  </div>
                </div>

                <p className="mt-10 text-[11px] text-blue-50/75">
                  A secure digital platform for your community&apos;s health needs.
                </p>
              </ScrollReveal>
            </div>
          </section>

          <section className="flex items-center justify-center bg-[#f7f8fc] px-5 py-12 sm:px-8">
            <div className="w-full max-w-[360px]">
              <ScrollReveal>
                <div className="rounded-[18px] border border-slate-200/80 bg-white px-6 py-7 shadow-[0_10px_35px_rgba(15,23,42,0.08)] sm:px-7 sm:py-8">
                  <div className="mb-7">
                    <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">
                      Welcome back
                    </h2>
                    <p className="mt-2 text-[13px] text-slate-400">
                      Sign in to access your health services.
                    </p>
                  </div>

                  <form onSubmit={submit} className="space-y-4.5">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[12px] font-semibold text-slate-700"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        autoComplete="email"
                        required
                        className="h-10 w-full rounded-[10px] border border-slate-200 bg-white px-4 text-[13px] outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor="password"
                          className="text-[12px] font-semibold text-slate-700"
                        >
                          Password
                        </label>

                        <Link
                          to="/forgot-password"
                          className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="mypassword"
                          autoComplete="current-password"
                          required
                          className="h-10 w-full rounded-[10px] border border-slate-200 bg-white px-4 pr-11 text-[13px] outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((previous) => !previous)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <label htmlFor="remember" className="text-[12px] text-slate-500">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                      {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-[12px] text-slate-400">
                      Don&apos;t have an account?{" "}
                      <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                        Register
                      </Link>
                    </p>
                  </div>

                  <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                    <p className="text-[10px] leading-5 text-slate-400">
                      Your information is securely handled by the
                      Health & Sanitation Management System.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>

        <button
          type="button"
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2.5 text-xs font-medium text-white shadow-lg transition hover:bg-slate-900"
        >
          <CircleHelp className="h-4 w-4" />
          Need help?
        </button>
      </main>
    </PageTransition>
  );
};

export default Login;
