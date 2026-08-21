import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      <main className="mx-auto max-w-md px-4 py-12">
        <ScrollReveal>
          <h1 className="text-2xl font-bold mb-4">Sign in to GovServe</h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/signup" className="text-blue-600 underline">Create account</Link>
              </div>
              <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            </div>
          </form>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default Login;
