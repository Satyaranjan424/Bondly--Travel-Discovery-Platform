import { NavLink } from "react-router-dom";
import { headerNavItems } from "./socialData.js";
import { LogoutGlyph, MoonGlyph, ProfileGlyph, SearchIcon, SettingsGlyph, ShieldGlyph, SunGlyph } from "./SocialIcons.jsx";

export function SocialHeader({ homeMode, onToggleMode, isAuthenticated, user, onLogout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(7,18,34,0.8)] shadow-[0_18px_54px_rgba(2,6,23,0.46)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-[96rem] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[minmax(16rem,18rem)_1fr_auto] lg:px-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#5eead4,#8b5cf6)] text-xl font-black text-slate-950 shadow-[0_14px_34px_rgba(94,234,212,0.28)]">
            B
          </NavLink>
          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/55 md:flex">
            <SearchIcon />
            <span>Search Bondly</span>
          </div>
        </div>

        <nav className="flex items-center justify-center gap-1 sm:gap-2">
          {headerNavItems.map((item) => {
            const Glyph = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex h-12 w-14 items-center justify-center rounded-2xl border-b-[3px] transition sm:w-20 lg:w-24 ${isActive ? "border-[var(--aqua)] bg-white/8 text-[var(--aqua)]" : "border-transparent text-white/48 hover:bg-white/6 hover:text-white"}`
                }
                aria-label={item.label}
              >
                <Glyph />
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onToggleMode}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/6 text-white/75 transition hover:bg-white/10 hover:text-white"
            aria-label={homeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {homeMode === "dark" ? <SunGlyph /> : <MoonGlyph />}
          </button>

          <details className="relative">
            <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border border-white/10 bg-white/6 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ProfileGlyph />
            </summary>
            <div className="absolute right-0 top-14 w-56 rounded-[1.4rem] border border-white/10 bg-[#091321]/96 p-2 text-sm text-white shadow-[0_24px_64px_rgba(2,6,23,0.56)] backdrop-blur-xl">
              <NavLink to="/profile" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/78 transition hover:bg-white/6 hover:text-white">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#5eead4,#8b5cf6)] text-xs font-bold text-slate-950">
                  {user?.name?.[0] || "B"}
                </span>
                <span>{user?.name || "Traveler"}</span>
              </NavLink>
              <NavLink to="/profile" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/70 transition hover:bg-white/6 hover:text-white">
                <SettingsGlyph />
                <span>Settings</span>
              </NavLink>
              <a href="#privacy" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/70 transition hover:bg-white/6 hover:text-white">
                <ShieldGlyph />
                <span>Privacy policy</span>
              </a>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-white/70 transition hover:bg-white/6 hover:text-white"
                >
                  <LogoutGlyph />
                  <span>Logout</span>
                </button>
              ) : (
                <NavLink to="/auth" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/70 transition hover:bg-white/6 hover:text-white">
                  <LogoutGlyph />
                  <span>Sign in</span>
                </NavLink>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
