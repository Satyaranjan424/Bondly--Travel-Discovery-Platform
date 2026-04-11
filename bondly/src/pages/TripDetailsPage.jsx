import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

const inputClass = "w-full rounded-[1.2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-white outline-none placeholder:text-white/30";

export function TripDetailsPage() {
  const { tripId } = useParams();
  const location = useLocation();
  const { token, isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState("Loading trip...");
  const [notice, setNotice] = useState(() => location.state?.notice || "");
  const [comment, setComment] = useState("");
  const [review, setReview] = useState({ rating: 5, body: "" });
  const [photo, setPhoto] = useState({ imageUrl: "", caption: "" });

  useEffect(() => {
    const controller = new AbortController();
    api
      .getTrip(tripId, { token, signal: controller.signal })
      .then((response) => {
        setTrip(response.trip);
        setMessage("");
      })
      .catch((error) => setMessage(error.message));
    return () => controller.abort();
  }, [token, tripId]);

  async function postAction(action, payload, successMessage, reset) {
    if (!isAuthenticated) {
      setNotice("");
      setMessage("Please sign in to interact with this trip.");
      return;
    }
    try {
      const response = await action(token, trip.id, payload);
      setTrip(response.trip);
      setNotice("");
      reset();
      setMessage(successMessage);
    } catch (error) {
      setNotice("");
      setMessage(error.message);
    }
  }

  if (!trip) {
    return <main className="mx-auto max-w-7xl px-5 py-14 text-white/60 sm:px-8 lg:px-10">{message}</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-[rgba(255,255,255,0.04)]">
        <img src={trip.coverImage} alt={trip.title} className="h-[22rem] w-full object-cover sm:h-[28rem]" />
        <div className="grid gap-8 p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">{trip.city}, {trip.country}</p>
            <h1 className="mt-4 font-heading text-5xl text-white">{trip.title}</h1>
            <p className="mt-5 text-base leading-8 text-white/66">{trip.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">{trip.tags.map((tag) => <span key={tag} className="rounded-full bg-white/8 px-3 py-1 text-sm text-white/65">{tag}</span>)}</div>
            <button type="button" onClick={() => void postAction(api.saveTrip, {}, trip.isSaved ? "Trip already saved." : "Trip saved.", () => {})} className="mt-7 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">{trip.isSaved ? "Saved" : "Save trip"}</button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">{[{ label: "Duration", value: `${trip.durationDays} days` }, { label: "Budget", value: trip.budget }, { label: "Rating", value: trip.averageRating ? `${trip.averageRating}/5` : "New" }].map((item) => <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-[#081321] p-5"><p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p><p className="mt-3 font-heading text-3xl text-white">{item.value}</p></div>)}</div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <h2 className="font-heading text-3xl text-white">Highlights</h2>
            <div className="mt-5 grid gap-3">{trip.highlights.map((item) => <div key={item} className="rounded-[1.4rem] border border-white/8 bg-[#081321] px-4 py-3 text-white/65">{item}</div>)}</div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <h2 className="font-heading text-3xl text-white">Trip gallery</h2>
            <div className="mt-5 grid gap-4">{trip.photos.map((item) => <article key={item.id} className="overflow-hidden rounded-[1.5rem] bg-[#081321]"><img src={item.imageUrl} alt={item.caption || trip.title} className="h-52 w-full object-cover" /><div className="p-4"><p className="font-semibold text-white">{item.user.name}</p><p className="mt-2 text-sm text-white/60">{item.caption || "Shared a photo from the trip."}</p></div></article>)}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <h2 className="font-heading text-3xl text-white">Itinerary</h2>
            <div className="mt-5 grid gap-4">{trip.itinerary.map((item) => <article key={`${item.day}-${item.title}`} className="rounded-[1.5rem] border border-white/8 bg-[#081321] p-5"><p className="text-xs uppercase tracking-[0.28em] text-[var(--aqua)]">{item.day}</p><h3 className="mt-3 font-semibold text-white">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/62">{item.description}</p></article>)}</div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="flex items-center justify-between gap-3"><h2 className="font-heading text-3xl text-white">Community</h2><p className="text-sm text-white/45">{notice || message}</p></div>
            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Comments</h3>
                <form onSubmit={(event) => { event.preventDefault(); void postAction(api.addComment, { body: comment }, "Comment posted.", () => setComment("")); }} className="space-y-3">
                  <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="4" placeholder="Share what stands out..." className={inputClass} />
                  <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Post</button>
                </form>
                <div className="grid gap-3">{trip.comments.map((item) => <article key={item.id} className="rounded-[1.3rem] bg-[#081321] p-4"><p className="font-semibold text-white">{item.user.name}</p><p className="mt-2 text-sm text-white/60">{item.body}</p></article>)}</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Reviews</h3>
                <form onSubmit={(event) => { event.preventDefault(); void postAction(api.addReview, review, "Review shared.", () => setReview({ rating: 5, body: "" })); }} className="space-y-3">
                  <select value={review.rating} onChange={(event) => setReview((current) => ({ ...current, rating: Number(event.target.value) }))} className={inputClass}>{[5, 4, 3, 2, 1].map((item) => <option key={item} value={item} className="bg-slate-900">{item} stars</option>)}</select>
                  <textarea value={review.body} onChange={(event) => setReview((current) => ({ ...current, body: event.target.value }))} rows="4" placeholder="Write a review" className={inputClass} />
                  <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Review</button>
                </form>
                <div className="grid gap-3">{trip.reviews.map((item) => <article key={item.id} className="rounded-[1.3rem] bg-[#081321] p-4"><p className="font-semibold text-white">{item.user.name} • {item.rating}/5</p><p className="mt-2 text-sm text-white/60">{item.body}</p></article>)}</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Add photo</h3>
                <form onSubmit={(event) => { event.preventDefault(); void postAction(api.addPhoto, photo, "Photo added.", () => setPhoto({ imageUrl: "", caption: "" })); }} className="space-y-3">
                  <input value={photo.imageUrl} onChange={(event) => setPhoto((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Image URL" className={inputClass} />
                  <input value={photo.caption} onChange={(event) => setPhoto((current) => ({ ...current, caption: event.target.value }))} placeholder="Caption" className={inputClass} />
                  <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Upload</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

