import { Link } from "react-router-dom";

import { BookmarkIcon, CommentIcon, HeartIcon } from "./social/SocialIcons.jsx";

const budgetLabels = {
  $: "Under $800",
  $$: "$800-$2,000",
  $$$: "$2,000-$4,000",
  $$$$: "$4,000+",
};

export function TripCard({ trip }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-[#0f172a] border border-white/10 hover:border-cyan-400/40 transition duration-300 hover:-translate-y-1">

      {/* 🔥 IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-black/40 backdrop-blur px-3 py-1 text-xs rounded-full text-white">
            {trip.travelMonth || "Any time"}
          </span>
        </div>

        {/* Bottom Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white leading-tight">
            {trip.title}
          </h3>
          <p className="text-sm text-white/70">
            {trip.city}, {trip.country}
          </p>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-4 space-y-4">

        {/* Summary */}
        <p className="text-sm text-white/60 line-clamp-2">
          {trip.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {trip.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-white/70">
          <span>💰 {budgetLabels[trip.budget] || trip.budget}</span>
          <span>📅 {trip.durationDays} days</span>
          <span>⭐ {trip.averageRating || "New"}</span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">

          <div className="flex gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5"><HeartIcon className="h-4 w-4" /> {trip.likeCount ?? 0}</span>
            <span className="flex items-center gap-1.5"><CommentIcon className="h-4 w-4" /> {trip.commentCount ?? trip.comments?.length ?? 0}</span>
            <span className="flex items-center gap-1.5"><BookmarkIcon className="h-4 w-4" /> {trip.saveCount ?? 0}</span>
          </div>

          <Link
            to={`/trips/${trip.id}`}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View →
          </Link>
        </div>

      </div>
    </article>
  );
}
