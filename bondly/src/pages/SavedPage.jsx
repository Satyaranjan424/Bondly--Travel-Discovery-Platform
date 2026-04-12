import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { TripCard } from "../components/TripCard.jsx";

export function SavedPage() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("Loading saved trips...");

  useEffect(() => {
    const controller = new AbortController();
    api
      .getSavedTrips(token, controller.signal)
      .then((response) => {
        setTrips(response.trips);
        setStatus(response.trips.length ? "" : "You have not saved any trips yet.");
      })
      .catch((error) => setStatus(error.message));

    return () => controller.abort();
  }, [token]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Saved</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Your saved posts.</h1>
        <p className="mt-4 text-sm text-white/60">{status || "Trips you saved from the feed are collected here."}</p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </main>
  );
}
