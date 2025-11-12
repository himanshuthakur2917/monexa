import { createClient } from 'redis';


if (!global._redisClient) {
    global._redisClient = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    global._redisClient.on("connect", () => console.log("✅ Redis connected successfully!"));
    global._redisClient.on("error", (err) => console.error("❌ Redis client Error:", err));

    // connect only once
    global._redisClient.connect().catch(console.error);

}

const redisClient = global._redisClient

export default redisClient


