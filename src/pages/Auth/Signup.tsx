import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  CircleHelp,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, register } = useAuth();

  // Multi-step state: 1 = Email Verification, 2 = Account Information, 3 = Successful Registration
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [devPreviewUrl, setDevPreviewUrl] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!email) {
      return setError("Please enter your email address.");
    }
    if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      return setError("Email addresses do not match.");
    }

    setLoading(true);
    try {
      const res = await sendOTP(email);
      if (res?.previewUrl) {
        setDevPreviewUrl(res.previewUrl);
      }
      setOtpSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!otp) {
      return setError("Please enter the verification code.");
    }

    setLoading(true);
    try {
      const res = await verifyOTP(email, otp);
      if (!res?.ok) {
        setError(res?.error || "Invalid or expired verification code.");
      } else {
        setCurrentStep(2);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete Account Info & Register
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      return setError("Full name is required.");
    }
    if (!password) {
      return setError("Password is required.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res = await register({ email, name, password, code: otp });
      if (!res?.ok) {
        setError(res?.error || "Failed to create account.");
      } else {
        setCurrentStep(3);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-slate-50 text-slate-800">
        {/* ================= NAVBAR ================= */}
        <header className="h-[70px] border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 lg:px-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="GovServe Logo"
                className="h-10 w-10 object-contain rounded-full"
              />
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-800">
                  GovServe
                </h1>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center gap-7 lg:flex">
              <Link
                to="/"
                className="text-xs text-slate-500 transition hover:text-blue-600"
              >
                Home
              </Link>
              <Link
                to="/sanitation-services"
                className="text-xs text-slate-500 transition hover:text-blue-600"
              >
                Services
              </Link>
              <Link
                to="/inspections"
                className="text-xs text-slate-500 transition hover:text-blue-600"
              >
                Appointments
              </Link>
              <Link
                to="/"
                className="text-xs text-slate-500 transition hover:text-blue-600"
              >
                Announcements
              </Link>
              <Link
                to="/"
                className="text-xs text-slate-500 transition hover:text-blue-600"
              >
                How it works
              </Link>
              <Link
                to="/"
                className="text-xs text-slate-500 transition hover:text-blue-600"
              >
                Contact
              </Link>
            </nav>

            {/* Account */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs font-medium text-slate-600 hover:text-blue-600"
              >
                Sign in
              </Link>

              <span className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm">
                Register
              </span>
            </div>
          </div>
        </header>

        {/* ================= CONTENT CONTAINER ================= */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <ScrollReveal>
            {/* Top Navigation / Title */}
            <div className="mb-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-800 hover:text-blue-900 mb-4 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>

              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
                  Create Your Account & Start Using GovServe
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Sign up today and enjoy secure, hassle-free access to GovServe!
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Login Here
                  </Link>
                </p>
              </div>
            </div>

            {/* Step Progress Bar Header */}
            <div className="mb-8">
              <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4 sm:px-10">
                {/* Connecting Line */}
                <div className="absolute left-10 right-10 top-4 -z-0 h-0.5 bg-slate-200">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{
                      width:
                        currentStep === 1
                          ? "0%"
                          : currentStep === 2
                          ? "50%"
                          : "100%",
                    }}
                  />
                </div>

                {/* Step 1 Indicator */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                      currentStep >= 1
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {currentStep > 1 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= 1 ? "text-blue-900 font-semibold" : "text-slate-400"
                    }`}
                  >
                    Email Verification
                  </span>
                </div>

                {/* Step 2 Indicator */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                      currentStep >= 2
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {currentStep > 2 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= 2 ? "text-blue-900 font-semibold" : "text-slate-400"
                    }`}
                  >
                    Account Information
                  </span>
                </div>

                {/* Step 3 Indicator */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                      currentStep === 3
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {currentStep === 3 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep === 3 ? "text-blue-900 font-semibold" : "text-slate-400"
                    }`}
                  >
                    Successful Registration
                  </span>
                </div>
              </div>
            </div>

            {/* Main Form Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 max-w-2xl mx-auto">
              {/* ERROR MESSAGE DISPLAY */}
              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* ================= STEP 1: EMAIL VERIFICATION ================= */}
              {currentStep === 1 && (
                <div className="text-center space-y-6">
                  {/* Icon Circle */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                    <Mail className="h-7 w-7" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-blue-950">
                      Enter your <span className="text-blue-900">Email Address</span>
                    </h2>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOTP} className="space-y-4 max-w-md mx-auto text-left">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1 block text-xs font-semibold text-slate-700"
                        >
                          Personal Email Address:
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmEmail"
                          className="mb-1 block text-xs font-semibold text-slate-700"
                        >
                          Confirm Email Address:
                        </label>
                        <input
                          id="confirmEmail"
                          type="email"
                          value={confirmEmail}
                          onChange={(e) => setConfirmEmail(e.target.value)}
                          placeholder="Re-enter your email address"
                          required
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <p className="py-2 text-center text-xs text-slate-500 leading-relaxed">
                        Click <span className="font-semibold text-slate-700">Send OTP</span> to receive a 6-digit verification code directly in your personal email inbox.
                      </p>

                      <div className="pt-2 text-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full sm:w-auto px-10 h-11 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md transition hover:bg-blue-950 disabled:opacity-60"
                        >
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4 max-w-md mx-auto text-left">
                      <div className="rounded-lg bg-blue-50/70 p-3 text-xs text-blue-900 text-center border border-blue-100 leading-relaxed">
                        A 6-digit verification code has been sent to your email <span className="font-semibold">{email}</span>. Please check your inbox or spam folder.
                      </div>

                      <div>
                        <label
                          htmlFor="otp"
                          className="mb-1 block text-xs font-semibold text-slate-700"
                        >
                          Enter Verification Code (OTP):
                        </label>
                        <input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit code"
                          required
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-center text-base tracking-widest outline-none transition placeholder:text-slate-300 placeholder:tracking-normal focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {devPreviewUrl && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-center text-xs text-amber-800">
                          <strong>Note:</strong> SMTP credentials not configured on backend. Simulated test email preview:{" "}
                          <a
                            href={devPreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-blue-700 underline"
                          >
                            View Email Inbox
                          </a>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleSendOTP()}
                          disabled={loading}
                          className="flex-1 h-11 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          Resend OTP
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 h-11 rounded-lg bg-blue-900 text-xs font-semibold text-white shadow-md transition hover:bg-blue-950 disabled:opacity-60"
                        >
                          {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setError(null);
                          }}
                          className="text-xs text-slate-500 hover:text-blue-600 underline"
                        >
                          Change email address
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ================= STEP 2: ACCOUNT INFORMATION ================= */}
              {currentStep === 2 && (
                <div className="text-center space-y-6">
                  {/* Icon Circle */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                    <UserCheck className="h-7 w-7" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-blue-950">
                      Complete Your <span className="text-blue-900">Account Information</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Provide your full name and password to complete setup.
                    </p>
                  </div>

                  <form onSubmit={handleCreateAccount} className="space-y-4 max-w-md mx-auto text-left">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Full Name:
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Password:
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 pr-11 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Confirm Password:
                      </label>
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="h-11 px-6 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-11 rounded-lg bg-blue-900 text-xs font-semibold text-white shadow-md transition hover:bg-blue-950 disabled:opacity-60"
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ================= STEP 3: SUCCESSFUL REGISTRATION ================= */}
              {currentStep === 3 && (
                <div className="text-center space-y-6 py-4">
                  {/* Icon Circle */}
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Registration Successful!
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                      Your GovServe account has been created and verified. You can now access all health and sanitation public services.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="px-8 h-11 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
                    >
                      Go to Services
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Help button */}
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

export default Signup;
