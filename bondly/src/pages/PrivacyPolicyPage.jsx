const policySections = [
  {
    title: "Information we collect",
    body:
      "Bondly stores the details you choose to share with us, including your account information, profile details, trips, photos, stories, comments, likes, and saved posts. We also keep basic session data so your sign-in stays secure.",
  },
  {
    title: "How we use your data",
    body:
      "We use your information to publish your travel content, personalize the feed, support social interactions, and improve the product experience across discovery, publishing, and saved content.",
  },
  {
    title: "Public and private content",
    body:
      "Trips marked public can appear in the Bondly feed and can be viewed by other users. Trips marked private stay outside the public feed. Profile details such as your display name, avatar, bio, and location can appear wherever your public content is shown.",
  },
  {
    title: "Likes, comments, and saves",
    body:
      "Social actions are connected to your account so Bondly can show accurate counts and activity. Likes, comments, and saves are tracked separately and are used only for the feature they belong to.",
  },
  {
    title: "Images and uploads",
    body:
      "When you upload profile images, story images, or trip covers, Bondly stores that content so it can be displayed back to you and to the users who are allowed to view it. Please avoid uploading sensitive personal documents.",
  },
  {
    title: "Your choices",
    body:
      "You can update your profile, remove trips you created, and control whether a trip is public or private. You can also remove saved items from your account whenever you no longer want them in your collection.",
  },
];

export function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
      <section className="rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--aqua)]">Privacy policy</p>
        <h1 className="mt-4 font-heading text-5xl text-white">How Bondly handles user information.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62">
          This page explains the information Bondly uses to run the travel platform and how it appears across profiles, trips, stories, and social features.
        </p>

        <div className="mt-10 grid gap-5">
          {policySections.map((section) => (
            <article key={section.title} className="rounded-[1.8rem] border border-white/8 bg-[#081321] p-6">
              <h2 className="font-heading text-3xl text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.8rem] border border-[var(--aqua)]/18 bg-[linear-gradient(135deg,rgba(94,234,212,0.12),rgba(139,92,246,0.1))] p-6">
          <h2 className="font-heading text-3xl text-white">Policy updates</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            As Bondly grows, this page can be updated to reflect new product features. Any important privacy changes should be published here so users can review them before sharing new content.
          </p>
        </div>
      </section>
    </main>
  );
}
