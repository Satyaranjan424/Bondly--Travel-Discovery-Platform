import { Pool } from "pg";
import { createPasswordHash } from "./security.js";
import { seedComments, seedPhotos, seedReviews, seedSavedTrips, seedStories, seedTripLikes, seedTrips, seedUsers } from "../data/seed.js";

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  bio: user.bio ?? "",
  location: user.location ?? "",
  avatarUrl: user.avatarUrl ?? user.avatar_url ?? "",
  createdAt: user.createdAt ?? user.created_at,
});

const averageRating = (reviews) => {
  if (!reviews.length) {
    return null;
  }

  return Number((reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1));
};

const buildActivityItem = ({ id, type, user, message, createdAt, tripId = null }) => ({
  id,
  type,
  user,
  message,
  createdAt,
  tripId,
});

class MemoryStore {
  constructor() {
    this.users = seedUsers.map((user) => ({
      ...user,
      passwordHash: createPasswordHash(user.password),
    }));
    this.trips = [...seedTrips];
    this.comments = [...seedComments];
    this.reviews = [...seedReviews];
    this.photos = [...seedPhotos];
    this.savedTrips = [...seedSavedTrips];
    this.tripLikes = [...seedTripLikes];
    this.stories = [...seedStories];
  }

  async health() {
    return { mode: "memory" };
  }

