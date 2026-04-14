import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../hooks/useToast.jsx";
import { readFileAsDataUrl } from "../lib/fileUploads.js";
import { api } from "../lib/api.js";

const inputClass = "w-full rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-white outline-none placeholder:text-white/30";

export function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, saveProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    location: user?.location ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      bio: user?.bio ?? "",
      location: user?.location ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    });
  }, [user]);

  useEffect(() => {
    if (!user?.id) return undefined;
    const controller = new AbortController();
    api
      .getUserProfile(user.id, { token, signal: controller.signal })
      .then((response) => {
        setProfile(response);
        setStatus("");
      })
      .catch(() => {
        setStatus("We could not load your profile details right now.");
      });
    return () => controller.abort();
  }, [token, user?.id]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const nextUser = await saveProfile(form);
      setProfile((current) => current ? { ...current, user: nextUser } : current);
      setStatus("Profile updated.");
      setIsEditing(false);
      showToast({ type: "update", message: "Your profile details are now polished and live." });
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const avatarUrl = await readFileAsDataUrl(file);
    setForm((current) => ({ ...current, avatarUrl }));
  }

  const stats = profile?.stats ?? {};
  const avatar = form.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80";
  const name = profile?.user?.name || form.name || "Your Bondly profile";
  const location = profile?.user?.location || form.location || "Add a location to complete your traveler card.";
  const bio = profile?.user?.bio || form.bio || "Add a short bio so your public trips feel like they belong to a real travel voice.";

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8">
          <div className="flex flex-col items-center text-center">
            <img src={avatar} alt={name} className="h-40 w-40 rounded-full object-cover ring-4 ring-white/10" />
            <h1 className="mt-6 font-heading text-4xl text-white">{name}</h1>
            <p className="mt-2 text-white/60">{location}</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ label: "All Posts", value: stats.postCount ?? 0 }, { label: "Followers", value: stats.followerCount ?? 0 }, { label: "Following", value: stats.followingCount ?? 0 }].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-[#091321]/75 px-3 py-4 text-center">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-[linear-gradient(135deg,#5eead4,#7dd3fc)] px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Edit profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/messages")}
              className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white"
            >
              Message inbox
            </button>
          </div>

          <p className="mt-6 text-sm leading-7 text-center text-white/58">{bio}</p>
        </div>

        <div className="rounded-[2.4rem] border border-white/10 bg-[#0a1524] p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Profile management</p>
          <h2 className="mt-4 font-heading text-4xl text-white">Shape the public side of your account.</h2>
          <p className="mt-4 text-sm text-white/60">
            {status || (isEditing ? "Update your details here, then save them to refresh the public card." : "Click Edit profile on the left card whenever you want to change your bio, image, or location.")}
          </p>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Display name" className={inputClass} />
              <input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Location" className={inputClass} />
              <label className={`${inputClass} flex cursor-pointer items-center justify-between gap-3`}>
                <span className="truncate text-white/70">{form.avatarUrl ? "Change profile image" : "Choose profile image from your device"}</span>
                <input type="file" accept="image/*" onChange={(event) => void handleAvatarChange(event)} className="hidden" />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">Browse</span>
              </label>
              <textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} rows="5" placeholder="Bio" className={inputClass} />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                  Save profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: user?.name ?? "",
                      bio: user?.bio ?? "",
                      location: user?.location ?? "",
                      avatarUrl: user?.avatarUrl ?? "",
                    });
                    setIsEditing(false);
                  }}
                  className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm leading-7 text-white/60">
                Your public card now keeps the bio read-only until you intentionally enter edit mode. That keeps the profile flow cleaner and avoids accidental changes.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
