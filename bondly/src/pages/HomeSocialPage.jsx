import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { TripCard } from "../components/TripCard.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { SocialLeftRail } from "../components/social/SocialLeftRail.jsx";
import { SocialRightRail } from "../components/social/SocialRightRail.jsx";
import { CommentIcon, DotsIcon, HeartIcon, MapPinIcon, PhotoIcon, PlusSmallIcon, ShareIcon, VideoIcon } from "../components/social/SocialIcons.jsx";

const quickStories = [
  { title: "Goa getaway", author: "Saanvi", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80" },
  { title: "Seoul lights", author: "Rohit", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
  { title: "Bali sunrise", author: "Aditi", image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=900&q=80" },
  { title: "Jaipur color", author: "Kunal", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80" },
];

const fallbackTrips = [
  {
    id: "fallback-1",
    title: "Weekend in Pondicherry",
    summary: "Colonial streets, sea-facing cafes, and a soft slow-travel route for people who want a pretty city break.",
    coverImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    city: "Pondicherry",
    country: "India",
    travelMonth: "October",
    visibility: "public",
    tags: ["coastal", "food", "slow travel"],
    budget: "$220",
    durationDays: 3,
    averageRating: 4.8,
    saveCount: 126,
    highlights: ["Rock Beach sunrise", "French Quarter cafes", "Auroville day ride"],
    author: {
      name: "Bondly Studio",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80",
    },
  },
  {
    id: "fallback-2",
    title: "Monsoon Munnar Escape",
    summary: "Tea estates, cloud-wrapped roads, and a cinematic route built for couples and content creators.",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    city: "Munnar",
    country: "India",
    travelMonth: "July",
    visibility: "public",
    tags: ["mountains", "rain", "scenic"],
    budget: "$310",
    durationDays: 4,
    averageRating: 4.9,
    saveCount: 204,
    highlights: ["Tea museum", "Top Station views", "Waterfall circuit"],
    author: {
      name: "Aarav Nanda",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
    },
  },
];

export function HomeSocialPage() {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const { user } = useAuth();
  const { homeMode = "dark" } = useOutletContext() || {};

  useEffect(() => {
    api
      .getExploreTrips()
      .then((response) => setFeaturedTrips(response.trips.slice(0, 6)))
      .catch(() => setFeaturedTrips(fallbackTrips));
  }, []);

  const trips = featuredTrips.length ? featuredTrips : fallbackTrips;
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

  return (
    <main className={`relative z-10 transition-colors duration-300 ${shellClass}`}>
      <section className="mx-auto max-w-[96rem] px-3 py-5 sm:px-4 lg:px-6 lg:py-6">
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
          <SocialLeftRail avatar={avatar} displayName={displayName} isLightMode={isLightMode} />

          <div className="min-w-0">
            <div className="mx-auto max-w-[42rem] space-y-5">
              <section className={`rounded-[1.75rem] p-4 ${panelClass}`}>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={displayName} className="h-11 w-11 rounded-full object-cover" />
                  <button type="button" className={`flex-1 rounded-full px-5 py-3 text-left text-[1.05rem] transition ${isLightMode ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-white/6 text-white/48 hover:bg-white/10"}`}>
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
                  <button type="button" className={`relative min-h-[12rem] min-w-[8.7rem] overflow-hidden rounded-[1.5rem] text-left ${softPanelClass}`}>
                    <img src={avatar} alt={displayName} className="h-24 w-full object-cover" />
                    <div className="absolute left-1/2 top-[5.1rem] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border-4 border-[#091321] bg-[linear-gradient(135deg,#5eead4,#8b5cf6)] text-slate-950 shadow-lg">
                      <PlusSmallIcon />
                    </div>
                    <div className="p-4 pt-8 text-center">
                      <p className={`text-sm font-semibold ${strongText}`}>Create story</p>
                    </div>
                  </button>

                  {quickStories.map((story) => (
                    <article key={story.title} className="relative min-h-[12rem] min-w-[8.7rem] overflow-hidden rounded-[1.5rem] shadow-sm">
                      <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.78))]" />
                      <div className="relative flex h-full flex-col justify-between p-3 text-white">
                        <div className="h-11 w-11 rounded-full border-4 border-[var(--aqua)] bg-white/25 backdrop-blur-sm" />
                        <div>
                          <p className="text-sm font-semibold">{story.title}</p>
                          <p className="mt-1 text-xs text-white/80">{story.author}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-5">
                {trips.map((trip) => (
                  <div key={trip.id} className="space-y-3">
                    <div className={`flex items-center justify-between rounded-[1.5rem] px-4 py-3 ${panelClass}`}>
                      <div className="flex items-center gap-3">
                        <img src={trip.author?.avatarUrl || avatar} alt={trip.author?.name || "Traveler"} className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <p className={`font-semibold ${strongText}`}>{trip.author?.name || "Traveler"}</p>
                          <p className={`text-sm ${mutedText}`}>{trip.city}, {trip.country} • curated trip story</p>
                        </div>
                      </div>
                      <button type="button" className={`rounded-full px-3 py-2 transition ${isLightMode ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700" : "text-white/45 hover:bg-white/8 hover:text-white"}`}>
                        <DotsIcon />
                      </button>
                    </div>

                    <TripCard trip={trip} />

                    <div className={`grid grid-cols-3 gap-2 rounded-[1.5rem] p-2 ${panelClass}`}>
                      <FeedButton icon={<HeartIcon />}>Like</FeedButton>
                      <FeedButton icon={<CommentIcon />}>Comment</FeedButton>
                      <Link to={`/trips/${trip.id}`} className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${isLightMode ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900" : "text-white/70 hover:bg-white/8 hover:text-white"}`}>
                        <ShareIcon />
                        Share
                      </Link>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>

          <SocialRightRail isLightMode={isLightMode} />
        </div>
      </section>
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

function FeedButton({ children, icon }) {
  return (
    <button type="button" className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-inherit transition hover:bg-white/8 hover:text-inherit">
      {icon}
      {children}
    </button>
  );
}
