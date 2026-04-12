import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { TripCard } from "../components/TripCard.jsx";

export function UserProfilePage() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("Loading profile...");

  useEffect(() => {
    const controller = new AbortController();
    api
      .getUserProfile(userId, { token, signal: controller.signal })
      .then((response) => {
        setProfile(response);
        setStatus("");
      })
      .catch((error) => setStatus(error.message));

    return () => controller.abort();
  }, [token, userId]);

  if (!profile) {
    return <main className="mx-auto max-w-7xl px-5 py-14 text-white/60 sm:px-8 lg:px-10">{status}</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
          <img src={profile.user.avatarUrl} alt={profile.user.name} className="h-40 w-40 rounded-[2rem] object-cover" />
          <h1 className="mt-5 font-heading text-4xl text-white">{profile.user.name}</h1>
          <p className="mt-3 text-white/60">{profile.user.location || "Traveler"}</p>
          <p className="mt-6 text-sm leading-7 text-white/58">{profile.user.bio || "No bio yet."}</p>
          <Link to="/profile" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            Back to my profile
          </Link>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2.4rem] border border-white/10 bg-[#0a1524] p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Public profile</p>
            <h2 className="mt-4 font-heading text-4xl text-white">Stories and trips from {profile.user.name}.</h2>
            <div className="mt-6 flex gap-3 overflow-x-auto">
              {profile.stories.map((story) => (
                <article key={story.id} className="relative min-h-[12rem] min-w-[9rem] overflow-hidden rounded-[1.5rem]">
                  <img src={story.imageUrl} alt={story.placeName || story.user.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.78))]" />
                  <div className="relative flex h-full items-end p-3 text-white">
                    <div>
                      <p className="font-semibold">{story.placeName || story.user.name}</p>
                      <p className="text-sm text-white/75">{story.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {profile.trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
