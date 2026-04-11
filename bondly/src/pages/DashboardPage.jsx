import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

export function DashboardPage() {
  const { token, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("Loading your trips...");

  useEffect(() => {
    const controller = new AbortController();
    api
      .getMyTrips(token, controller.signal)
      .then((response) => {
        setTrips(response.trips);
        setStatus(response.trips.length ? "" : "You have not published any trips yet.");
      })
      .catch((error) => setStatus(error.message));

    return () => controller.abort();
  }, [token]);

  async function handleDelete(tripId) {
    try {
      await api.deleteTrip(token, tripId);
      setTrips((current) => current.filter((trip) => trip.id !== tripId));
      setStatus("Trip deleted.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.5rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Dashboard</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Welcome back, {user?.name}.</h1>
        <p className="mt-4 text-base leading-8 text-white/62">Manage your published trips, jump into edits, and keep the portfolio side of Bondly polished.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/publish" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            Publish another trip
          </Link>
          <Link to="/profile" className="rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-semibold text-white">
            Edit profile
          </Link>
        </div>
      </section>

      <p className="mt-6 text-sm text-white/55">{status}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {trips.map((trip) => (
          <article key={trip.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)]">
            <img src={trip.coverImage} alt={trip.title} className="h-60 w-full object-cover" />
            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--aqua)]">
                  {trip.city}, {trip.country}
                </p>
                <h2 className="mt-3 font-heading text-3xl text-white">{trip.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{trip.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to={`/trips/${trip.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                  View
                </Link>
                <Link to={`/trips/${trip.id}/edit`} className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white">
                  Edit
                </Link>
                <button type="button" onClick={() => void handleDelete(trip.id)} className="rounded-full border border-rose-400/25 px-4 py-2 text-sm font-semibold text-rose-200">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
