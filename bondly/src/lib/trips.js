export const emptyTripForm = {
  title: "",
  summary: "",
  coverImage: "",
  city: "",
  country: "",
  travelMonth: "",
  budget: "$$",
  durationDays: 4,
  visibility: "public",
  tags: "",
  highlights: "",
  itinerary: [
    { day: "Day 1", title: "", description: "" },
    { day: "Day 2", title: "", description: "" },
    { day: "Day 3", title: "", description: "" },
  ],
};

export function tripToFormValues(trip) {
  return {
    title: trip.title ?? "",
    summary: trip.summary ?? "",
    coverImage: trip.coverImage ?? "",
    city: trip.city ?? "",
    country: trip.country ?? "",
    travelMonth: trip.travelMonth ?? "",
    budget: trip.budget ?? "$$",
    durationDays: trip.durationDays ?? 4,
    visibility: trip.visibility ?? "public",
    tags: Array.isArray(trip.tags) ? trip.tags.join(", ") : "",
    highlights: Array.isArray(trip.highlights) ? trip.highlights.join(", ") : "",
    itinerary: Array.isArray(trip.itinerary) && trip.itinerary.length ? trip.itinerary : emptyTripForm.itinerary,
  };
}
