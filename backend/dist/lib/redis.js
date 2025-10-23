"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://redis:6379",
});
client.on("error", (err) => console.error("❌ Redis Error:", err));
(async () => {
    if (!client.isOpen)
        await client.connect();
    console.log("✅ Redis connected");
})();
exports.Redis = {
    async setEx(key, ttlSeconds, value) {
        return client.setEx(key, ttlSeconds, value);
    },
    async get(key) {
        return client.get(key);
    },
    async del(key) {
        return client.del(key);
    },
    async delAll(...keys) {
        if (keys.length === 0)
            return 0;
        return client.del(keys);
    },
    async exists(key) {
        return client.exists(key);
    },
    async hSet(key, field, value) {
        return client.hSet(key, field, value);
    },
    async hGetAll(key) {
        return client.hGetAll(key);
    },
    async expire(key, seconds) {
        return client.expire(key, seconds);
    },
    async keys(pattern) {
        return client.keys(pattern);
    },
    async ttl(key) {
        return client.ttl(key);
    }
};
exports.default = exports.Redis;
