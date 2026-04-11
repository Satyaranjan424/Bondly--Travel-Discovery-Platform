import { rightRailUsers } from "./socialData.js";
import { BookmarkPulseIcon, CommentIcon, ProfileCardIcon, StarIcon } from "./SocialIcons.jsx";

const activityFeed = [
  { name: "Priya Sharma", status: "commented on your Kerala backwater story", time: "12m", kind: "comment" },
  { name: "Rahul Verma", status: "rated your Ladakh plan 4.9", time: "35m", kind: "rating" },
  { name: "Ananya Das", status: "updated her profile and followed you", time: "1h", kind: "profile" },
  { name: "Ishaan Patel", status: "saved your Ahmedabad food trail", time: "2h", kind: "save" },
];

export function SocialRightRail({ isLightMode }) {
  const panelClass = isLightMode
    ? "border border-slate-200/80 bg-white/78 text-slate-900 shadow-[0_20px_56px_rgba(15,23,42,0.09)] backdrop-blur-xl"
    : "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-white shadow-[0_24px_70px_rgba(2,6,23,0.34)] backdrop-blur-xl";
  const softPanelClass = isLightMode ? "border border-slate-200/70 bg-slate-50/90" : "border border-white/8 bg-[#091321]/78";
  const mutedText = isLightMode ? "text-slate-500" : "text-white/58";
  const strongText = isLightMode ? "text-slate-900" : "text-white";
  const hoverSurface = isLightMode ? "hover:bg-slate-100" : "hover:bg-white/6";

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <section className={`rounded-[1.75rem] p-5 ${panelClass}`}>
          <p className={`text-lg font-semibold ${strongText}`}>People</p>
          <div className="mt-4 space-y-2">
            {rightRailUsers.map((item) => (
              <button key={item.name} type="button" className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition ${hoverSurface}`}>
                <div className="relative">
                  <img src={item.avatar} alt={item.name} className="h-11 w-11 rounded-full object-cover" />
                  {item.active ? <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#31a24c]" /> : null}
                </div>
                <div className="min-w-0">
                  <p className={`truncate font-medium ${strongText}`}>{item.name}</p>
                  <p className={`truncate text-sm ${mutedText}`}>{item.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className={`rounded-[1.75rem] p-5 ${panelClass}`}>
          <p className={`text-lg font-semibold ${strongText}`}>Activity</p>
          <div className="mt-4 space-y-3">
            {activityFeed.map((item) => (
              <article key={`${item.name}-${item.time}`} className={`rounded-2xl p-3 ${softPanelClass}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 grid h-10 w-10 place-items-center rounded-full ${item.kind === "comment" ? "bg-[linear-gradient(135deg,rgba(94,234,212,0.24),rgba(94,234,212,0.08))] text-[var(--aqua)]" : item.kind === "rating" ? "bg-[linear-gradient(135deg,rgba(251,191,36,0.24),rgba(251,191,36,0.08))] text-[var(--gold)]" : item.kind === "profile" ? "bg-[linear-gradient(135deg,rgba(139,92,246,0.24),rgba(139,92,246,0.08))] text-[var(--violet)]" : "bg-[linear-gradient(135deg,rgba(244,114,182,0.24),rgba(244,114,182,0.08))] text-[var(--pink)]"}`}>
                    {item.kind === "comment" ? <CommentIcon /> : item.kind === "rating" ? <StarIcon /> : item.kind === "profile" ? <ProfileCardIcon /> : <BookmarkPulseIcon />}
                  </div>
                  <div>
                    <p className={`text-sm ${mutedText}`}>
                      <span className={`font-semibold ${strongText}`}>{item.name}</span> {item.status}
                    </p>
                    <p className={`mt-1 text-xs font-medium uppercase tracking-[0.18em] ${mutedText}`}>{item.time}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