  async findUserByEmail(email) {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findUserById(id) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async createUser({ name, email, passwordHash }) {
    const user = {
      id: `user-${this.users.length + 1}`,
      name,
      email,
      passwordHash,
      bio: "",
      location: "",
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff`,
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(user);
    return user;
  }

  async updateUser(userId, updates) {
    const user = await this.findUserById(userId);

    if (!user) {
      return null;
    }

    Object.assign(user, updates);
    return user;
  }

  buildTrip(trip, currentUserId = null) {
    const author = this.users.find((user) => user.id === trip.authorId);
    const tripComments = this.comments
      .filter((comment) => comment.tripId === trip.id)
      .map((comment) => ({
        ...comment,
        user: normalizeUser(this.users.find((user) => user.id === comment.userId)),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const tripReviews = this.reviews
      .filter((review) => review.tripId === trip.id)
      .map((review) => ({
        ...review,
        user: normalizeUser(this.users.find((user) => user.id === review.userId)),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const tripPhotos = this.photos
      .filter((photo) => photo.tripId === trip.id)
      .map((photo) => ({
        ...photo,
        user: normalizeUser(this.users.find((user) => user.id === photo.userId)),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const saveCount = this.savedTrips.filter((entry) => entry.tripId === trip.id).length;
    const likeCount = this.tripLikes.filter((entry) => entry.tripId === trip.id).length;

    return {
      ...trip,
      author: normalizeUser(author),
      comments: tripComments,
      reviews: tripReviews,
      photos: tripPhotos,
      saveCount,
      likeCount,
      commentCount: tripComments.length,
      reviewCount: tripReviews.length,
      averageRating: averageRating(tripReviews),
      isSaved: currentUserId ? this.savedTrips.some((entry) => entry.tripId === trip.id && entry.userId === currentUserId) : false,
      isLiked: currentUserId ? this.tripLikes.some((entry) => entry.tripId === trip.id && entry.userId === currentUserId) : false,
    };
  }

  async getPublicTrips({ query = "", currentUserId = null } = {}) {
    const normalizedQuery = query.trim().toLowerCase();
    return this.trips
      .filter((trip) => trip.visibility === "public")
      .filter((trip) => {
        if (!normalizedQuery) {
          return true;
        }

        return [trip.title, trip.summary, trip.city, trip.country, ...(trip.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((trip) => this.buildTrip(trip, currentUserId));
  }

  async getTripById(tripId, currentUserId = null) {
    const trip = this.trips.find((entry) => entry.id === tripId) ?? null;
    return trip ? this.buildTrip(trip, currentUserId) : null;
  }

  async getUserTrips(userId) {
    return this.trips
      .filter((trip) => trip.authorId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((trip) => this.buildTrip(trip, userId));
  }

  async createTrip(userId, payload) {
    const trip = {
      id: `trip-${this.trips.length + 1}`,
      authorId: userId,
      title: payload.title,
      summary: payload.summary,
      coverImage: payload.coverImage,
      city: payload.city,
      country: payload.country,
      travelMonth: payload.travelMonth,
      budget: payload.budget,
      durationDays: Number(payload.durationDays),
      visibility: payload.visibility,
      tags: payload.tags,
      highlights: payload.highlights,
      itinerary: payload.itinerary,
      createdAt: new Date().toISOString(),
    };

    this.trips.unshift(trip);
    return this.buildTrip(trip, userId);
  }

  async saveTrip(userId, tripId) {
    const existing = this.savedTrips.find((entry) => entry.userId === userId && entry.tripId === tripId);
    if (!existing) {
      this.savedTrips.push({ userId, tripId, createdAt: new Date().toISOString() });
    }

    return this.getTripById(tripId, userId);
  }

  async addComment(userId, tripId, body) {
    const comment = {
      id: `comment-${this.comments.length + 1}`,
      tripId,
      userId,
      body,
      createdAt: new Date().toISOString(),
    };
    this.comments.unshift(comment);
    return this.getTripById(tripId, userId);
  }

  async addReview(userId, tripId, rating, body) {
    const review = {
      id: `review-${this.reviews.length + 1}`,
      tripId,
      userId,
      rating,
      body,
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(review);
    return this.getTripById(tripId, userId);
  }

  async addPhoto(userId, tripId, imageUrl, caption) {
    const photo = {
      id: `photo-${this.photos.length + 1}`,
      tripId,
      userId,
      imageUrl,
      caption,
      createdAt: new Date().toISOString(),
    };
    this.photos.unshift(photo);
    return this.getTripById(tripId, userId);
  }

  async toggleTripLike(userId, tripId) {
    const index = this.tripLikes.findIndex((entry) => entry.userId === userId && entry.tripId === tripId);

    if (index >= 0) {
      this.tripLikes.splice(index, 1);
    } else {
      this.tripLikes.push({ userId, tripId, createdAt: new Date().toISOString() });
    }

    return this.getTripById(tripId, userId);
  }

  async createStory(userId, { imageUrl, placeName = "", body = "" }) {
    const story = {
      id: `story-${this.stories.length + 1}`,
      userId,
      imageUrl,
      placeName,
      body,
      createdAt: new Date().toISOString(),
    };

    this.stories.unshift(story);
    return this.getStories(userId);
  }

  async getStories(currentUserId = null) {
    return this.stories
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((story) => ({
        ...story,
        user: normalizeUser(this.users.find((user) => user.id === story.userId)),
        isOwnStory: currentUserId ? story.userId === currentUserId : false,
      }));
  }

  async getSavedTrips(userId) {
    const savedTripIds = this.savedTrips.filter((entry) => entry.userId === userId).map((entry) => entry.tripId);
    return Promise.all(savedTripIds.map((tripId) => this.getTripById(tripId, userId))).then((items) => items.filter(Boolean));
  }

  async getMemories(userId) {
    const ownTrips = this.trips.filter((trip) => trip.authorId === userId);
    const tripMemories = ownTrips.map((trip) => ({
      id: `memory-trip-${trip.id}`,
      imageUrl: trip.coverImage,
      caption: trip.title,
      source: "trip",
      createdAt: trip.createdAt,
    }));
    const photoMemories = this.photos
      .filter((photo) => photo.userId === userId)
      .map((photo) => ({
        id: `memory-photo-${photo.id}`,
        imageUrl: photo.imageUrl,
        caption: photo.caption || "Trip photo",
        source: "photo",
        createdAt: photo.createdAt,
      }));
    const storyMemories = this.stories
      .filter((story) => story.userId === userId)
      .map((story) => ({
        id: `memory-story-${story.id}`,
        imageUrl: story.imageUrl,
        caption: story.placeName || story.body || "Story",
        source: "story",
        createdAt: story.createdAt,
      }));

    return [...storyMemories, ...photoMemories, ...tripMemories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAllUsers(currentUserId = null) {
    return this.users
      .filter((user) => !currentUserId || user.id !== currentUserId)
      .map((user) => normalizeUser(user));
  }

  async getActivity() {
    const items = [
      ...this.comments.map((comment) =>
        buildActivityItem({
          id: `comment-${comment.id}`,
          type: "comment",
          user: normalizeUser(this.users.find((user) => user.id === comment.userId)),
          message: comment.body,
          createdAt: comment.createdAt,
          tripId: comment.tripId,
        })),
      ...this.reviews.map((review) =>
        buildActivityItem({
          id: `review-${review.id}`,
          type: "review",
          user: normalizeUser(this.users.find((user) => user.id === review.userId)),
          message: `${review.rating}/5 • ${review.body}`,
          createdAt: review.createdAt,
          tripId: review.tripId,
        })),
      ...this.tripLikes.map((like) =>
        buildActivityItem({
          id: `like-${like.userId}-${like.tripId}`,
          type: "like",
          user: normalizeUser(this.users.find((user) => user.id === like.userId)),
          message: "liked a trip",
          createdAt: like.createdAt,
          tripId: like.tripId,
        })),
    ];

    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);
  }

  async getPublicProfile(userId, currentUserId = null) {
    const user = await this.findUserById(userId);
    if (!user) {
      return null;
    }

    return {
      user: normalizeUser(user),
      trips: await this.getUserTrips(userId),
      stories: await this.getStories(currentUserId).then((items) => items.filter((story) => story.userId === userId)),
      memories: await this.getMemories(userId),
    };
  }

  // ADD THIS INSIDE MemoryStore CLASS (before closing bracket)

  async updateTrip(userId, tripId, updates) {
    const trip = this.trips.find(
      (t) => t.id === tripId && t.authorId === userId
    );

    if (!trip) {
      return null;
    }

    Object.assign(trip, {
      title: updates.title ?? trip.title,
      summary: updates.summary ?? trip.summary,
      coverImage: updates.coverImage ?? trip.coverImage,
      city: updates.city ?? trip.city,
      country: updates.country ?? trip.country,
      travelMonth: updates.travelMonth ?? trip.travelMonth,
      budget: updates.budget ?? trip.budget,
      durationDays: updates.durationDays ?? trip.durationDays,
      visibility: updates.visibility ?? trip.visibility,
      tags: updates.tags ?? trip.tags,
      highlights: updates.highlights ?? trip.highlights,
      itinerary: updates.itinerary ?? trip.itinerary,
    });

    return this.buildTrip(trip, userId);
  }

  async deleteTrip(userId, tripId) {
    const index = this.trips.findIndex(
      (trip) => trip.id === tripId && trip.authorId === userId
    );

    if (index === -1) {
      return false;
    }

    this.trips.splice(index, 1);

    // Clean related data
    this.comments = this.comments.filter((c) => c.tripId !== tripId);
    this.reviews = this.reviews.filter((r) => r.tripId !== tripId);
    this.photos = this.photos.filter((p) => p.tripId !== tripId);
    this.savedTrips = this.savedTrips.filter((s) => s.tripId !== tripId);
    this.tripLikes = this.tripLikes.filter((l) => l.tripId !== tripId);

    return true;
  }
}

class PostgresStore {
  constructor(databaseUrl) {
    const isNeonConnection = /neon\.tech/i.test(databaseUrl);
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: isNeonConnection ? { rejectUnauthorized: false } : undefined,
    });
  }

  async health() {
    await this.pool.query("select 1");
    return { mode: "postgres" };
  }

  mapUser(row) {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      bio: row.bio,
      location: row.location,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
    };
  }

  async findUserByEmail(email) {
    const result = await this.pool.query("select * from users where lower(email) = lower($1) limit 1", [email]);
    return result.rows[0] ? this.mapUser(result.rows[0]) : null;
  }

  async findUserById(id) {
    const result = await this.pool.query("select * from users where id = $1 limit 1", [id]);
    return result.rows[0] ? this.mapUser(result.rows[0]) : null;
  }

  async createUser({ name, email, passwordHash }) {
    const result = await this.pool.query(
      "insert into users (name, email, password_hash, avatar_url) values ($1, $2, $3, $4) returning *",
      [name, email, passwordHash, `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff`],
    );

    return this.mapUser(result.rows[0]);
  }

  async updateUser(userId, updates) {
    const current = await this.findUserById(userId);
    if (!current) {
      return null;
    }

    const next = {
      name: updates.name ?? current.name,
      bio: updates.bio ?? current.bio,
      location: updates.location ?? current.location,
      avatarUrl: updates.avatarUrl ?? current.avatarUrl,
    };

    const result = await this.pool.query(
      "update users set name = $2, bio = $3, location = $4, avatar_url = $5 where id = $1 returning *",
      [userId, next.name, next.bio, next.location, next.avatarUrl],
    );

    return this.mapUser(result.rows[0]);
  }

  async buildTrip(row, currentUserId = null) {
    const trip = {
      id: row.id,
      authorId: row.author_id,
      title: row.title,
      summary: row.summary,
      coverImage: row.cover_image,
      city: row.city,
      country: row.country,
      travelMonth: row.travel_month,
      budget: row.budget,
      durationDays: row.duration_days,
      visibility: row.visibility,
      tags: row.tags ?? [],
      highlights: row.highlights ?? [],
      itinerary: row.itinerary ?? [],
      createdAt: row.created_at,
    };
    const author = await this.findUserById(trip.authorId);
    const [comments, reviews, photos, saves, likes] = await Promise.all([
      this.pool.query(
        "select c.*, u.id as user_id_ref, u.name, u.email, u.bio, u.location, u.avatar_url, u.created_at as user_created_at from comments c join users u on u.id = c.user_id where c.trip_id = $1 order by c.created_at desc",
        [trip.id],
      ),
      this.pool.query(
        "select r.*, u.id as user_id_ref, u.name, u.email, u.bio, u.location, u.avatar_url, u.created_at as user_created_at from reviews r join users u on u.id = r.user_id where r.trip_id = $1 order by r.created_at desc",
        [trip.id],
      ),
      this.pool.query(
        "select p.*, u.id as user_id_ref, u.name, u.email, u.bio, u.location, u.avatar_url, u.created_at as user_created_at from photos p join users u on u.id = p.user_id where p.trip_id = $1 order by p.created_at desc",
        [trip.id],
      ),
      this.pool.query("select user_id from saved_trips where trip_id = $1", [trip.id]),
      this.pool.query("select user_id from trip_likes where trip_id = $1", [trip.id]),
    ]);

    const mapJoinedUser = (rowValue) => ({
      id: rowValue.user_id_ref,
      name: rowValue.name,
      email: rowValue.email,
      bio: rowValue.bio,
      location: rowValue.location,
      avatarUrl: rowValue.avatar_url,
      createdAt: rowValue.user_created_at,
    });

    const reviewItems = reviews.rows.map((review) => ({
      id: review.id,
      tripId: review.trip_id,
      userId: review.user_id,
      rating: review.rating,
      body: review.body,
      createdAt: review.created_at,
      user: mapJoinedUser(review),
    }));

    return {
      ...trip,
      author: normalizeUser(author),
      comments: comments.rows.map((comment) => ({
        id: comment.id,
        tripId: comment.trip_id,
        userId: comment.user_id,
        body: comment.body,
        createdAt: comment.created_at,
        user: mapJoinedUser(comment),
      })),
      reviews: reviewItems,
      photos: photos.rows.map((photo) => ({
        id: photo.id,
        tripId: photo.trip_id,
        userId: photo.user_id,
        imageUrl: photo.image_url,
        caption: photo.caption,
        createdAt: photo.created_at,
        user: mapJoinedUser(photo),
      })),
      saveCount: saves.rows.length,
      likeCount: likes.rows.length,
      commentCount: comments.rows.length,
      reviewCount: reviewItems.length,
      averageRating: averageRating(reviewItems),
      isSaved: currentUserId ? saves.rows.some((entry) => entry.user_id === currentUserId) : false,
      isLiked: currentUserId ? likes.rows.some((entry) => entry.user_id === currentUserId) : false,
    };
  }

  async getPublicTrips({ query = "", currentUserId = null } = {}) {
    const normalizedQuery = `%${query.trim().toLowerCase()}%`;
    const result = await this.pool.query(
      `select * from trips
       where visibility = 'public'
       and (
         $1 = '%%'
         or lower(title) like $1
         or lower(summary) like $1
         or lower(city) like $1
         or lower(country) like $1
         or exists (
           select 1 from unnest(tags) as tag where lower(tag) like $1
         )
       )
       order by created_at desc`,
      [normalizedQuery],
    );

    return Promise.all(result.rows.map((row) => this.buildTrip(row, currentUserId)));
  }

  async getTripById(tripId, currentUserId = null) {
    const result = await this.pool.query("select * from trips where id = $1 limit 1", [tripId]);
    return result.rows[0] ? this.buildTrip(result.rows[0], currentUserId) : null;
  }

  async getUserTrips(userId) {
    const result = await this.pool.query("select * from trips where author_id = $1 order by created_at desc", [userId]);
    return Promise.all(result.rows.map((row) => this.buildTrip(row, userId)));
  }

  async createTrip(userId, payload) {
    const result = await this.pool.query(
      `insert into trips
        (author_id, title, summary, cover_image, city, country, travel_month, budget, duration_days, visibility, tags, highlights, itinerary)
       values
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
       returning *`,
      [
        userId,
        payload.title,
        payload.summary,
        payload.coverImage,
        payload.city,
        payload.country,
        payload.travelMonth,
        payload.budget,
        Number(payload.durationDays),
        payload.visibility,
        payload.tags,
        payload.highlights,
        JSON.stringify(payload.itinerary),
      ],
    );

    return this.buildTrip(result.rows[0], userId);
  }

  async saveTrip(userId, tripId) {
    await this.pool.query(
      "insert into saved_trips (user_id, trip_id) values ($1, $2) on conflict (user_id, trip_id) do nothing",
      [userId, tripId],
    );
    return this.getTripById(tripId, userId);
  }

  async addComment(userId, tripId, body) {
    await this.pool.query("insert into comments (trip_id, user_id, body) values ($1, $2, $3)", [tripId, userId, body]);
    return this.getTripById(tripId, userId);
  }

  async addReview(userId, tripId, rating, body) {
    await this.pool.query("insert into reviews (trip_id, user_id, rating, body) values ($1, $2, $3, $4)", [
      tripId,
      userId,
      rating,
      body,
    ]);
    return this.getTripById(tripId, userId);
  }

  async addPhoto(userId, tripId, imageUrl, caption) {
    await this.pool.query("insert into photos (trip_id, user_id, image_url, caption) values ($1, $2, $3, $4)", [
      tripId,
      userId,
      imageUrl,
      caption,
    ]);
    return this.getTripById(tripId, userId);
  }

  async toggleTripLike(userId, tripId) {
    const existing = await this.pool.query("select 1 from trip_likes where user_id = $1 and trip_id = $2", [userId, tripId]);

    if (existing.rowCount) {
      await this.pool.query("delete from trip_likes where user_id = $1 and trip_id = $2", [userId, tripId]);
    } else {
      await this.pool.query("insert into trip_likes (user_id, trip_id) values ($1, $2)", [userId, tripId]);
    }

    return this.getTripById(tripId, userId);
  }

  async createStory(userId, { imageUrl, placeName = "", body = "" }) {
    await this.pool.query("insert into stories (user_id, image_url, place_name, body) values ($1, $2, $3, $4)", [userId, imageUrl, placeName, body]);
    return this.getStories(userId);
  }

  async getStories(currentUserId = null) {
    const result = await this.pool.query(
      `select s.*, u.id as user_id_ref, u.name, u.email, u.bio, u.location, u.avatar_url, u.created_at as user_created_at
       from stories s
       join users u on u.id = s.user_id
       order by s.created_at desc`,
    );

    return result.rows.map((story) => ({
      id: story.id,
      userId: story.user_id,
      imageUrl: story.image_url,
      placeName: story.place_name,
      body: story.body,
      createdAt: story.created_at,
      user: {
        id: story.user_id_ref,
        name: story.name,
        email: story.email,
        bio: story.bio,
        location: story.location,
        avatarUrl: story.avatar_url,
        createdAt: story.user_created_at,
      },
      isOwnStory: currentUserId ? story.user_id === currentUserId : false,
    }));
  }

  async getSavedTrips(userId) {
    const result = await this.pool.query(
      `select t.*
       from saved_trips s
       join trips t on t.id = s.trip_id
       where s.user_id = $1
       order by s.created_at desc`,
      [userId],
    );

    return Promise.all(result.rows.map((row) => this.buildTrip(row, userId)));
  }

  async getMemories(userId) {
    const [trips, photos, stories] = await Promise.all([
      this.pool.query("select id, cover_image, title, created_at from trips where author_id = $1", [userId]),
      this.pool.query("select id, image_url, caption, created_at from photos where user_id = $1", [userId]),
      this.pool.query("select id, image_url, place_name, body, created_at from stories where user_id = $1", [userId]),
    ]);

    return [
      ...stories.rows.map((story) => ({ id: `memory-story-${story.id}`, imageUrl: story.image_url, caption: story.place_name || story.body || "Story", source: "story", createdAt: story.created_at })),
      ...photos.rows.map((photo) => ({ id: `memory-photo-${photo.id}`, imageUrl: photo.image_url, caption: photo.caption || "Trip photo", source: "photo", createdAt: photo.created_at })),
      ...trips.rows.map((trip) => ({ id: `memory-trip-${trip.id}`, imageUrl: trip.cover_image, caption: trip.title, source: "trip", createdAt: trip.created_at })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAllUsers(currentUserId = null) {
    const result = await this.pool.query(
      `select * from users
       where ($1::uuid is null or id <> $1)
       order by created_at desc`,
      [currentUserId],
    );

    return result.rows.map((row) => normalizeUser(this.mapUser(row)));
  }

  async getActivity() {
    const [comments, reviews, likes] = await Promise.all([
      this.pool.query(
        `select c.id, c.trip_id, c.body as message, c.created_at, u.*
         from comments c
         join users u on u.id = c.user_id`,
      ),
      this.pool.query(
        `select r.id, r.trip_id, concat(r.rating, '/5 • ', r.body) as message, r.created_at, u.*
         from reviews r
         join users u on u.id = r.user_id`,
      ),
      this.pool.query(
        `select concat(l.user_id, '-', l.trip_id) as id, l.trip_id, 'liked a trip' as message, l.created_at, u.*
         from trip_likes l
         join users u on u.id = l.user_id`,
      ),
    ]);

    const mapRows = (rows, type) =>
      rows.map((row) =>
        buildActivityItem({
          id: `${type}-${row.id}`,
          type,
          user: normalizeUser(this.mapUser(row)),
          message: row.message,
          createdAt: row.created_at,
          tripId: row.trip_id,
        }),
      );

    return [...mapRows(comments.rows, "comment"), ...mapRows(reviews.rows, "review"), ...mapRows(likes.rows, "like")]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);
  }

  async getPublicProfile(userId, currentUserId = null) {
    const user = await this.findUserById(userId);
    if (!user) {
      return null;
    }

    const [trips, stories, memories] = await Promise.all([
      this.getUserTrips(userId),
      this.getStories(currentUserId).then((items) => items.filter((story) => story.userId === userId)),
      this.getMemories(userId),
    ]);

    return { user: normalizeUser(user), trips, stories, memories };
  }

  // ADD THIS INSIDE PostgresStore CLASS (before closing bracket)

  async updateTrip(userId, tripId, updates) {
    const result = await this.pool.query(
      `update trips set
        title = coalesce($3, title),
        summary = coalesce($4, summary),
        cover_image = coalesce($5, cover_image),
        city = coalesce($6, city),
        country = coalesce($7, country),
        travel_month = coalesce($8, travel_month),
        budget = coalesce($9, budget),
        duration_days = coalesce($10, duration_days),
        visibility = coalesce($11, visibility),
        tags = coalesce($12, tags),
        highlights = coalesce($13, highlights),
        itinerary = coalesce($14, itinerary)
      where id = $1 and author_id = $2
      returning *`,
      [
        tripId,
        userId,
        updates.title ?? null,
        updates.summary ?? null,
        updates.coverImage ?? null,
        updates.city ?? null,
        updates.country ?? null,
        updates.travelMonth ?? null,
        updates.budget ?? null,
        updates.durationDays ?? null,
        updates.visibility ?? null,
        updates.tags ?? null,
        updates.highlights ?? null,
        updates.itinerary ? JSON.stringify(updates.itinerary) : null,
      ]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.buildTrip(result.rows[0], userId);
  }

  async deleteTrip(userId, tripId) {
    const result = await this.pool.query(
      "delete from trips where id = $1 and author_id = $2 returning id",
      [tripId, userId]
    );

    return result.rowCount > 0;
  }
}

export const createStore = async ({ databaseUrl }) => {
  if (!databaseUrl) {
    return new MemoryStore();
  }

  const store = new PostgresStore(databaseUrl);

  try {
    await store.health();
    return store;
  } catch (error) {
    console.warn("Postgres unavailable, falling back to memory store:", error.message);
    return new MemoryStore();
  }
};

export { normalizeUser };
