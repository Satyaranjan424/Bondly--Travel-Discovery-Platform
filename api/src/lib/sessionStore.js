class MemorySessionStore {
  constructor() {
    this.sessions = new Map();
  }

  async set(token, session) {
    this.sessions.set(token, session);
  }

  async get(token) {
    return this.sessions.get(token) ?? null;
  }

  async delete(token) {
    this.sessions.delete(token);
  }
}

class RedisSessionStore {
  constructor(client) {
    this.client = client;
  }

  async set(token, session) {
    await this.client.set(`session:${token}`, JSON.stringify(session), "EX", 60 * 60 * 24 * 7);
  }

  async get(token) {
    const raw = await this.client.get(`session:${token}`);
    return raw ? JSON.parse(raw) : null;
  }

  async delete(token) {
    await this.client.del(`session:${token}`);
  }
}

export const createSessionStore = (redisClient) => {
  if (!redisClient) {
    return new MemorySessionStore();
  }

  return new RedisSessionStore(redisClient);
};
