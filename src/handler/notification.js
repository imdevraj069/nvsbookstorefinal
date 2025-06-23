import { Notification, NotificationCategory } from "../models/notification";
import connectDB from "@/lib/dbConnect";
import { redis } from "@/lib/redis";

export async function getNotifications() {
  await connectDB();

  const cachekey = "notifications";

  const cached = await redis.get(cachekey);
  if (cached) {
    return { source: "redis", data: cached };
  }

  const notifications = await Notification.find({}).sort({ date: -1 }).lean();
  await redis.set(cachekey, notifications, { ex: 3600 });

  return { source: "mongo", data: notifications };
}

export async function getNotificationsByCategory(category) {
  await connectDB();

  const cacheKey = `notifications:category:${category}`;

  // Try to get from Redis cache
  let cached = await redis.get(cacheKey);
  if (cached) {
    return { source: "redis", data: cached };
  }

  // If not in cache, fetch from MongoDB
  const filtered = await Notification.find({ category })
    .sort({ date: -1 })
    .lean();

  // Cache in Redis for 1 hour
  await redis.set(cacheKey, filtered, { ex: 3600 });

  return { source: "mongo", data: filtered };
}

export async function getNotfCatHandler() {
  await connectDB();

  const cachekey = "notfCat";
  const cached = await redis.get(cachekey);
  if (cached) {
    return { source: "redis", data: cached };
  }

  const categories = await NotificationCategory.find({}).sort({ name: 1 }).lean();
  await redis.set(cachekey, categories, { ex: 3600 });

  return { source: "mongo", data: categories };
}
