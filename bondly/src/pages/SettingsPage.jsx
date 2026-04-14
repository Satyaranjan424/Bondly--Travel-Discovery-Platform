const settingsSections = [
  {
    title: "Account visibility",
    body:
      "Use your profile details thoughtfully because your display name, avatar, location, and public trip content can appear across the Bondly feed and public profile pages.",
  },
  {
    title: "Publishing preferences",
    body:
      "Before publishing a trip, review whether it should be public or private. Public trips appear in discovery and can receive likes, comments, and saves from other travelers.",
  },
  {
    title: "Content safety",
    body:
      "Upload only photos and stories you have permission to share. Avoid posting personal documents, payment details, or private contact information in images or captions.",
  },
  {
    title: "Session and sign-in",
    body:
      "Bondly keeps a secure session so you can move between profile, publishing, and saved content without signing in again on every page. Logging out clears that active session.",
  },
];

export function SettingsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Settings</p>
        <h1 className="mt-4 font-heading text-5xl text-white">Manage the way your Bondly account works.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62">
          These settings notes explain how your profile, trips, uploads, and sessions behave inside Bondly so you can keep your account organized and your public content intentional.
        </p>

        <div className="mt-10 grid gap-5">
          {settingsSections.map((section) => (
            <article key={section.title} className="rounded-[1.8rem] border border-white/8 bg-[#081321] p-6">
              <h2 className="font-heading text-3xl text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
