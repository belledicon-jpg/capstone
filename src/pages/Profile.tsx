import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageTransition, ScrollReveal } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";
import * as userApi from "@/lib/api/user";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // when user changes (after registration or refresh), update form
  React.useEffect(() => {
    setName(user?.name ?? "");
    setAvatarPreview(user?.avatar ?? null);
  }, [user]);

  if (loading) return null;

  const handleFile = (f: File | null) => {
    setFile(f);
    if (!f) return setAvatarPreview(user?.avatar ?? null);
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
  };

  const handleSave = async (e: any) => {
    e?.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // if file selected upload
      if (file) {
        const res = await userApi.apiUploadAvatar(file);
        if (res?.ok && res.url) {
          setAvatarPreview(res.url);
        }
      }
      // update name
      const res2 = await userApi.apiUpdateUser({ name });
      if (!res2?.ok) throw new Error(res2?.error || 'Failed to update');
      // refresh session user by reloading page or fetching session
      window.location.reload();
    } catch (err: any) {
      setMessage(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: any) => {
    e?.preventDefault();
    setMessage(null);
    try {
      const res = await userApi.apiChangePassword(currentPassword, newPassword);
      if (!res?.ok) throw new Error(res?.error || 'Password change failed');
      setMessage('Password changed');
      setPasswordMode(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage(err.message || 'Password change failed');
    }
  };

  return (
    <PageTransition>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
              {avatarPreview ? <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" /> : (user?.name ? user.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "US")}
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.name ?? "Unknown User"}</div>
              <div className="text-sm text-slate-500">{user?.email ?? "-"}</div>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Avatar</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="mt-1" />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              <Button variant="ghost" onClick={() => { setName(user?.name ?? ''); setFile(null); setAvatarPreview(user?.avatar ?? null); }}>Cancel</Button>
            </div>

            <div className="pt-4 border-t">
              {!passwordMode ? (
                <button type="button" onClick={() => setPasswordMode(true)} className="text-sm text-blue-600 underline">Change password</button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Current password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">New password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Update password</Button>
                    <Button type="button" variant="ghost" onClick={() => setPasswordMode(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </div>

            {message && <div className="text-sm text-red-600">{message}</div>}
          </form>
        </section>
      </main>
    </PageTransition>
  );
};

export default Profile;
