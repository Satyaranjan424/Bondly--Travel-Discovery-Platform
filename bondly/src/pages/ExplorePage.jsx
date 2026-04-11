import { useDeferredValue, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { SectionIntro } from "../components/SectionIntro.jsx";
import { TripCard } from "../components/TripCard.jsx";
import { editorialCollections, quickFilters } from "../lib/content.js";

export function ExplorePage() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("Loading trips...");

  useEffect(() => {
    const controller = new AbortController();

    api
      .getExploreTrips({ query: deferredSearch, token, signal: controller.signal })
      .then((response) => {
        setTrips(response.trips);
        setStatus(response.trips.length ? "" : "No public trips matched this search.");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setStatus(error.message);
        }
      });

    return () => controller.abort();
  }, [deferredSearch, token]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <div className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 sm:p-8">
        <SectionIntro
          eyebrow="Explore"
          title="Search destinations, budgets, moods, and public stories."
          body="The feed responds to the API search endpoint, while the layout adds quick filters, editorial accents, and social-style trip cards so the page feels full even before a huge dataset exists."
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try Kyoto, nature, coast, food..."
          className="mt-8 w-full rounded-[1.5rem] border border-white/10 bg-[#081423] px-5 py-4 text-white outline-none placeholder:text-white/30"
        />
        <div className="mt-5 flex flex-wrap gap-2">
          {quickFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSearch(item)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72 transition hover:border-[var(--aqua)]/50 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {status ? <div className="mt-8 text-sm text-white/60">{status}</div> : null}

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {editorialCollections.map((item) => (
          <article key={item.title} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.28em] text-white/48">Travel mood</p>
              <h3 className="mt-10 font-heading text-3xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/63">{item.caption}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {trips.map((trip, index) => (
          <TripCard key={trip.id} trip={trip} featured={index === 0 && !deferredSearch} />
        ))}
      </div>
    </main>
  );
}
