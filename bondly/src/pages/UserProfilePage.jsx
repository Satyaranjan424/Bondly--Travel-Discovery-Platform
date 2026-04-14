import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../hooks/useToast.jsx";
import { TripCard } from "../components/TripCard.jsx";

export function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { token, user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("Loading profile...");
  const [isFollowingBusy, setIsFollowingBusy] = useState(false);

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

  async function handleFollowToggle() {
    if (!isAuthenticated || !profile || isFollowingBusy || user?.id === profile.user.id) return;
    setIsFollowingBusy(true);
    try {
      const response = await api.toggleFollow(token, profile.user.id);
      setProfile((current) => current ? { ...current, stats: { ...current.stats, ...response.stats } } : current);
      showToast({ type: response.following ? "follow" : "unfollow", message: response.following ? `You are now following ${profile.user.name}.` : `You unfollowed ${profile.user.name}.` });
    } finally {
      setIsFollowingBusy(false);
    }
  }

  if (!profile) {
    return <main className="mx-auto max-w-7xl px-5 py-14 text-white/60 sm:px-8 lg:px-10">{status}</main>;
  }

  const isOwnProfile = user?.id === profile.user.id;
  const stats = profile.stats || {};

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8">
          <div className="flex flex-col items-center text-center">
            <img src={profile.user.avatarUrl} alt={profile.user.name} className="h-40 w-40 rounded-full object-cover ring-4 ring-white/10" />
            <h1 className="mt-6 font-heading text-4xl text-white">{profile.user.name}</h1>
            <p className="mt-2 text-white/60">{profile.user.location || "Traveler"}</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ label: "All Posts", value: stats.postCount ?? 0 }, { label: "Followers", value: stats.followerCount ?? 0 }, { label: "Following", value: stats.followingCount ?? 0 }].map((item) => (
              <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-[#091321]/78 px-3 py-4 text-center">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">{item.label}</p>
              </div>
            ))}
          </div>

          {!isOwnProfile ? (
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => void handleFollowToggle()}
                disabled={isFollowingBusy}
                className={`w-full rounded-full px-5 py-3 text-sm font-semibold transition ${stats.isFollowing ? "border border-white/14 bg-white/6 text-white" : "bg-[linear-gradient(135deg,#5eead4,#8b5cf6)] text-slate-950"}`}
              >
                {stats.isFollowing ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/messages?userId=${profile.user.id}`)}
                className="w-full rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-semibold text-white"
              >
                Message
              </button>
            </div>
          ) : (
            <Link to="/profile" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Back to my profile
            </Link>
          )}

          <p className="mt-6 text-center text-sm leading-7 text-white/58">{profile.user.bio || "No bio yet."}</p>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2.4rem] border border-white/10 bg-[#0a1524] p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Public profile</p>
            <h2 className="mt-4 font-heading text-4xl text-white">Stories and trips from {profile.user.name}.</h2>
            <p className="mt-4 text-sm text-white/58">
              {stats.isFollowedBy && !isOwnProfile ? `${profile.user.name} follows you too.` : "Fresh stories, memories, and travel posts update here in real time."}
            </p>
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
