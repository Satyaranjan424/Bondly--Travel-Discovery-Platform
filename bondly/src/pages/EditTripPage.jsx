import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TripForm } from "../components/TripForm.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { api } from "../lib/api.js";
import { tripToFormValues } from "../lib/trips.js";

export function EditTripPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { token } = useAuth();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("Loading trip...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api
      .getTrip(tripId, { token, signal: controller.signal })
      .then((response) => {
        setForm(tripToFormValues(response.trip));
        setStatus("");
      })
      .catch((error) => setStatus(error.message));
    return () => controller.abort();
  }, [token, tripId]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.updateTrip(token, tripId, form);
      navigate(`/trips/${response.trip.id}`, {
        state: {
          notice: "Trip updated successfully.",
        },
      });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Edit trip</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Refine the details and keep your trip page sharp.</h1>
        <p className="mt-4 text-sm text-white/60">{status || "The edit route maps to the trip update endpoint."}</p>
        <div className="mt-8">
          {form ? <TripForm value={form} onChange={setForm} onSubmit={handleSubmit} submitLabel="Save changes" isSubmitting={isSubmitting} /> : null}
        </div>
      </section>
    </main>
  );
}

