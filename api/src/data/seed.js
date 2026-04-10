const now = new Date().toISOString();

export const seedUsers = [
  {
    id: "user-maya",
    name: "Maya Thompson",
    email: "maya@bondly.app",
    password: "Password123!",
    bio: "Designer and slow-travel curator who loves coastal train routes.",
    location: "Lisbon, Portugal",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    createdAt: now,
  },
  {
    id: "user-alex",
    name: "Alex Rivera",
    email: "alex@bondly.app",
    password: "Password123!",
    bio: "Weekend escape hunter collecting mountain towns and food markets.",
    location: "Austin, USA",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    createdAt: now,
  },
];

export const seedTrips = [
  {
    id: "trip-kyoto",
    authorId: "user-maya",
    title: "Kyoto Temples & Tea Alleys",
    summary: "A five-day blend of sunrise shrines, tea houses, and design-forward stays.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    city: "Kyoto",
    country: "Japan",
    travelMonth: "October",
    budget: "$$$",
    durationDays: 5,
    visibility: "public",
    tags: ["culture", "food", "slow travel"],
    highlights: ["Fushimi Inari at dawn", "Nishiki Market tasting route", "Arashiyama bamboo walk"],
    itinerary: [
      { day: "Day 1", title: "Arrival + Gion", description: "Settle into Higashiyama and wander Gion after dinner." },
      { day: "Day 2", title: "Temple Morning", description: "Early visit to Fushimi Inari, tea tasting, and riverside dinner." },
      { day: "Day 3", title: "Arashiyama Escape", description: "Bamboo grove, monkey park, and sunset train ride." },
    ],
    createdAt: now,
  },
  {
    id: "trip-cape-town",
    authorId: "user-alex",
    title: "Cape Town Coastal Weekender",
    summary: "Beaches, vineyards, and a flexible itinerary for a bright, social long weekend.",
    coverImage: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    city: "Cape Town",
    country: "South Africa",
    travelMonth: "March",
    budget: "$$",
    durationDays: 4,
    visibility: "public",
    tags: ["weekender", "nature", "food"],
    highlights: ["Chapman's Peak drive", "Camps Bay sunset", "Stellenbosch tasting stop"],
    itinerary: [
      { day: "Day 1", title: "City Reset", description: "Check in, V&A Waterfront lunch, and sunset from Signal Hill." },
      { day: "Day 2", title: "Peninsula Loop", description: "Drive to Cape Point with beach and seafood stops." },
      { day: "Day 3", title: "Wine + Design", description: "Vineyards in the morning and Kloof Street in the evening." },
    ],
    createdAt: now,
  },
];

export const seedComments = [
  {
    id: "comment-1",
    tripId: "trip-kyoto",
    userId: "user-alex",
    body: "This pacing is perfect. Saving it for autumn next year.",
    createdAt: now,
  },
];

export const seedReviews = [
  {
    id: "review-1",
    tripId: "trip-kyoto",
    userId: "user-alex",
    rating: 5,
    body: "The itinerary feels polished and realistic. Great balance of iconic and quiet spots.",
    createdAt: now,
  },
];

export const seedPhotos = [
  {
    id: "photo-1",
    tripId: "trip-cape-town",
    userId: "user-maya",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    caption: "Golden hour over the Atlantic.",
    createdAt: now,
  },
];

export const seedSavedTrips = [
  {
    userId: "user-maya",
    tripId: "trip-cape-town",
    createdAt: now,
  },
];
