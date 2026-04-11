export function SectionIntro({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-4xl leading-tight text-white sm:text-5xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-white/68">{body}</p> : null}
    </div>
  );
}
