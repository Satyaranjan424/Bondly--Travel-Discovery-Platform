import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const inputClass = "w-full rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-white outline-none placeholder:text-white/30";

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const destination = useMemo(() => location.state?.from || "/dashboard", [location.state]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setStatus("Working...");
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      navigate(destination, { replace: true });
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03))] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Authentication</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Step into the creator side of Bondly.</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/65">Switch between a polished login flow and a strong signup screen. Once authenticated, you can publish trips, update your profile, and manage your own travel stories.</p>
      </section>

      <section className="rounded-[2.4rem] border border-white/10 bg-[#0a1524] p-8 shadow-[0_24px_100px_rgba(0,0,0,0.35)]">
        <div className="inline-flex rounded-full bg-white/6 p-1">
          {["login", "signup"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-full px-4 py-2 text-sm capitalize ${mode === item ? "bg-white text-slate-950" : "text-white/65"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "signup" ? (
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" className={inputClass} />
          ) : null}
          <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className={inputClass} />
          <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" className={inputClass} />
          <button type="submit" className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            {mode === "login" ? "Access Bondly" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-white/55">{status || "Demo login: maya@bondly.app / Password123!"}</p>
      </section>
    </main>
  );
}
