import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

client.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  if (!client.isOpen) await client.connect();
  console.log("✅ Redis connected");
})();

export const Redis = {
  async setEx(key: string, ttlSeconds: number, value: string) {
    return client.setEx(key, ttlSeconds, value);
  },
  async get(key: string) {
    return client.get(key);
  },
  async del(key: string) {
    return client.del(key);
  },
  async exists(key: string) {
    return client.exists(key);
  },
  async hSet(key: string, field: string, value: string) {
    return client.hSet(key, field, value);
  },
  async hGetAll(key: string) {
    return client.hGetAll(key);
  },
  async expire(key: string, seconds: number) {
    return client.expire(key, seconds);
  }
};

export default Redis;