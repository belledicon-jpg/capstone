import { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import { 
  HeartPulse, 
  CalendarDays, 
  FileCheck2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CircleHelp, 
} from "lucide-react"; 
 
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
      const res = await login(email, password); 
      if (!res?.ok) {
        setError(res?.error || "Login failed");
      } else {
        navigate("/"); 
      }
    } catch (err: unknown) { 
      setError(err instanceof Error ? err.message : "Login failed"); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  return ( 
    <PageTransition> 
      <main className="min-h-screen bg-white text-slate-800"> 
 
        {/* ================= NAVBAR ================= */} 
        <header className="h-[70px] border-b border-slate-100 bg-white"> 
          <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 lg:px-10"> 
 
            {/* Logo */} 
            <Link to="/" className="flex items-center gap-3"> 
              <img src="/logo.jpg" alt="GovServe Logo" className="h-10 w-10 object-contain rounded-full" /> 
 
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
 
        {/* ================= MAIN ================= */} 
        <div className="grid min-h-[calc(100vh-70px)] lg:grid-cols-2"> 
 
          {/* ================= LEFT SIDE ================= */} 
          <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 px-8 py-16 sm:px-12 lg:px-20"> 
 
            {/* Decorative circles */} 
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/30" /> 
 
            <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-950/30" /> 
 
            <div className="relative z-10 max-w-xl"> 
 
              <ScrollReveal> 
 
                {/* Small badge */} 
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-blue-50 backdrop-blur-sm"> 
                  <ShieldCheck className="h-4 w-4" /> 
                  Secure Public Health Services 
                </div> 
 
                {/* Heading */} 
                <h2 className="max-w-lg text-4xl font-bold leading-tight text-white sm:text-5xl"> 
                  Health & Sanitation 
                  <br /> 
                  services, online. 
                </h2> 
 
                {/* Description */} 
                <p className="mt-6 max-w-md text-sm leading-7 text-blue-100"> 
                  Access health services, appointments, sanitation permits, 
                  health records, and community health programs through one 
                  convenient platform. 
                </p> 
 
                {/* Services */} 
                <div className="mt-8 grid max-w-lg grid-cols-2 gap-3"> 
 
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"> 
                    <HeartPulse className="h-4 w-4 text-white" /> 
                    <span className="text-xs font-medium text-white"> 
                      Health Services 
                    </span> 
                  </div> 
 
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"> 
                    <CalendarDays className="h-4 w-4 text-white" /> 
                    <span className="text-xs font-medium text-white"> 
                      Appointments 
                    </span> 
                  </div> 
 
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"> 
                    <FileCheck2 className="h-4 w-4 text-white" /> 
                    <span className="text-xs font-medium text-white"> 
                      Sanitation Permits 
                    </span> 
                  </div> 
 
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"> 
                    <ShieldCheck className="h-4 w-4 text-white" /> 
                    <span className="text-xs font-medium text-white"> 
                      Health Records 
                    </span> 
                  </div> 
 
                </div> 
 
                <p className="mt-10 text-xs text-blue-200"> 
                  A secure digital platform for your community's health needs. 
                </p> 
 
              </ScrollReveal> 
            </div> 
          </section> 
 
          {/* ================= RIGHT SIDE ================= */} 
          <section className="flex items-center justify-center bg-slate-50 px-5 py-12 sm:px-8"> 
 
            <div className="w-full max-w-[400px]"> 
 
              <ScrollReveal> 
 
                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"> 
 
                  {/* Header */} 
                  <div className="mb-8"> 
                    <h2 className="text-2xl font-bold text-slate-800"> 
                      Welcome back 
                    </h2> 
 
                    <p className="mt-2 text-sm text-slate-400"> 
                      Sign in to access your health services. 
                    </p> 
                  </div> 
 
                  {/* Form */} 
                  <form onSubmit={submit} className="space-y-5"> 
 
                    {/* Email */} 
                    <div> 
                      <label 
                        htmlFor="email" 
                        className="mb-2 block text-xs font-semibold text-slate-700" 
                      > 
                        Email 
                      </label> 
 
                      <input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email" 
                        autoComplete="email" 
                        required 
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                      /> 
                    </div> 
 
                    {/* Password */} 
                    <div> 
                      <div className="mb-2 flex items-center justify-between"> 
 
                        <label 
                          htmlFor="password" 
                          className="text-xs font-semibold text-slate-700" 
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
                          placeholder="Enter your password" 
                          autoComplete="current-password" 
                          required 
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 pr-11 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                        /> 
 
                        <button 
                          type="button" 
                          onClick={() => 
                            setShowPassword((previous) => !previous) 
                          } 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600" 
                          aria-label={ 
                            showPassword 
                              ? "Hide password" 
                              : "Show password" 
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
 
                    {/* Error */} 
                    {error && ( 
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600"> 
                        {error} 
                      </div> 
                    )} 
 
                    {/* Remember me */} 
                    <div className="flex items-center gap-2"> 
 
                      <input 
                        id="remember" 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => 
                          setRememberMe(e.target.checked) 
                        } 
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      /> 
 
                      <label 
                        htmlFor="remember" 
                        className="text-xs text-slate-500" 
                      > 
                        Remember me 
                      </label> 
 
                    </div> 
 
                    {/* Sign in */} 
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" 
                    > 
                      {loading ? "Signing in..." : "Sign in"} 
 
                      {!loading && ( 
                        <ArrowRight className="h-4 w-4" /> 
                      )} 
                    </button> 
 
                  </form> 
 
                  {/* Register */} 
                  <div className="mt-6 text-center"> 
                    <p className="text-xs text-slate-400"> 
                      Don't have an account?{" "} 
 
                      <Link 
                        to="/signup" 
                        className="font-semibold text-blue-600 hover:text-blue-700" 
                      > 
                        Register 
                      </Link> 
                    </p> 
                  </div> 
 
                  {/* Security note */} 
                  <div className="mt-7 border-t border-slate-100 pt-5 text-center"> 
                    <p className="text-[10px] leading-5 text-slate-400"> 
                      Your information is securely handled by GovServe. 
                    </p> 
                  </div> 
 
                </div> 
 
              </ScrollReveal> 
            </div> 
          </section> 
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
 
export default Login;
