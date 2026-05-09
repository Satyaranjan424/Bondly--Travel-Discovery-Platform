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

class PostgresSessionStore {
  constructor(pool) {
    this.pool = pool;
  }

  async set(token, session) {
    await this.pool.query(
      `insert into sessions (token, user_id, expires_at)
       values ($1, $2, now() + interval '7 days')
       on conflict (token) do update
       set user_id = excluded.user_id,
           expires_at = excluded.expires_at`,
      [token, session.userId],
    );
  }

  async get(token) {
    const result = await this.pool.query(
      "select user_id from sessions where token = $1 and expires_at > now() limit 1",
      [token],
    );

    if (!result.rows[0]) {
      return null;
    }

    return { userId: result.rows[0].user_id };
  }

  async delete(token) {
    await this.pool.query("delete from sessions where token = $1", [token]);
  }
}

export const createSessionStore = (redisClient, store) => {
  if (!redisClient) {
    if (store?.pool) {
      return new PostgresSessionStore(store.pool);
    }

    return new MemorySessionStore();
  }

  return new RedisSessionStore(redisClient);
};
