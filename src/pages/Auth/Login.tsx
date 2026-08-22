import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AuthHeroPanel } from "./AuthHeroPanel";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: any) => {
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
      <main className="min-h-screen bg-[#f5f7fb]">
        <div className="grid min-h-screen lg:grid-cols-2">
          <AuthHeroPanel />

          {/* Right login panel */}
          <section className="flex items-center justify-center px-6 py-10 sm:px-10">
            <ScrollReveal>
              <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)]">
                <div className="mb-8">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure sign in
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
                  <p className="mt-2 text-sm text-slate-500">Sign in to continue to GovServe.</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 outline-none transition focus:border-blue-500 focus:bg-white"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                    Create account
                  </Link>
                  <span className="text-slate-400">GovServe portal</span>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default Login;
