import { Notification, NotificationCategory } from "../models/notification";
import connectDB from "@/lib/dbConnect";
import { redis } from "@/lib/redis";


export async function getNotifications() {
  await connectDB();

  const cachekey = "notifications";

  const cached = await redis.get(cachekey);
  if (cached) {
    ( "Cache hit" );
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
  const filtered = await Notification.find({ "category.slug": category })
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

export async function getNotificationById(id){
  await connectDB();
  const notification = await Notification.findById(id).lean();
  return Response.json(notification);
}

export async function createNotCatHandler(newCategory) {
  if (!newCategory.trim()) throw new Error("Category name is required");

  const categoryName = newCategory.trim();
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

  await connectDB();

  try {
    // Check if category with the same slug already exists
    const existing = await NotificationCategory.findOne({ slug: categorySlug });
    if (existing) {
      return { success: false, message: "Category already exists" };
    }

    // Create new category
    const category = new NotificationCategory({
      name: categoryName,
      slug: categorySlug,
    });

    await category.save();

    // Clear Redis cache so fresh list is fetched next time
    await redis.del("notfCat");

    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    console.error("❌ Error creating category:", error);
    return {
      success: false,
      message: "Something went wrong while creating category",
      error: error.message,
    };
  }
}

export async function createNotificationHandler(data){
  await connectDB()
  const newNotification = await Notification.create({
    ...data,
    category: {
      name: data.category.name,
      slug: data.category.slug,
      description: data.category.description || "",
    },
  });

  await redis.del("notifications")

  return{
    success: true,
    message: "Notification created successfully",
    data: newNotification
  }
}

export async function toggleVisibility(id){
  await connectDB()
  const notification = await Notification.findById(id)
  if(notification){
    try {
      notification.isVisible = !notification.isVisible
      await notification.save()
      await redis.del("notifications" )
      return{
        success: true,
        message: "Visibility toggled successfully",
        data: notification
      }
    } catch (error) {
      console.error("❌ Error toggling visibility:", error);
      return {
        success: false,
        message: "Something went wrong while toggling visibility",
        error: error.message
      }
    }
  }else{
    return{
      success: false,
      message: "Notification not found",
    }
  }

}

export async function deleteNotification(id){
  await connectDB()
  try {
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted){
      return{
        success: false,
        message: "Notification not found",
      }
    }
    await redis.del("notifications")
    return{
      success: true,
      message: "Notification deleted successfully",
      data: deleted
    }
  } catch (error) {
    return       {
        success: false,
        message: "Something went wrong while deleting notification",
        error
      }
  }
}

export async function updateNotification(id, data){
  await connectDB()
  try {
    const updated = await Notification.findByIdAndUpdate(id, data, {new: true});
    if (!updated){
      return{
        success: false,
        message: "Notification not found",
      }
    }
    await redis.del("notifications")
    return {
      success: true,
      message: "Notification updated successfully",
      data: updated
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while updating notification",
      error
    }
  }
}

export async function toggleField({ id, field, model, cacheKey = "notifications" }) {
  await connectDB();

  const item = await model.findById(id);
  if (!item) {
    return {
      success: false,
      message: `${model.modelName} not found`,
    };
  }

  try {
    item[field] = !item[field];
    await item.save();

    if (cacheKey) await redis.del(cacheKey);

    return {
      success: true,
      message: `${field} toggled successfully`,
      data: item,
    };
  } catch (error) {
    console.error(`❌ Error toggling ${field}:`, error);
    return {
      success: false,
      message: `Something went wrong while toggling ${field}`,
      error: error.message,
    };
  }
}
