import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, register } = useAuth();

  const [step, setStep] = useState<"email" | "verify" | "account">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [devPreviewUrl, setDevPreviewUrl] = useState<string | null>(null);

  const handleSend = async (e: any) => {
    e?.preventDefault();
    setError(null);
    if (!email) return setError("Email required");
    try {
      const res = await sendOTP(email);
      // in dev the server may return previewUrl (Ethereal)
      if (res?.previewUrl) {
        setDevPreviewUrl(res.previewUrl);
      }
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

  return (
    <PageTransition>
      <main className="mx-auto max-w-md px-4 py-12">
        <ScrollReveal>
          <h1 className="text-2xl font-bold mb-4">Create your GovServe account</h1>

          {step === "email" && (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-between items-center">
                <Link to="/login" className="text-sm text-blue-600 underline">Already have an account?</Link>
                <Button type="submit">Send OTP</Button>
              </div>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <div className="text-sm text-slate-600">We sent a verification code to</div>
                <div className="font-medium">{email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Verification code</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
              </div>
              {devPreviewUrl && (
                <div className="text-xs text-slate-400">(dev) Preview email: <a href={devPreviewUrl} target="_blank" rel="noreferrer" className="underline">Open</a></div>
              )}
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep("email")} className="text-sm text-blue-600 underline">Back</button>
                <div className="flex gap-2">
                  <Button type="button" onClick={handleSend}>Resend</Button>
                  <Button type="submit">Verify</Button>
                </div>
              </div>
            </form>
          )}

          {step === "account" && (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep("verify")} className="text-sm text-blue-600 underline">Back</button>
                <Button type="submit">Create account</Button>
              </div>
            </form>
          )}

        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default Signup;
