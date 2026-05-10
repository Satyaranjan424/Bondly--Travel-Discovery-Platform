import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

export function MemoriesPage() {
  const { token } = useAuth();
  const [memories, setMemories] = useState([]);
  const [status, setStatus] = useState("Loading memories...");

  useEffect(() => {
    const controller = new AbortController();
    api
      .getMemories(token, controller.signal)
      .then((response) => {
        const nextMemories = Array.isArray(response.memories) ? response.memories : [];
        setMemories(nextMemories);
        setStatus(nextMemories.length ? "" : "You have not uploaded any memories yet.");
      })
      .catch((error) => setStatus(error.message));

    return () => controller.abort();
  }, [token]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Memories</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Your travel gallery.</h1>
        <p className="mt-4 text-sm text-white/60">{status || "Stories, photos, and trip covers you uploaded are shown here."}</p>
      </section>

      <section className="mt-8 columns-1 gap-4 sm:columns-2 xl:columns-3">
        {memories.map((item) => (
          <article key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)]">
            <img src={item.imageUrl} alt={item.caption} className="w-full object-cover" />
            <div className="p-4">
              <p className="font-semibold text-white">{item.caption}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{item.source}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
