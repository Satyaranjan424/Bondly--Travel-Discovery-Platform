const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, { method = "GET", body, token, signal } = {}) {
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

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: (token) => request("/auth/logout", { method: "POST", token }),
  me: (token) => request("/auth/me", { token }),
  updateProfile: (token, payload) => request("/auth/profile", { method: "PUT", token, body: payload }),
  getUsers: ({ token, signal } = {}) => request("/users", { token, signal }),
  getUserProfile: (userId, { token, signal } = {}) => request(`/users/${userId}`, { token, signal }),
  getExploreTrips: ({ query = "", token, signal } = {}) =>
    request(`/explore${query ? `?q=${encodeURIComponent(query)}` : ""}`, { token, signal }),
  getStories: ({ token, signal } = {}) => request("/stories", { token, signal }),
  createStory: (token, payload) => request("/stories", { method: "POST", token, body: payload }),
  getActivity: ({ token, signal } = {}) => request("/social/activity", { token, signal }),
  getSavedTrips: (token, signal) => request("/social/saved", { token, signal }),
  getMemories: (token, signal) => request("/social/memories", { token, signal }),
  getTrip: (tripId, { token, signal } = {}) => request(`/trips/${tripId}`, { token, signal }),
  getMyTrips: (token, signal) => request("/trips/mine", { token, signal }),
  createTrip: (token, payload) => request("/trips", { method: "POST", token, body: payload }),
  updateTrip: (token, tripId, payload) => request(`/trips/${tripId}`, { method: "PUT", token, body: payload }),
  deleteTrip: (token, tripId) => request(`/trips/${tripId}`, { method: "DELETE", token }),
  saveTrip: (token, tripId) => request(`/trips/${tripId}/save`, { method: "POST", token }),
  likeTrip: (token, tripId) => request(`/trips/${tripId}/like`, { method: "POST", token }),
  addComment: (token, tripId, payload) => request(`/trips/${tripId}/comments`, { method: "POST", token, body: payload }),
  addReview: (token, tripId, payload) => request(`/trips/${tripId}/reviews`, { method: "POST", token, body: payload }),
  addPhoto: (token, tripId, payload) => request(`/trips/${tripId}/photos`, { method: "POST", token, body: payload }),
};
