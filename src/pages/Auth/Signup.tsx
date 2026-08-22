import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AuthHeroPanel } from "./AuthHeroPanel";

const Signup = () => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, register } = useAuth();

  const [step, setStep] = useState<"email" | "verify" | "account">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devPreviewUrl, setDevPreviewUrl] = useState<string | null>(null);

  const handleSend = async (e: any) => {
    e?.preventDefault();
    setError(null);
    if (!email) return setError("Email required");
    try {
      const res = await sendOTP(email);
      if (res?.previewUrl) setDevPreviewUrl(res.previewUrl);
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    }
  };

  const handleVerify = async (e: any) => {
    e?.preventDefault();
    setError(null);
    try {
      const res = await verifyOTP(email, otp);
      if (!res?.ok) return setError(res?.error || "Invalid or expired code");
      setStep("account");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    }
  };

  const handleCreate = async (e: any) => {
    e?.preventDefault();
    setError(null);
    if (!name || !password) return setError("Name and password required");
    try {
      const res = await register({ email, name, password, code: otp });
      if (!res?.ok) return setError(res?.error || "Failed to create account");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  const stepLabels = { email: 1, verify: 2, account: 3 } as const;

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#f5f7fb]">
        <div className="grid min-h-screen lg:grid-cols-2">
          <AuthHeroPanel />

          {/* Right signup panel */}
          <section className="flex items-center justify-center px-6 py-10 sm:px-10">
            <ScrollReveal>
              <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)]">
                <div className="mb-8">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <UserPlus className="h-3.5 w-3.5" />
                    Step {stepLabels[step]} of 3
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
                  <p className="mt-2 text-sm text-slate-500">Get started with GovServe.</p>
                </div>

                {step === "email" && (
                  <form onSubmit={handleSend} className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                    >
                      Send verification code
                    </Button>

                    <p className="text-center text-sm text-slate-500">
                      Already have an account?{" "}
                      <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </form>
                )}

                {step === "verify" && (
                  <form onSubmit={handleVerify} className="space-y-5">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                      We sent a verification code to{" "}
                      <span className="font-semibold">{email}</span>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Verification code</label>
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                        placeholder="Enter 6-digit code"
                        required
                      />
                    </div>

                    {devPreviewUrl && (
                      <div className="text-xs text-slate-400">
                        (dev) Preview email:{" "}
                        <a href={devPreviewUrl} target="_blank" rel="noreferrer" className="underline">
                          Open
                        </a>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                    >
                      Verify code
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => setStep("email")}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSend}
                        className="text-slate-500 hover:text-blue-600 hover:underline"
                      >
                        Resend code
                      </button>
                    </div>
                  </form>
                )}

                {step === "account" && (
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                        placeholder="Juan dela Cruz"
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
                          placeholder="Create a password"
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
                      className="h-12 w-full rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Create account
                    </Button>

                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setStep("verify")}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        ← Back
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default Signup;
