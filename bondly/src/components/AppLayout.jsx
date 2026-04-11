import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Publish", to: "/publish" },
  { label: "Dashboard", to: "/dashboard" },
];

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(7,18,34,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,_#ecfeff,_#8b5cf6)] text-sm font-black text-slate-900 shadow-[0_12px_30px_rgba(56,189,248,0.25)]">
              B
            </div>
            <div>
              <p className="font-heading text-lg leading-none text-white">Bondly</p>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">Travel discovery</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition ${isActive ? "bg-white text-slate-900" : "text-white/65 hover:bg-white/8 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white sm:block">
                  {user?.name}
                </NavLink>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/auth" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-white/10 bg-[#081321]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-white/50 sm:px-8 lg:px-10 md:flex-row md:items-center md:justify-between">
          <p>Bondly pairs cinematic discovery flows with a practical creator dashboard.</p>
          <p>React, Tailwind, Hono, NeonDB, Redis</p>
        </div>
      </footer>
    </div>
  );
}
