import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { SectionIntro } from "../components/SectionIntro.jsx";
import { TripCard } from "../components/TripCard.jsx";
import { destinationSpotlight, editorialCollections, platformMoments, travelPulse } from "../lib/content.js";

export function HomePage() {
  const [featuredTrips, setFeaturedTrips] = useState([]);

  useEffect(() => {
    api.getExploreTrips().then((response) => setFeaturedTrips(response.trips.slice(0, 4))).catch(() => null);
  }, []);

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-18 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <div className="space-y-8">
            <SectionIntro
              eyebrow="Modern discovery"
              title="A travel platform that feels more like a living magazine than a dashboard."
              body="Bondly now blends creator tools with richer visual storytelling: animated gradients, social-style cards, editorial blocks, destination spotlights, and API-connected discovery."
            />
            <div className="flex flex-wrap gap-3">
              <Link to="/explore" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                Explore journeys
              </Link>
              <Link to="/publish" className="rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-semibold text-white">
                Publish a trip
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {travelPulse.map((item) => (
                <div key={item.label} className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
                  <p className="font-heading text-3xl text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.16),rgba(255,255,255,0.04),rgba(94,234,212,0.10))] p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Travel feed energy</p>
              <h3 className="mt-4 font-heading text-3xl text-white">Discover, save, publish, react.</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">Use the public feed like a travel zine, then switch into a dashboard that feels much more like a serious creator workspace.</p>
            </div>
            <div className="min-h-[22rem] rounded-[2rem] border border-white/10 bg-[url('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-5">
              <div className="flex h-full items-end">
                <div className="rounded-[1.6rem] bg-[rgba(8,19,33,0.72)] p-4 backdrop-blur-lg">
                  <p className="text-sm uppercase tracking-[0.24em] text-[var(--aqua)]">Immersive UI</p>
                  <p className="mt-2 max-w-xs text-sm leading-7 text-white/70">Layered gradients, social cards, editorial strips, motion orbs, and brighter accent colors make the experience feel alive.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
              {platformMoments.map((item, index) => (
                <div key={item.title} className={`rounded-[2rem] border border-white/10 p-5 ${index === 0 ? "bg-[linear-gradient(135deg,rgba(94,234,212,0.14),rgba(255,255,255,0.04))]" : index === 1 ? "bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(255,255,255,0.04))]" : "bg-[linear-gradient(135deg,rgba(251,113,133,0.16),rgba(255,255,255,0.04))]"}`}>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/48">Feature</p>
                  <h4 className="mt-3 font-heading text-2xl text-white">{item.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-white/63">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Destination radar</p>
            <h3 className="mt-4 font-heading text-4xl text-white">Give the homepage a pulse.</h3>
            <div className="mt-6 grid gap-3">
              {destinationSpotlight.map((item) => (
                <div key={item.place} className="rounded-[1.4rem] border border-white/8 bg-[#07111e] px-4 py-4">
                  <p className="font-semibold text-white">{item.place}</p>
                  <p className="mt-2 text-sm text-white/58">{item.vibe}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {editorialCollections.map((item) => (
              <article key={item.title} className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/52">Collection</p>
                  <h3 className="mt-16 font-heading text-3xl text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/63">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Featured Trips
          </h2>

          <Link to="/explore" className="text-white/60 hover:text-white">
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 hover:scale-[1.02] transition"
            >
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 text-center">
        <div className="bg-gradient-to-r from-cyan-400/10 to-purple-500/10 border border-white/10 rounded-3xl p-10">
          <h2 className="text-3xl font-semibold">
            Ready to share your journey?
          </h2>

          <p className="mt-4 text-white/60">
            Publish your trip and inspire others with your travel stories.
          </p>

          <Link
            to="/publish"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Create Trip
          </Link>
        </div>
      </section>
      
    </main>
  );
}