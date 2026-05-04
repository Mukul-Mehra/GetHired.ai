
export default function Dashboard() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Candidate",
    joinedAt: "May 4, 2026",
    status: "Active",
    id: "USR-1024",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-slate-400">
            Here are your account details and current status.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 text-2xl font-bold text-cyan-400 ring-1 ring-cyan-400/20">
                JD
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-slate-400">{user.role}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-400">Status</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  {user.status}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-400">User ID</span>
                <span className="text-sm font-medium text-white">{user.id}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-400">Joined</span>
                <span className="text-sm font-medium text-white">{user.joinedAt}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-semibold">Account Details</h2>
            <p className="mt-1 text-sm text-slate-400">
              Basic information for the currently logged-in user.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="mt-1 text-base font-medium text-white">{user.name}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Email</p>
                <p className="mt-1 text-base font-medium text-white">{user.email}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Role</p>
                <p className="mt-1 text-base font-medium text-white">{user.role}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Account Status</p>
                <p className="mt-1 text-base font-medium text-white">{user.status}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-sm text-cyan-300">
                This is a hardcoded dashboard UI. Later you can replace `user`
                with data from your auth context or backend API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
