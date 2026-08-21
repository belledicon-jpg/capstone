import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import * as userApi from "@/lib/api/user";
import { useState } from "react";

const Settings = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate your account? This will sign you out.')) return;
    setBusy(true);
    try {
      const res = await userApi.apiDeactivateUser();
      if (!res?.ok) throw new Error(res?.error || 'Failed');
      await logout();
      navigate('/login');
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Deleting your account is permanent. Are you sure?')) return;
    setBusy(true);
    try {
      const res = await userApi.apiDeleteUser();
      if (!res?.ok) throw new Error(res?.error || 'Failed');
      await logout();
      navigate('/login');
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <div className="text-sm text-slate-600 mb-4">Signed in as <span className="font-medium">{user?.email}</span></div>
        <div className="flex gap-2 mb-4">
          <Button onClick={handleLogout} variant="secondary">Sign out</Button>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold">Danger Zone</h3>
          <p className="text-sm text-slate-600">Deactivate or delete your account. Deleting is permanent.</p>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleDeactivate} variant="destructive" disabled={busy}>Deactivate Account</Button>
            <Button onClick={handleDelete} variant="outline" disabled={busy}>Delete Account</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Settings;
