import { Link, NavLink } from "react-router-dom";
import { leftRailItems } from "./socialData.js";

export function SocialLeftRail({ avatar, displayName, isLightMode }) {
  const panelClass = isLightMode
    ? "border border-slate-200/80 bg-white/78 text-slate-900 shadow-[0_20px_56px_rgba(15,23,42,0.09)] backdrop-blur-xl"
    : "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-white shadow-[0_24px_70px_rgba(2,6,23,0.34)] backdrop-blur-xl";
  const mutedText = isLightMode ? "text-slate-500" : "text-white/58";
  const hoverSurface = isLightMode ? "hover:bg-slate-100" : "hover:bg-white/6";

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-3">
        <Link to="/profile" className={`flex items-center gap-3 rounded-3xl p-4 ${panelClass}`}>
          <img src={avatar} alt={displayName} className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--aqua)]/30" />
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className={`text-sm ${mutedText}`}>Travel creator profile</p>
          </div>
        </Link>

        <div className={`rounded-[1.75rem] p-3 ${panelClass}`}>
          {leftRailItems.map((item) => {
            const Glyph = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${isActive ? "bg-[linear-gradient(135deg,rgba(94,234,212,0.18),rgba(139,92,246,0.18))] text-[var(--aqua)]" : `${mutedText} ${hoverSurface}`}`
                }
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${isLightMode ? "bg-slate-100 text-slate-700" : "bg-white/8 text-white/78"}`}>
                  <Glyph />
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(94,234,212,0.28),rgba(139,92,246,0.3),rgba(244,114,182,0.24))] p-5 text-white shadow-[0_20px_54px_rgba(94,234,212,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">Travel pulse</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">Turn Bondly into a proper social travel feed.</h2>
          <p className="mt-3 text-sm leading-6 text-white/80">Left rail for discovery, center for stories, right for people and activity.</p>
        </div>
      </div>
    </aside>
  );
}
