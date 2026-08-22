import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, register } = useAuth();

  const [step, setStep] = useState<"email" | "verify" | "account" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [devPreviewUrl, setDevPreviewUrl] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (sendingOtp) return;
    setError(null);
    if (!email) return setError("Email required");
    setSendingOtp(true);
    try {
      const res = await sendOTP(email);
      // in dev the server may return previewUrl (Ethereal)
      if (res?.previewUrl) {
        setDevPreviewUrl(res.previewUrl);
      }
      setOtp("");
      setStep("verify");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to send OTP"));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (verifyingOtp) return;
    setError(null);
    setVerifyingOtp(true);
    try {
      const res = await verifyOTP(email, otp);
      if (!res?.ok) return setError(res?.error || "Invalid or expired code");
      setStep("account");
    } catch (err) {
      setError(getErrorMessage(err, "Verification failed"));
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (creatingAccount) return;
    setError(null);
    if (!name || !password) return setError("Name and password required");
    setCreatingAccount(true);
    try {
      const res = await register({ email, name, password, code: otp });
      if (!res?.ok) return setError(res?.error || "Failed to create account");
      setStep("success");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create account"));
    } finally {
      setCreatingAccount(false);
    }
  };

  const progressSteps = [
    "Email Verification",
    "Account Information",
    "Successful Registration",
  ];

  const activeProgressIndex =
    step === "account" ? 1 : step === "success" ? 2 : 0;

  const isStepCompleted = (index: number) => index < activeProgressIndex;

  const renderError = () =>
    error ? (
      <div className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
        {error}
      </div>
    ) : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 px-4 py-10 sm:px-6 sm:py-14">
        <ScrollReveal>
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
              Create your GovServe account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Complete the registration steps to access digital government services.
            </p>

            <ol aria-label="Registration steps" className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-2">
              {progressSteps.map((label, index) => {
                const isCompleted = isStepCompleted(index);
                const isActive = index === activeProgressIndex;

                return (
                  <li
                    key={label}
                    aria-current={isActive ? "step" : undefined}
                    className="flex items-center gap-2.5 sm:flex-col sm:items-start sm:gap-2"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                        isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : isActive
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Completed</span>
                        </>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium leading-4 ${
                        isActive || isCompleted ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
              {step === "email" && (
                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="you@example.gov"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {renderError()}
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Already have an account?
                    </Link>
                    <Button type="submit" disabled={sendingOtp} className="h-11 rounded-full px-5 text-sm font-semibold">
                      {sendingOtp ? "Sending..." : "Send OTP"}
                    </Button>
                  </div>
                </form>
              )}

              {step === "verify" && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Code sent to
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{email}</div>
                  </div>
                  <div>
                    <label htmlFor="otp" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Verification code
                    </label>
                    <input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter 6-digit code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                  {devPreviewUrl && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-xs text-blue-700">
                      (dev) Preview email:{" "}
                      <a href={devPreviewUrl} target="_blank" rel="noreferrer" className="font-medium underline">
                        Open
                      </a>
                    </div>
                  )}
                  {renderError()}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button type="button" onClick={() => setStep("email")} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Back
                    </button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSend}
                        disabled={sendingOtp}
                        className="h-10 rounded-full px-4 text-sm"
                      >
                        {sendingOtp ? "Resending..." : "Resend"}
                      </Button>
                      <Button type="submit" disabled={verifyingOtp} className="h-10 rounded-full px-4 text-sm font-semibold">
                        {verifyingOtp ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {step === "account" && (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Full name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Juan Dela Cruz"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Create password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {renderError()}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button type="button" onClick={() => setStep("verify")} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Back
                    </button>
                    <Button type="submit" disabled={creatingAccount} className="h-10 rounded-full px-5 text-sm font-semibold">
                      {creatingAccount ? "Creating..." : "Create account"}
                    </Button>
                  </div>
                </form>
              )}

              {step === "success" && (
                <div className="py-3 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-11 w-11" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                    Registration Successful!
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Your GovServe account has been created. You can now explore and access available services.
                  </p>
                  <Button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-6 h-11 rounded-full px-7 text-sm font-semibold"
                  >
                    Go to Services
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default Signup;
