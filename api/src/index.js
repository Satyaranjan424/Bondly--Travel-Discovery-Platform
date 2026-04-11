import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import Redis from "ioredis";
import { createStore, normalizeUser } from "./lib/store.js";
import { createPasswordHash, createToken, verifyPassword } from "./lib/security.js";
import { createSessionStore } from "./lib/sessionStore.js";

const requiredTripFields = ["title", "summary", "coverImage", "city", "country", "travelMonth", "budget", "durationDays", "visibility"];
const parseList = (value) => Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : typeof value === "string" ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];

const bootstrap = async () => {
  let redisClient = null;
  if (process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true });
      await redisClient.connect();
    } catch (error) {
      console.warn("Redis unavailable, falling back to memory sessions:", error.message);
      redisClient = null;
    }
  }

  const store = await createStore({ databaseUrl: process.env.DATABASE_URL });
  const sessions = createSessionStore(redisClient);
  const app = new Hono();

  app.use("*", cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", allowHeaders: ["Content-Type", "Authorization"], allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], credentials: true }));

  app.use("*", async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return next();
    const token = authHeader.replace("Bearer ", "");
    const session = await sessions.get(token);
    if (session?.userId) {
      const user = await store.findUserById(session.userId);
      if (user) c.set("session", { token, user });
    }
    await next();
  });

  const requireAuth = async (c, next) => {
    const session = c.get("session");
    if (!session?.user) return c.json({ error: "Authentication required" }, 401);
    await next();
  };

  app.get("/", (c) => c.json({ name: "Bondly API", status: "ok" }));
  app.get("/health", async (c) => c.json({ status: "ok", ...(await store.health()), sessions: process.env.REDIS_URL ? "redis-or-memory" : "memory" }));

  app.post("/auth/signup", async (c) => {
    const body = await c.req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!name || !email || password.length < 8) return c.json({ error: "Name, email, and an 8+ character password are required." }, 400);
    if (await store.findUserByEmail(email)) return c.json({ error: "An account with that email already exists." }, 409);
    const user = await store.createUser({ name, email, passwordHash: createPasswordHash(password) });
    const token = createToken();
    await sessions.set(token, { userId: user.id });
    return c.json({ token, user: normalizeUser(user) }, 201);
  });

  app.post("/auth/login", async (c) => {
    const body = await c.req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const user = await store.findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) return c.json({ error: "Invalid email or password." }, 401);
    const token = createToken();
    await sessions.set(token, { userId: user.id });
    return c.json({ token, user: normalizeUser(user) });
  });

  app.post("/auth/logout", requireAuth, async (c) => {
    await sessions.delete(c.get("session").token);
    return c.json({ ok: true });
  });

  app.get("/auth/me", requireAuth, async (c) => c.json({ user: normalizeUser(c.get("session").user) }));
  app.put("/auth/profile", requireAuth, async (c) => {
    const body = await c.req.json();
    const updated = await store.updateUser(c.get("session").user.id, { name: body.name ? String(body.name).trim() : undefined, bio: body.bio !== undefined ? String(body.bio) : undefined, location: body.location !== undefined ? String(body.location) : undefined, avatarUrl: body.avatarUrl !== undefined ? String(body.avatarUrl) : undefined });
    return c.json({ user: normalizeUser(updated) });
  });

  app.get("/explore", async (c) => {
    const trips = await store.getPublicTrips({ query: c.req.query("q") ?? "", currentUserId: c.get("session")?.user?.id ?? null });
    return c.json({ trips });
  });

  app.get("/trips/mine", requireAuth, async (c) => c.json({ trips: await store.getUserTrips(c.get("session").user.id) }));

  app.get("/trips/:tripId", async (c) => {
    const tripId = c.req.param("tripId");
      const trip = await store.getTripById(
        tripId,
        c.get("session")?.user?.id ?? null
      );
      if (!trip) {
        return c.json({ error: "Trip not found" }, 404);
      }
    return c.json({ trip });
  });


  app.post("/trips", requireAuth, async (c) => {
    const body = await c.req.json();
    for (const field of requiredTripFields) {
      if (!String(body[field] ?? "").trim()) return c.json({ error: `Missing field: ${field}` }, 400);
    }
    const itinerary = Array.isArray(body.itinerary) ? body.itinerary.map((item) => ({ day: String(item.day ?? "").trim(), title: String(item.title ?? "").trim(), description: String(item.description ?? "").trim() })).filter((item) => item.day && item.title && item.description) : [];
    const trip = await store.createTrip(c.get("session").user.id, { title: String(body.title).trim(), summary: String(body.summary).trim(), coverImage: String(body.coverImage).trim(), city: String(body.city).trim(), country: String(body.country).trim(), travelMonth: String(body.travelMonth).trim(), budget: String(body.budget).trim(), durationDays: Number(body.durationDays), visibility: String(body.visibility).trim() || "public", tags: parseList(body.tags), highlights: parseList(body.highlights), itinerary });
    return c.json({ trip }, 201);
  });

  app.post("/trips/:tripId/save", requireAuth, async (c) => {
    const trip = await store.saveTrip(c.get("session").user.id, c.req.param("tripId"));
    if (!trip) return c.json({ error: "Trip not found" }, 404);
    return c.json({ trip });
  });

  app.post("/trips/:tripId/comments", requireAuth, async (c) => {
    const body = await c.req.json();
    const message = String(body.body ?? "").trim();
    if (!message) return c.json({ error: "Comment body is required." }, 400);
    return c.json({ trip: await store.addComment(c.get("session").user.id, c.req.param("tripId"), message) });
  });

  app.post("/trips/:tripId/reviews", requireAuth, async (c) => {
    const body = await c.req.json();
    const rating = Number(body.rating);
    const review = String(body.body ?? "").trim();
    if (!rating || rating < 1 || rating > 5 || !review) return c.json({ error: "Review text and a rating between 1 and 5 are required." }, 400);
    return c.json({ trip: await store.addReview(c.get("session").user.id, c.req.param("tripId"), rating, review) });
  });

  app.post("/trips/:tripId/photos", requireAuth, async (c) => {
    const body = await c.req.json();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const caption = String(body.caption ?? "").trim();
    if (!imageUrl) return c.json({ error: "Photo URL is required." }, 400);
    return c.json({ trip: await store.addPhoto(c.get("session").user.id, c.req.param("tripId"), imageUrl, caption) });
  });

  app.put("/trips/:tripId", requireAuth, async (c) => {
    const tripId = c.req.param("tripId");
    const user = c.get("session").user;
    const body = await c.req.json();

    const itinerary = Array.isArray(body.itinerary)
      ? body.itinerary
          .map((item) => ({
            day: String(item.day ?? "").trim(),
            title: String(item.title ?? "").trim(),
            description: String(item.description ?? "").trim(),
          }))
          .filter((item) => item.day && item.title && item.description)
      : undefined;

    const updated = await store.updateTrip(user.id, tripId, {
      title: body.title !== undefined ? String(body.title).trim() : undefined,
      summary: body.summary !== undefined ? String(body.summary).trim() : undefined,
      coverImage: body.coverImage !== undefined ? String(body.coverImage).trim() : undefined,
      city: body.city !== undefined ? String(body.city).trim() : undefined,
      country: body.country !== undefined ? String(body.country).trim() : undefined,
      travelMonth: body.travelMonth !== undefined ? String(body.travelMonth).trim() : undefined,
      budget: body.budget !== undefined ? String(body.budget).trim() : undefined,
      durationDays: body.durationDays !== undefined ? Number(body.durationDays) : undefined,
      visibility: body.visibility !== undefined ? String(body.visibility).trim() : undefined,
      tags: body.tags !== undefined ? parseList(body.tags) : undefined,
      highlights: body.highlights !== undefined ? parseList(body.highlights) : undefined,
      itinerary,
    });

    if (!updated) {
      return c.json({ error: "Trip not found or unauthorized" }, 404);
    }

  return c.json({ success: true, trip: updated });
  });

  app.delete("/trips/:tripId", requireAuth, async (c) => {
  const tripId = c.req.param("tripId");
  const user = c.get("session").user;

  const deleted = await store.deleteTrip(user.id, tripId);

  if (!deleted) {
    return c.json({ error: "Trip not found or unauthorized" }, 404);
  }

  return c.json({ success: true, message: "Trip deleted successfully" });
  });

  const port = Number(process.env.PORT || 3001);
  serve({ fetch: app.fetch, port });
  console.log(`Bondly API running on http://localhost:${port}`);
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
