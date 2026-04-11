import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { SocialHeader } from "./social/SocialHeader.jsx";

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [homeMode, setHomeMode] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem("bondly-home-mode") || "dark";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    window.localStorage.setItem("bondly-home-mode", homeMode);
    window.document.documentElement.dataset.bondlyHomeMode = homeMode;

    return () => {
      delete window.document.documentElement.dataset.bondlyHomeMode;
    };
  }, [homeMode]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <SocialHeader
        homeMode={homeMode}
        onToggleMode={() => setHomeMode((current) => (current === "dark" ? "light" : "dark"))}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => void logout()}
      />

      <Outlet context={{ homeMode }} />

      <footer className="border-t border-white/10 bg-[#081321]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-white/50 sm:px-8 lg:px-10 md:flex-row md:items-center md:justify-between">
          <p>Bondly pairs cinematic discovery flows with a practical creator dashboard.</p>
          <p>React, Tailwind, Hono, NeonDB, Redis</p>
        </div>
      </footer>
    </div>
  );
}
