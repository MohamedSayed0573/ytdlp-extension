const Redis = require("ioredis");
const CONFIG = require("../config/constants");
const env = require("./env");

const redis = new Redis.Cluster(
    [{ host: env.REDIS_HOST, port: env.REDIS_PORT }],
    {
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
            tls: {},
        },
    },
);

redis.on("error", () => {});

async function checkCache(videoTag) {
    try {
        if (redis.status !== "ready") return;
        return await redis.get(videoTag);
    } catch (err) {
        // Cache miss on error — request continues without cache
    }
}

async function setCache(videoTag, data) {
    try {
        if (redis.status !== "ready") return;
        await redis.set(videoTag, data, "PX", CONFIG.CACHE_TTL, "NX");
    } catch (err) {
        // Cache write failure — non-critical, request still succeeds
    }
}

module.exports = {
    redis,
    checkCache,
    setCache,
};
