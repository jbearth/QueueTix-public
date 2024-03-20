import Redis from "ioredis";
import "dotenv/config";

// Create a Redis client instance
export const redis = new Redis({
  host: process.env.DB_REDIS_HOST,    // Redis server host (default: '127.0.0.1')
  port: +process.env.DB_REDIS_PORT,    // Redis server port (default: 6379)
  username: process.env.DB_REDIS_NAME,  // needs Redis >= 6
  password: process.env.DB_REDIS_PASSWORD,
  db: 0 // Defaults to 0
});
