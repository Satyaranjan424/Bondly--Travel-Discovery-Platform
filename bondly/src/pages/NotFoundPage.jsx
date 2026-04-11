import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-5 py-20 sm:px-8 lg:px-10">
      <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">404</p>
      <h1 className="font-heading text-6xl text-white">That route drifted off the map.</h1>
      <p className="max-w-xl text-base leading-8 text-white/62">The page you tried to reach is not part of the current travel flow. Head back to explore or return to the homepage.</p>
      <div className="flex gap-3">
        <Link to="/" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
          Go home
        </Link>
        <Link to="/explore" className="rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-semibold text-white">
          Explore trips
        </Link>
      </div>
    </main>
  );
}
