import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <div className="text-sm text-slate-600 mb-4">Signed in as <span className="font-medium">{user?.email}</span></div>
        <div className="flex gap-2">
          <Button onClick={handleLogout} variant="destructive">Sign out</Button>
        </div>
      </section>
    </main>
  );
};

export default Settings;
