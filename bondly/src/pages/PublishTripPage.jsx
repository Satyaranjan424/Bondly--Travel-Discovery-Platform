import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TripForm } from "../components/TripForm.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../hooks/useToast.jsx";
import { api } from "../lib/api.js";
import { emptyTripForm } from "../lib/trips.js";

export function PublishTripPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyTripForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.createTrip(token, form);
      showToast({ type: "publish", message: "Your trip is now live on Bondly." });
      navigate(`/trips/${response.trip.id}`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Publish</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Create a trip page that feels ready for the public feed.</h1>
        <p className="mt-4 text-sm text-white/60">{status || "Every field here maps to the Hono trip creation endpoint."}</p>
        <div className="mt-8">
          <TripForm value={form} onChange={setForm} onSubmit={handleSubmit} submitLabel="Publish trip" isSubmitting={isSubmitting} />
        </div>
      </section>
    </main>
  );
}
