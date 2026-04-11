import { Link } from "react-router-dom";

export function TripCard({ trip, featured = false }) {
  return (
    <article className={`group overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))] shadow-[0_24px_90px_rgba(7,12,20,0.45)] transition duration-300 hover:-translate-y-1 hover:border-[var(--aqua)]/45 ${featured ? "lg:grid lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
      <div className="relative overflow-hidden">
        <img src={trip.coverImage} alt={trip.title} className={`w-full object-cover transition duration-500 group-hover:scale-[1.04] ${featured ? "h-full min-h-[28rem]" : "h-72"}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.08),rgba(8,17,31,0.82))]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <div className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/80 backdrop-blur-lg">{trip.travelMonth || "Any season"}</div>
          <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/80 backdrop-blur-lg">{trip.visibility || "public"}</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="rounded-[1.8rem] border border-white/12 bg-[rgba(4,10,20,0.62)] p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <img src={trip.author?.avatarUrl} alt={trip.author?.name} className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/10" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{trip.author?.name || "Traveler"}</p>
                <p className="truncate text-xs uppercase tracking-[0.18em] text-white/48">{trip.city}, {trip.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          {trip.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">{tag}</span>
          ))}
        </div>

        <div>
          <h3 className="font-heading text-3xl leading-tight text-white">{trip.title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/66">{trip.summary}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[1.3rem] border border-white/8 bg-[linear-gradient(180deg,rgba(94,234,212,0.10),rgba(255,255,255,0.03))] p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Budget</p>
            <p className="mt-2 font-medium text-white">{trip.budget}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/8 bg-[linear-gradient(180deg,rgba(251,191,36,0.10),rgba(255,255,255,0.03))] p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Days</p>
            <p className="mt-2 font-medium text-white">{trip.durationDays}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/8 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(255,255,255,0.03))] p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Rating</p>
            <p className="mt-2 font-medium text-white">{trip.averageRating ? `${trip.averageRating}/5` : "New"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-[1.6rem] border border-white/8 bg-[#07111e] p-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Saves</p>
            <p className="mt-2 text-sm text-white">{trip.saveCount ?? 0} collected</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Highlights</p>
            <p className="mt-2 line-clamp-2 text-sm text-white/70">{trip.highlights?.slice(0, 2).join(" • ") || "Fresh route"}</p>
          </div>
        </div>

        <Link to={`/trips/${trip.id}`} className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[var(--aqua-soft)]">
          Open story
        </Link>
      </div>
    </article>
  );
}
