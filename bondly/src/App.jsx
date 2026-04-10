import { startTransition, useCallback, useEffect, useMemo, useState } from "react";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";
const baseTrip = {
  title: "",
  summary: "",
  coverImage: "",
  city: "",
  country: "",
  travelMonth: "",
  budget: "$$",
  durationDays: 4,
  visibility: "public",
  tags: "",
  highlights: "",
  itinerary: [
    { day: "Day 1", title: "", description: "" },
    { day: "Day 2", title: "", description: "" },
  ],
};
const baseProfile = { name: "", bio: "", location: "", avatarUrl: "" };
const baseAuth = { name: "", email: "", password: "" };

async function apiFetch(path, options = {}, token) {
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

const inputClass = "rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none";
const cardClass = "rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[var(--soft-shadow)]";
const ratingLabel = (value) => (value ? `${value}/5` : "New");

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("bondly-token") || "");
  const [user, setUser] = useState(null);
  const [explore, setExplore] = useState([]);
  const [mine, setMine] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [auth, setAuth] = useState(baseAuth);
  const [profile, setProfile] = useState(baseProfile);
  const [trip, setTrip] = useState(baseTrip);
  const [comment, setComment] = useState("");
  const [review, setReview] = useState({ rating: 5, body: "" });
  const [photo, setPhoto] = useState({ imageUrl: "", caption: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => explore.find((item) => item.id === selectedId) ?? explore[0] ?? null, [explore, selectedId]);

  useEffect(() => {
    localStorage.setItem("bondly-token", token);
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => startTransition(() => setSearch(searchInput)), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [exploreRes, meRes, mineRes] = await Promise.all([
        apiFetch(`/explore${search ? `?q=${encodeURIComponent(search)}` : ""}`, {}, token || undefined),
        token ? apiFetch("/auth/me", {}, token) : Promise.resolve({ user: null }),
        token ? apiFetch("/trips/mine", {}, token) : Promise.resolve({ trips: [] }),
      ]);
      setExplore(exploreRes.trips ?? []);
      setSelectedId((current) => current || exploreRes.trips?.[0]?.id || "");
      setMine(mineRes.trips ?? []);
      setUser(meRes.user ?? null);
      if (meRes.user) setProfile({ name: meRes.user.name ?? "", bio: meRes.user.bio ?? "", location: meRes.user.location ?? "", avatarUrl: meRes.user.avatarUrl ?? "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, [search, token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const mergeTrip = (nextTrip) => {
    setExplore((current) => current.map((item) => (item.id === nextTrip.id ? nextTrip : item)));
    setMine((current) => current.some((item) => item.id === nextTrip.id) ? current.map((item) => (item.id === nextTrip.id ? nextTrip : item)) : user && nextTrip.author?.id === user.id ? [nextTrip, ...current] : current);
    setSelectedId(nextTrip.id);
  };

  const onAuth = async (event) => {
    event.preventDefault();
    try {
      const payload = authMode === "login" ? { email: auth.email, password: auth.password } : auth;
      const res = await apiFetch(authMode === "login" ? "/auth/login" : "/auth/signup", { method: "POST", body: JSON.stringify(payload) });
      setToken(res.token); setUser(res.user); setAuth(baseAuth); setStatus({ type: "success", message: authMode === "login" ? "Welcome back." : "Account created." });
      await loadData();
    } catch (error) { setStatus({ type: "error", message: error.message }); }
  };

  const onProfile = async (event) => {
    event.preventDefault();
    try { const res = await apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(profile) }, token); setUser(res.user); setStatus({ type: "success", message: "Profile updated." }); } catch (error) { setStatus({ type: "error", message: error.message }); }
  };

  const onTrip = async (event) => {
    event.preventDefault();
    try { const res = await apiFetch("/trips", { method: "POST", body: JSON.stringify(trip) }, token); setExplore((current) => [res.trip, ...current]); setMine((current) => [res.trip, ...current]); setSelectedId(res.trip.id); setTrip(baseTrip); setStatus({ type: "success", message: "Trip published." }); } catch (error) { setStatus({ type: "error", message: error.message }); }
  };

  const postAction = async (path, payload, reset, message) => {
    try { const res = await apiFetch(path, { method: "POST", body: JSON.stringify(payload) }, token); mergeTrip(res.trip); reset(); setStatus({ type: "success", message }); } catch (error) { setStatus({ type: "error", message: error.message }); }
  };

  const onLogout = async () => {
    try { if (token) await apiFetch("/auth/logout", { method: "POST" }, token); } catch (error) { console.warn(error); }
    setToken(""); setUser(null); setMine([]); localStorage.removeItem("bondly-token"); setStatus({ type: "success", message: "Signed out." });
  };

  return (
    <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(244,201,93,0.22),_transparent_28%),linear-gradient(135deg,_#0b3b36,_#114b44_58%,_#1f766b)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-heading text-sm uppercase tracking-[0.35em] text-white/70">Bondly</p>
              <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">Travel discovery for curious planners.</h1>
              <p className="mt-4 max-w-2xl text-white/75">Sign up, publish trips, search destinations, save itineraries, and contribute reviews, comments, and photos in one responsive travel platform.</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-full border border-white/20 px-4 py-2 text-white/85">{user ? user.name : "Demo: maya@bondly.app / Password123!"}</span>
              {user ? <button type="button" onClick={onLogout} className="rounded-full bg-white px-4 py-2 font-semibold text-[var(--pine)]">Log out</button> : null}
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Auth + profiles", "Trips + itineraries", "Explore + community"].map((item) => <div key={item} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur"><p className="font-heading text-2xl">{item}</p><p className="mt-2 text-sm text-white/70">Built for desktop and mobile layouts.</p></div>)}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">
        {status.message ? <div className={`rounded-2xl border px-4 py-3 text-sm ${status.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{status.message}</div> : null}

        <section className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-8">
            <section className={cardClass}>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">Authentication</p><h2 className="mt-2 font-heading text-3xl">Get travelers signed in</h2></div><div className="rounded-full bg-[var(--sand)] p-1"><button type="button" onClick={() => setAuthMode("login")} className={`rounded-full px-4 py-2 ${authMode === "login" ? "bg-[var(--pine)] text-white" : "text-[var(--muted)]"}`}>Log in</button><button type="button" onClick={() => setAuthMode("signup")} className={`rounded-full px-4 py-2 ${authMode === "signup" ? "bg-[var(--pine)] text-white" : "text-[var(--muted)]"}`}>Sign up</button></div></div>
              <form onSubmit={onAuth} className="mt-5 grid gap-3">
                {authMode === "signup" ? <input value={auth.name} onChange={(e) => setAuth((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className={inputClass} /> : null}
                <input value={auth.email} onChange={(e) => setAuth((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className={inputClass} />
                <input type="password" value={auth.password} onChange={(e) => setAuth((s) => ({ ...s, password: e.target.value }))} placeholder="Password" className={inputClass} />
                <button type="submit" className="rounded-2xl bg-[var(--gold)] px-4 py-3 font-semibold text-[var(--pine-deep)]">{authMode === "login" ? "Access Bondly" : "Create account"}</button>
              </form>
            </section>

            <section className={cardClass}>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">Profile management</p>
              <h2 className="mt-2 font-heading text-3xl">Traveler profiles</h2>
              <form onSubmit={onProfile} className="mt-5 grid gap-3">
                <input value={profile.name} onChange={(e) => setProfile((s) => ({ ...s, name: e.target.value }))} placeholder="Display name" className={inputClass} disabled={!user} />
                <input value={profile.location} onChange={(e) => setProfile((s) => ({ ...s, location: e.target.value }))} placeholder="Location" className={inputClass} disabled={!user} />
                <input value={profile.avatarUrl} onChange={(e) => setProfile((s) => ({ ...s, avatarUrl: e.target.value }))} placeholder="Avatar URL" className={inputClass} disabled={!user} />
                <textarea value={profile.bio} onChange={(e) => setProfile((s) => ({ ...s, bio: e.target.value }))} placeholder="Bio" rows="4" className={inputClass} disabled={!user} />
                <button type="submit" disabled={!user} className="rounded-2xl bg-[var(--pine)] px-4 py-3 font-semibold text-white disabled:opacity-50">Save profile</button>
              </form>
            </section>

            <section className={cardClass}>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">Trip creation</p>
              <h2 className="mt-2 font-heading text-3xl">Publish itineraries</h2>
              <form onSubmit={onTrip} className="mt-5 grid gap-3">
                <input value={trip.title} onChange={(e) => setTrip((s) => ({ ...s, title: e.target.value }))} placeholder="Trip title" className={inputClass} disabled={!user} />
                <textarea value={trip.summary} onChange={(e) => setTrip((s) => ({ ...s, summary: e.target.value }))} placeholder="Trip summary" rows="3" className={inputClass} disabled={!user} />
                <div className="grid gap-3 sm:grid-cols-2"><input value={trip.city} onChange={(e) => setTrip((s) => ({ ...s, city: e.target.value }))} placeholder="City" className={inputClass} disabled={!user} /><input value={trip.country} onChange={(e) => setTrip((s) => ({ ...s, country: e.target.value }))} placeholder="Country" className={inputClass} disabled={!user} /></div>
                <input value={trip.coverImage} onChange={(e) => setTrip((s) => ({ ...s, coverImage: e.target.value }))} placeholder="Cover image URL" className={inputClass} disabled={!user} />
                <div className="grid gap-3 sm:grid-cols-3"><input value={trip.travelMonth} onChange={(e) => setTrip((s) => ({ ...s, travelMonth: e.target.value }))} placeholder="Best month" className={inputClass} disabled={!user} /><input value={trip.durationDays} onChange={(e) => setTrip((s) => ({ ...s, durationDays: e.target.value }))} placeholder="Days" className={inputClass} disabled={!user} /><select value={trip.budget} onChange={(e) => setTrip((s) => ({ ...s, budget: e.target.value }))} className={inputClass} disabled={!user}><option>$</option><option>$$</option><option>$$$</option><option>$$$$</option></select></div>
                <input value={trip.tags} onChange={(e) => setTrip((s) => ({ ...s, tags: e.target.value }))} placeholder="Tags, comma separated" className={inputClass} disabled={!user} />
                <input value={trip.highlights} onChange={(e) => setTrip((s) => ({ ...s, highlights: e.target.value }))} placeholder="Highlights, comma separated" className={inputClass} disabled={!user} />
                {trip.itinerary.map((item, index) => <div key={item.day} className="rounded-2xl border border-[var(--line)] p-4"><p className="text-sm font-semibold text-[var(--teal)]">{item.day}</p><input value={item.title} onChange={(e) => setTrip((s) => ({ ...s, itinerary: s.itinerary.map((entry, i) => i === index ? { ...entry, title: e.target.value } : entry) }))} placeholder="Stop title" className={`${inputClass} mt-3 w-full`} disabled={!user} /><textarea value={item.description} onChange={(e) => setTrip((s) => ({ ...s, itinerary: s.itinerary.map((entry, i) => i === index ? { ...entry, description: e.target.value } : entry) }))} placeholder="What happens this day?" rows="3" className={`${inputClass} mt-3 w-full`} disabled={!user} /></div>)}
                <button type="submit" disabled={!user} className="rounded-2xl bg-[var(--coral)] px-4 py-3 font-semibold text-white disabled:opacity-50">Publish trip</button>
              </form>
            </section>
          </div>
          <div className="space-y-8">
            <section className={cardClass}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">Explore functionality</p><h2 className="mt-2 font-heading text-3xl">Browse public trips</h2></div><p className="text-sm text-[var(--muted)]">{loading ? "Refreshing trips..." : `${explore.length} trips found`}</p></div>
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search Kyoto, beaches, food routes..." className={`${inputClass} mt-5 w-full bg-[var(--sand)]`} />
              <div className="mt-5 grid gap-4 lg:grid-cols-[0.44fr_0.56fr]">
                <div className="grid gap-3">{explore.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`rounded-[1.6rem] border p-3 text-left ${selected?.id === item.id ? "border-[var(--teal)] bg-[var(--foam)]" : "border-[var(--line)] bg-[var(--sand)]"}`}><div className="flex gap-3"><img src={item.coverImage} alt={item.title} className="h-20 w-20 rounded-2xl object-cover" /><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-[var(--muted)]">{item.city}, {item.country}</p><p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--teal)]">{item.budget} budget • {ratingLabel(item.averageRating)}</p></div></div></button>)}</div>
                {selected ? <article className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--sand)]"><img src={selected.coverImage} alt={selected.title} className="h-64 w-full object-cover" /><div className="space-y-5 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">{selected.city}, {selected.country}</p><h3 className="mt-2 font-heading text-3xl">{selected.title}</h3><p className="mt-2 text-[var(--muted)]">{selected.summary}</p></div><button type="button" onClick={() => postAction(`/trips/${selected.id}/save`, {}, () => {}, "Trip saved.")} disabled={!user} className="rounded-full bg-[var(--pine)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{selected.isSaved ? "Saved" : "Save trip"}</button></div><div className="flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1 text-sm text-[var(--muted)]">{tag}</span>)}</div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white p-4"><p className="text-sm text-[var(--muted)]">Duration</p><p className="mt-1 font-heading text-2xl">{selected.durationDays} days</p></div><div className="rounded-2xl bg-white p-4"><p className="text-sm text-[var(--muted)]">Saves</p><p className="mt-1 font-heading text-2xl">{selected.saveCount}</p></div><div className="rounded-2xl bg-white p-4"><p className="text-sm text-[var(--muted)]">Rating</p><p className="mt-1 font-heading text-2xl">{ratingLabel(selected.averageRating)}</p></div></div><div><h4 className="font-heading text-2xl">Highlights</h4><div className="mt-3 grid gap-2">{selected.highlights.map((item) => <div key={item} className="rounded-2xl bg-white px-4 py-3 text-[var(--muted)]">{item}</div>)}</div></div><div><h4 className="font-heading text-2xl">Itinerary</h4><div className="mt-3 grid gap-3">{selected.itinerary.map((item) => <div key={`${item.day}-${item.title}`} className="rounded-2xl border border-[var(--line)] bg-white p-4"><p className="text-sm uppercase tracking-[0.2em] text-[var(--teal)]">{item.day}</p><p className="mt-2 font-semibold">{item.title}</p><p className="mt-2 text-[var(--muted)]">{item.description}</p></div>)}</div></div></div></article> : <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--sand)] p-8 text-[var(--muted)]">No trips match this search yet.</div>}
              </div>
            </section>

            <section className={cardClass}>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">User-generated content</p>
              <h2 className="mt-2 font-heading text-3xl">Reviews, comments, and photos</h2>
              {selected ? <div className="mt-5 grid gap-6 xl:grid-cols-3"><div className="space-y-4"><h3 className="font-heading text-2xl">Comments</h3><form onSubmit={(e) => { e.preventDefault(); postAction(`/trips/${selected.id}/comments`, { body: comment }, () => setComment(""), "Comment posted."); }} className="grid gap-3"><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share what stands out..." rows="4" className={inputClass} disabled={!user} /><button type="submit" disabled={!user} className="rounded-2xl bg-[var(--pine)] px-4 py-3 font-semibold text-white disabled:opacity-50">Post comment</button></form><div className="grid gap-3">{selected.comments.map((item) => <article key={item.id} className="rounded-2xl bg-[var(--sand)] p-4"><p className="font-semibold">{item.user.name}</p><p className="mt-2 text-[var(--muted)]">{item.body}</p></article>)}</div></div><div className="space-y-4"><h3 className="font-heading text-2xl">Reviews</h3><form onSubmit={(e) => { e.preventDefault(); postAction(`/trips/${selected.id}/reviews`, review, () => setReview({ rating: 5, body: "" }), "Review shared."); }} className="grid gap-3"><select value={review.rating} onChange={(e) => setReview((s) => ({ ...s, rating: Number(e.target.value) }))} className={inputClass} disabled={!user}>{[5,4,3,2,1].map((item) => <option key={item} value={item}>{item} stars</option>)}</select><textarea value={review.body} onChange={(e) => setReview((s) => ({ ...s, body: e.target.value }))} placeholder="What worked well?" rows="4" className={inputClass} disabled={!user} /><button type="submit" disabled={!user} className="rounded-2xl bg-[var(--gold)] px-4 py-3 font-semibold text-[var(--pine-deep)] disabled:opacity-50">Add review</button></form><div className="grid gap-3">{selected.reviews.map((item) => <article key={item.id} className="rounded-2xl bg-[var(--sand)] p-4"><p className="font-semibold">{item.user.name} • {item.rating}/5</p><p className="mt-2 text-[var(--muted)]">{item.body}</p></article>)}</div></div><div className="space-y-4"><h3 className="font-heading text-2xl">Photos</h3><form onSubmit={(e) => { e.preventDefault(); postAction(`/trips/${selected.id}/photos`, photo, () => setPhoto({ imageUrl: "", caption: "" }), "Photo added."); }} className="grid gap-3"><input value={photo.imageUrl} onChange={(e) => setPhoto((s) => ({ ...s, imageUrl: e.target.value }))} placeholder="Image URL" className={inputClass} disabled={!user} /><input value={photo.caption} onChange={(e) => setPhoto((s) => ({ ...s, caption: e.target.value }))} placeholder="Caption" className={inputClass} disabled={!user} /><button type="submit" disabled={!user} className="rounded-2xl bg-[var(--coral)] px-4 py-3 font-semibold text-white disabled:opacity-50">Add photo</button></form><div className="grid gap-3">{selected.photos.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl bg-[var(--sand)]"><img src={item.imageUrl} alt={item.caption || selected.title} className="h-40 w-full object-cover" /><div className="p-4"><p className="font-semibold">{item.user.name}</p><p className="mt-2 text-[var(--muted)]">{item.caption || "Shared a moment from the trip."}</p></div></article>)}</div></div></div> : null}
            </section>

            <section className={cardClass}>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--teal)]">Your dashboard</p>
              <h2 className="mt-2 font-heading text-3xl">Trips you’ve published</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">{mine.length ? mine.map((item) => <article key={item.id} className="overflow-hidden rounded-[1.6rem] bg-[var(--sand)]"><img src={item.coverImage} alt={item.title} className="h-44 w-full object-cover" /><div className="p-4"><p className="font-heading text-2xl">{item.title}</p><p className="mt-2 text-[var(--muted)]">{item.summary}</p></div></article>) : <div className="rounded-[1.6rem] border border-dashed border-[var(--line)] p-6 text-[var(--muted)]">Sign in and publish your first itinerary to see it here.</div>}</div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;




