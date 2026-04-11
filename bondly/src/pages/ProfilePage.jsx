import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";

const inputClass = "w-full rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-white outline-none placeholder:text-white/30";

export function ProfilePage() {
  const { user, saveProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    location: user?.location ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await saveProfile(form);
      setStatus("Profile updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
          <img src={form.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"} alt={form.name || "Traveler"} className="h-40 w-40 rounded-[2rem] object-cover" />
          <h1 className="mt-5 font-heading text-4xl text-white">{form.name || "Your Bondly profile"}</h1>
          <p className="mt-3 text-white/60">{form.location || "Add a location to complete your traveler card."}</p>
          <p className="mt-6 text-sm leading-7 text-white/58">{form.bio || "Add a short bio so your public trips feel like they belong to a real travel voice."}</p>
        </div>

        <div className="rounded-[2.4rem] border border-white/10 bg-[#0a1524] p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Profile management</p>
          <h2 className="mt-4 font-heading text-4xl text-white">Shape the public side of your account.</h2>
          <p className="mt-4 text-sm text-white/60">{status || "These fields connect directly to the profile update endpoint."}</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Display name" className={inputClass} />
            <input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Location" className={inputClass} />
            <input value={form.avatarUrl} onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))} placeholder="Avatar URL" className={inputClass} />
            <textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} rows="5" placeholder="Bio" className={inputClass} />
            <button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Save profile
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
