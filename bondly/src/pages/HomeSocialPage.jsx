import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { TripCard } from "../components/TripCard.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { SocialLeftRail } from "../components/social/SocialLeftRail.jsx";
import { SocialRightRail } from "../components/social/SocialRightRail.jsx";
import { CommentIcon, DotsIcon, HeartIcon, MapPinIcon, PhotoIcon, PlusSmallIcon, ShareIcon, VideoIcon } from "../components/social/SocialIcons.jsx";

export function HomeSocialPage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const { homeMode = "dark" } = useOutletContext() || {};

  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [stories, setStories] = useState([]);
  const [people, setPeople] = useState([]);
  const [activity, setActivity] = useState([]);
  const [notice, setNotice] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [activeCommentTripId, setActiveCommentTripId] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [storyModal, setStoryModal] = useState({ open: false, mode: "create", story: null });
  const [storyForm, setStoryForm] = useState({ imageUrl: "", placeName: "", body: "" });

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    Promise.allSettled([
      api.getExploreTrips({ token, signal: controller.signal }),
      api.getStories({ token, signal: controller.signal }),
      api.getUsers({ token, signal: controller.signal }),
      api.getActivity({ token, signal: controller.signal }),
    ]).then((results) => {
      const [tripResult, storyResult, userResult, activityResult] = results;

      if (tripResult.status === "fulfilled") {
        setFeaturedTrips(tripResult.value.trips.slice(0, 12));
      } else {
        setFeaturedTrips([]);
      }

      if (storyResult.status === "fulfilled") {
        setStories(storyResult.value.stories);
      }

      if (userResult.status === "fulfilled") {
        setPeople(
          userResult.value.users.map((item) => ({
            to: `/users/${item.id}`,
            name: item.name,
            detail: item.location || item.bio || "Bondly traveler",
            active: true,
            avatar: item.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80",
          })),
        );
      }

      if (activityResult.status === "fulfilled") {
        setActivity(
          activityResult.value.activity.map((item) => ({
            id: item.id,
            kind: item.type === "review" ? "rating" : item.type,
            name: item.user?.name || "Traveler",
            status: item.message,
            time: formatRelativeTime(item.createdAt),
          })),
        );
      }

      setIsLoading(false);
    });

    return () => controller.abort();
  }, [token]);

  const trips = featuredTrips;

  const displayName = user?.name || "Traveler";
  const avatar = user?.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80";

  const isLightMode = homeMode === "light";

  const shellClass = isLightMode
    ? "bg-[linear-gradient(180deg,#dbeaf7_0%,#eef4fb_38%,#e9edf3_100%)] text-slate-900"
    : "bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.11),transparent_18%),radial-gradient(circle_at_84%_8%,rgba(139,92,246,0.18),transparent_22%),linear-gradient(180deg,#09111d_0%,#081321_38%,#050c18_100%)] text-white";

  const panelClass = isLightMode
    ? "border border-slate-200/80 bg-white/78 text-slate-900 shadow-[0_20px_56px_rgba(15,23,42,0.09)] backdrop-blur-xl"
    : "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-white shadow-[0_24px_70px_rgba(2,6,23,0.34)] backdrop-blur-xl";

  const softPanelClass = isLightMode ? "border border-slate-200/70 bg-slate-50/90" : "border border-white/8 bg-[#091321]/78";
  const mutedText = isLightMode ? "text-slate-500" : "text-white/58";
  const strongText = isLightMode ? "text-slate-900" : "text-white";

  function requireAuth() {
    if (isAuthenticated) return true;
    navigate("/auth", { state: { from: "/" } });
    return false;
  }

  function updateTripInFeed(nextTrip) {
    setFeaturedTrips((current) => current.map((trip) => (trip.id === nextTrip.id ? nextTrip : trip)));
  }

  async function handleLike(tripId) {
    if (!requireAuth()) return;
    const response = await api.likeTrip(token, tripId);
    updateTripInFeed(response.trip);
  }

  async function handleSave(tripId) {
    if (!requireAuth()) return;
    const response = await api.saveTrip(token, tripId);
    updateTripInFeed(response.trip);
  }

  async function handleCommentSubmit(tripId) {
    if (!requireAuth() || !commentBody.trim()) return;
    const response = await api.addComment(token, tripId, { body: commentBody });
    updateTripInFeed(response.trip);
    setCommentBody("");
    setActiveCommentTripId("");
  }

  async function handleDeleteTrip(tripId) {
    if (!requireAuth()) return;
    await api.deleteTrip(token, tripId);
    setFeaturedTrips((current) => current.filter((trip) => trip.id !== tripId));
  }

  async function handleCreateStory() {
    if (!requireAuth() || !storyForm.imageUrl) return;
    const response = await api.createStory(token, storyForm);
    setStories(response.stories);
    setStoryModal({ open: false, mode: "create", story: null });
    setStoryForm({ imageUrl: "", placeName: "", body: "" });
    setNotice("Story shared.");
  }

  async function handleStoryFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setStoryForm((current) => ({ ...current, imageUrl: String(reader.result || "") }));
    reader.readAsDataURL(file);
  }

  return (
    <main className={`relative z-10 transition-colors duration-300 ${shellClass}`}>
      {!isLoading && (
        <section className="mx-auto max-w-[96rem] px-3 py-5 sm:px-4 lg:px-6 lg:py-6">
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
          <SocialLeftRail avatar={avatar} displayName={displayName} isLightMode={isLightMode} />

          <div className="min-w-0">
            <div className="mx-auto max-w-[42rem] space-y-5">
              <section className={`rounded-[1.75rem] p-4 ${panelClass}`}>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={displayName} className="h-11 w-11 rounded-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setStoryModal({ open: true, mode: "create", story: null })}
                    className={`flex-1 rounded-full px-5 py-3 text-left text-[1.05rem] transition ${isLightMode ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-white/6 text-white/48 hover:bg-white/10"}`}
                  >
                    What's on your mind, {displayName.split(" ")[0]}?
                  </button>
                </div>
                <div className={`mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-sm font-medium ${isLightMode ? "border-slate-200 text-slate-600" : "border-white/10 text-white/70"}`}>
                  <ActionPill tone="text-[#f3425f]" icon={<VideoIcon />}>Live</ActionPill>
                  <ActionPill tone="text-[#45bd62]" icon={<PhotoIcon />}>Photo</ActionPill>
                  <ActionPill tone="text-[#f7b928]" icon={<MapPinIcon />}>Plan</ActionPill>
                </div>
              </section>

              <section className={`overflow-hidden rounded-[1.75rem] p-4 ${panelClass}`}>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button type="button" onClick={() => setStoryModal({ open: true, mode: "create", story: null })} className={`relative min-h-[12rem] min-w-[8.7rem] overflow-hidden rounded-[1.5rem] text-left ${softPanelClass}`}>
                    <img src={avatar} alt={displayName} className="h-24 w-full object-cover" />
                    <div className="absolute left-1/2 top-[5.1rem] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border-4 border-[#091321] bg-[linear-gradient(135deg,#5eead4,#8b5cf6)] text-slate-950 shadow-lg">
                      <PlusSmallIcon />
                    </div>
                    <div className="p-4 pt-8 text-center">
                      <p className={`text-sm font-semibold ${strongText}`}>Create story</p>
                    </div>
                  </button>

                  {stories.map((story) => (
                    <button key={story.id} type="button" onClick={() => setStoryModal({ open: true, mode: "view", story })} className="relative min-h-[12rem] min-w-[8.7rem] overflow-hidden rounded-[1.5rem] text-left shadow-sm">
                      <img src={story.imageUrl} alt={story.placeName || story.user.name} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.78))]" />
                      <div className="relative flex h-full flex-col justify-between p-3 text-white">
                        <img src={story.user.avatarUrl || avatar} alt={story.user.name} className="h-11 w-11 rounded-full border-4 border-[var(--aqua)] object-cover" />
                        <div>
                          <p className="text-sm font-semibold">{story.placeName || story.user.name}</p>
                          <p className="mt-1 text-xs text-white/80">{story.user.name}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {notice ? <p className={`text-sm ${mutedText}`}>{notice}</p> : null}

              <section className="space-y-5">
                {trips.map((trip) => (
                  <div key={trip.id} className="space-y-3">
                    <div className={`flex items-center justify-between rounded-[1.5rem] px-4 py-3 ${panelClass}`}>
                      <Link to={trip.author?.id ? `/users/${trip.author.id}` : "/profile"} className="flex items-center gap-3">
                        <img src={trip.author?.avatarUrl || avatar} alt={trip.author?.name || "Traveler"} className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <p className={`font-semibold ${strongText}`}>{trip.author?.name || "Traveler"}</p>
                          <p className={`text-sm ${mutedText}`}>{trip.city}, {trip.country} • curated trip story</p>
                        </div>
                      </Link>
                      <details className="relative">
                        <summary className={`list-none rounded-full px-3 py-2 transition ${isLightMode ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700" : "text-white/45 hover:bg-white/8 hover:text-white"}`}>
                          <DotsIcon />
                        </summary>
                        <div className={`absolute right-0 top-12 z-20 w-36 rounded-2xl p-2 ${panelClass}`}>
                          <Link to={`/trips/${trip.id}`} className={`block rounded-xl px-3 py-2 text-sm ${isLightMode ? "hover:bg-slate-100" : "hover:bg-white/8"}`}>View</Link>
                          {trip.author?.id === user?.id ? <Link to={`/trips/${trip.id}/edit`} className={`block rounded-xl px-3 py-2 text-sm ${isLightMode ? "hover:bg-slate-100" : "hover:bg-white/8"}`}>Edit</Link> : null}
                          {trip.author?.id === user?.id ? <button type="button" onClick={() => void handleDeleteTrip(trip.id)} className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${isLightMode ? "hover:bg-slate-100" : "hover:bg-white/8"}`}>Delete</button> : null}
                        </div>
                      </details>
                    </div>

                    <TripCard trip={trip} />

                    <div className={`grid grid-cols-3 gap-2 rounded-[1.5rem] p-2 ${panelClass}`}>
                      <button type="button" onClick={() => void handleLike(trip.id)} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-inherit transition hover:bg-white/8">
                        <HeartIcon />
                        Like {trip.likeCount ?? 0}
                      </button>
                      <button type="button" onClick={() => setActiveCommentTripId((current) => current === trip.id ? "" : trip.id)} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-inherit transition hover:bg-white/8">
                        <CommentIcon />
                        Comment {trip.commentCount ?? trip.comments?.length ?? 0}
                      </button>
                      <button type="button" onClick={() => void handleSave(trip.id)} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-inherit transition hover:bg-white/8">
                        <ShareIcon />
                        Save {trip.saveCount ?? 0}
                      </button>
                    </div>

                    {activeCommentTripId === trip.id ? (
                      <div className={`rounded-[1.5rem] p-4 ${panelClass}`}>
                        <textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} rows="3" placeholder="Write a comment..." className={`w-full rounded-[1.2rem] border px-4 py-3 outline-none ${isLightMode ? "border-slate-200 bg-slate-50 text-slate-900" : "border-white/10 bg-white/6 text-white"}`} />
                        <div className="mt-3 flex justify-end">
                          <button type="button" onClick={() => void handleCommentSubmit(trip.id)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Post</button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </section>
            </div>
          </div>

          <SocialRightRail isLightMode={isLightMode} users={people} activity={activity} />
        </div>
      </section>
      )}

      {storyModal.open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 sm:p-4">
          <div className={`w-full max-w-lg max-h-[75vh] overflow-y-auto rounded-[2rem] p-5 ${panelClass}`}>
            {storyModal.mode === "create" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-semibold ${strongText}`}>Create story</h2>
                  <button
                    type="button"
                    onClick={() => setStoryModal({ open: false, mode: "create", story: null })}
                    className={mutedText}
                  >
                    Close
                  </button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleStoryFileChange}
                  className={`w-full rounded-[1.2rem] border px-4 py-3 ${
                    isLightMode ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/6"
                  }`}
                />

                <input
                  value={storyForm.placeName}
                  onChange={(event) =>
                    setStoryForm((current) => ({ ...current, placeName: event.target.value }))
                  }
                  placeholder="Place name"
                  className={`w-full rounded-[1.2rem] border px-4 py-3 ${
                    isLightMode
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-white/10 bg-white/6 text-white"
                  }`}
                />

                <textarea
                  value={storyForm.body}
                  onChange={(event) =>
                    setStoryForm((current) => ({ ...current, body: event.target.value }))
                  }
                  rows="4"
                  placeholder="Say something about this moment"
                  className={`w-full rounded-[1.2rem] border px-4 py-3 ${
                    isLightMode
                      ? "border-slate-200 bg-slate-50 text-slate-900"
                      : "border-white/10 bg-white/6 text-white"
                  }`}
                />

                {storyForm.imageUrl ? (
                  <img
                    src={storyForm.imageUrl}
                    alt="Story preview"
                    className="max-h-[40vh] rounded-[1.5rem] object-cover"
                  />
                ) : null}

                <button
                  type="button"
                  onClick={() => void handleCreateStory()}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  Share story
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-2xl font-semibold ${strongText}`}>
                      {storyModal.story?.placeName || storyModal.story?.user?.name}
                    </h2>
                    <p className={mutedText}>{storyModal.story?.user?.name}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStoryModal({ open: false, mode: "create", story: null })}
                    className={mutedText}
                  >
                    Close
                  </button>
                </div>

                <img
                  src={storyModal.story?.imageUrl}
                  alt={storyModal.story?.placeName || "Story"}
                  className="w-full max-h-[100vh] rounded-[1.5rem] object-cover"
                />

                <p className={mutedText}>{storyModal.story?.body}</p>
              </div>
            )}
          </div>
        </div>
      ): null}
    </main>
  );
}

function ActionPill({ children, icon, tone }) {
  return (
    <button type="button" className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-white/8 ${tone}`}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

function formatRelativeTime(value) {
  const date = new Date(value);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}