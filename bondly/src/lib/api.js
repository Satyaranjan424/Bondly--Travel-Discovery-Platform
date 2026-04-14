const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";
const cacheTtlMs = 5 * 60_000;
const maxCachedPayloadBytes = 180_000;

function buildCacheKey(path, token) {
  return `bondly-cache:${token ? "auth" : "public"}:${path}`;
}

function getSessionStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readCached(path, token) {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  let raw = null;
  try {
    raw = storage.getItem(buildCacheKey(path, token));
  } catch {
    return null;
  }

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > cacheTtlMs) {
      storage.removeItem(buildCacheKey(path, token));
      return null;
    }
    return parsed.data;
  } catch {
    try {
      storage.removeItem(buildCacheKey(path, token));
    } catch {
      return null;
    }
    return null;
  }
}

function writeCached(path, token, data) {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  const payload = JSON.stringify({ timestamp: Date.now(), data });

  if (payload.length > maxCachedPayloadBytes) {
    return;
  }

  try {
    storage.setItem(buildCacheKey(path, token), payload);
  } catch {
    // Storage is best-effort only. Large social payloads should still render.
  }
}

function clearRelatedCache(matchers = []) {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  const keys = [];
  let length = 0;
  try {
    length = storage.length;
  } catch {
    return;
  }

  for (let index = 0; index < length; index += 1) {
    const key = storage.key(index);
    const shouldClear =
      key?.startsWith("bondly-cache:") &&
      (matchers.length === 0 || matchers.some((matcher) => key.includes(matcher)));

    if (shouldClear) {
      keys.push(key);
    }
  }

  keys.forEach((key) => {
    try {
      storage.removeItem(key);
    } catch {
      // Ignore cache cleanup failures so mutations still complete.
    }
  });
}

async function request(path, { method = "GET", body, token, signal, invalidateMatchers = [] } = {}) {
  if (method === "GET") {
    const cached = readCached(path, token);
    if (cached) {
      return cached;
    }
  }

  const response = await fetch(`${apiBase}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  if (method === "GET") {
    writeCached(path, token, data);
  } else {
    clearRelatedCache(invalidateMatchers);
  }

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: (token) => request("/auth/logout", { method: "POST", token }),
  me: (token) => request("/auth/me", { token }),
  getInbox: (token, signal) => request("/auth/inbox", { token, signal }),
  updateProfile: (token, payload) => request("/auth/profile", { method: "PUT", token, body: payload }),
  getUsers: ({ token, signal, limit } = {}) =>
    request(`/users${limit ? `?limit=${limit}` : ""}`, { token, signal }),
  getUserProfile: (userId, { token, signal } = {}) => request(`/users/${userId}`, { token, signal }),
  getExploreTrips: ({ query = "", token, signal, limit, view } = {}) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (limit) params.set("limit", String(limit));
    if (view) params.set("view", view);
    const suffix = params.toString();
    return request(`/explore${suffix ? `?${suffix}` : ""}`, { token, signal });
  },
  getStories: ({ token, signal, limit } = {}) =>
    request(`/stories${limit ? `?limit=${limit}` : ""}`, { token, signal }),
  createStory: (token, payload) =>
    request("/stories", { method: "POST", token, body: payload, invalidateMatchers: ["/stories", "/explore"] }),
  getActivity: ({ token, signal, limit } = {}) =>
    request(`/social/activity${limit ? `?limit=${limit}` : ""}`, { token, signal }),
  getSavedTrips: (token, signal) => request("/social/saved", { token, signal }),
  getMemories: (token, signal) => request("/social/memories", { token, signal }),
  getTrip: (tripId, { token, signal } = {}) => request(`/trips/${tripId}`, { token, signal }),
  getMyTrips: (token, signal) => request("/trips/mine", { token, signal }),
  createTrip: (token, payload) =>
    request("/trips", { method: "POST", token, body: payload, invalidateMatchers: ["/explore", "/trips/mine", "/social/activity"] }),
  updateTrip: (token, tripId, payload) =>
    request(`/trips/${tripId}`, { method: "PUT", token, body: payload, invalidateMatchers: ["/explore", `/trips/${tripId}`, "/trips/mine"] }),
  deleteTrip: (token, tripId) =>
    request(`/trips/${tripId}`, { method: "DELETE", token, invalidateMatchers: ["/explore", `/trips/${tripId}`, "/trips/mine", "/social/activity"] }),
  saveTrip: (token, tripId) =>
    request(`/trips/${tripId}/save`, { method: "POST", token, invalidateMatchers: ["/explore", `/trips/${tripId}`, "/social/saved"] }),
  likeTrip: (token, tripId) =>
    request(`/trips/${tripId}/like`, { method: "POST", token, invalidateMatchers: ["/explore", `/trips/${tripId}`, "/social/activity"] }),
  addComment: (token, tripId, payload) =>
    request(`/trips/${tripId}/comments`, { method: "POST", token, body: payload, invalidateMatchers: ["/explore", `/trips/${tripId}`, "/social/activity"] }),
  addReview: (token, tripId, payload) =>
    request(`/trips/${tripId}/reviews`, { method: "POST", token, body: payload, invalidateMatchers: ["/explore", `/trips/${tripId}`, "/social/activity"] }),
  addPhoto: (token, tripId, payload) =>
    request(`/trips/${tripId}/photos`, { method: "POST", token, body: payload, invalidateMatchers: ["/explore", `/trips/${tripId}`] }),
  toggleFollow: (token, userId) => request(`/users/${userId}/follow`, { method: "POST", token, invalidateMatchers: [`/users/${userId}`] }),
  getConversation: (token, userId, signal) => request(`/auth/conversations/${userId}`, { token, signal }),
  sendMessage: (token, userId, payload) =>
    request(`/auth/conversations/${userId}`, { method: "POST", token, body: payload, invalidateMatchers: ["/auth/inbox", "/auth/conversations/"] }),
};
