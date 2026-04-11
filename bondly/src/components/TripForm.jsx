const inputClass = "w-full rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-white outline-none placeholder:text-white/30";

const budgetOptions = [
  { value: "$", label: "$ • Budget under $800" },
  { value: "$$", label: "$$ • Balanced $800-$2,000" },
  { value: "$$$", label: "$$$ • Premium $2,000-$4,000" },
  { value: "$$$$", label: "$$$$ • Luxury $4,000+" },
];

export function TripForm({ value, onChange, onSubmit, submitLabel, isSubmitting = false }) {
  const updateField = (field, nextValue) => onChange((current) => ({ ...current, [field]: nextValue }));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input value={value.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Trip title" className={inputClass} />
        <input value={value.coverImage} onChange={(event) => updateField("coverImage", event.target.value)} placeholder="Cover image URL" className={inputClass} />
      </div>
      <textarea value={value.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="Write the trip story" rows="4" className={inputClass} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input value={value.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City" className={inputClass} />
        <input value={value.country} onChange={(event) => updateField("country", event.target.value)} placeholder="Country" className={inputClass} />
        <input value={value.travelMonth} onChange={(event) => updateField("travelMonth", event.target.value)} placeholder="Travel month" className={inputClass} />
        <input value={value.durationDays} onChange={(event) => updateField("durationDays", event.target.value)} placeholder="Duration" className={inputClass} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <select value={value.budget} onChange={(event) => updateField("budget", event.target.value)} className={inputClass}>
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        <select value={value.visibility} onChange={(event) => updateField("visibility", event.target.value)} className={inputClass}>
          <option value="public" className="bg-slate-900">Public</option>
          <option value="private" className="bg-slate-900">Private</option>
        </select>
        <input value={value.tags} onChange={(event) => updateField("tags", event.target.value)} placeholder="Tags, comma separated" className={inputClass} />
      </div>
      <input value={value.highlights} onChange={(event) => updateField("highlights", event.target.value)} placeholder="Highlights, comma separated" className={inputClass} />
      <div className="grid gap-4 xl:grid-cols-3">
        {value.itinerary.map((item, index) => (
          <div key={`${item.day}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--aqua)]">{item.day}</p>
            <input
              value={item.title}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  itinerary: current.itinerary.map((entry, entryIndex) =>
                    entryIndex === index ? { ...entry, title: event.target.value } : entry,
                  ),
                }))
              }
              placeholder="Stop title"
              className={`${inputClass} mt-3`}
            />
            <textarea
              value={item.description}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  itinerary: current.itinerary.map((entry, entryIndex) =>
                    entryIndex === index ? { ...entry, description: event.target.value } : entry,
                  ),
                }))
              }
              placeholder="What happens?"
              rows="4"
              className={`${inputClass} mt-3`}
            />
          </div>
        ))}
      </div>
      <button type="submit" disabled={isSubmitting} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
