import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">{user?.name ? user.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "US"}</div>
          <div>
            <div className="text-lg font-semibold">{user?.name ?? "Unknown User"}</div>
            <div className="text-sm text-slate-500">{user?.email ?? "-"}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input value={user?.name ?? ""} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input value={user?.email ?? ""} readOnly className="mt-1 w-full rounded border px-3 py-2 bg-slate-50" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
