import connectDB from "@/lib/dbConnect";
import {Notification} from "@/models/notification"
import { redis } from "@/lib/redis";

import {toggleVisibility, deleteNotification, updateNotification} from "../../../../handler/notification"


export async function GET(req, {params}){
  await connectDB()
  const param = await params;
  const notification = await Notification.findOne({ slug: param.slug });

  if(!notification) return Response.json( {error: "Notification not found"}, {status: 404} )

  return Response.json(notification)
}


export async function PUT(req, { params }) {
  try {
    const param = await params;
    const body = await req.json();
    
    console.log("📝 PUT /api/notification - ID:", param.slug);
    console.log("📝 Update data:", body);
    
    // Try to find by ID first, then by slug as fallback
    let notification = await Notification.findById(param.slug);
    
    if (!notification) {
      console.log("⚠️ Not found by ID, trying slug...");
      notification = await Notification.findOne({ slug: param.slug });
    }
    
    if (!notification) {
      console.log("❌ Notification not found");
      return Response.json({ error: "Notification not found" }, { status: 404 });
    }
    
    console.log("✅ Found notification:", notification.title);
    
    // Don't update the slug if it's being modified (validation in model)
    // Allow all other fields to be updated
    Object.assign(notification, body);
    await notification.save();
    
    // Clear Redis cache to reflect the update
    await redis.del("notifications");
    
    // Also clear category cache if category was updated
    if (body.category && body.category.slug) {
      await redis.del(`notifications:category:${body.category.slug}`);
    }
    
    console.log("✅ Notification updated successfully");
    return Response.json(notification);
  } catch (err) {
    console.error("❌ PUT error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PATCH - Update a single field (e.g., visibility)
export async function PATCH(req, { params }) {
  try {
    const param = await params;
    console.log("🔄 PATCH /api/notification - ID:", param.slug);
    
    // Try to find by ID first, then by slug as fallback
    let notification = await Notification.findById(param.slug);
    
    if (!notification) {
      console.log("⚠️ Not found by ID, trying slug...");
      notification = await Notification.findOne({ slug: param.slug });
    }
    
    if (!notification) {
      console.log("❌ Notification not found");
      return Response.json({ error: "Notification not found" }, { status: 404 });
    }
    
    notification.isVisible = !notification.isVisible;
    await notification.save();
    
    // Clear Redis cache to reflect the update
    await redis.del("notifications");
    
    // Also clear category cache if notification has a category
    if (notification.category && notification.category.slug) {
      await redis.del(`notifications:category:${notification.category.slug}`);
    }
    
    console.log("✅ Notification PATCH successful");
    return Response.json(notification);
  } catch (err) {
    console.error("❌ PATCH error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove notification
export async function DELETE(req, { params }) {
  try {
    const param = await params;
    console.log("🗑️ DELETE /api/notification - ID:", param.slug);
    
    // Try to find by ID first, then by slug as fallback
    let deleted = await Notification.findByIdAndDelete(param.slug);
    
    if (!deleted) {
      console.log("⚠️ Not found by ID, trying slug...");
      deleted = await Notification.findOneAndDelete({ slug: param.slug });
    }
    
    if (!deleted) {
      console.log("❌ Notification not found");
      return Response.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Clear Redis cache to reflect the deletion
    await redis.del("notifications");
    
    // Also clear category cache if notification had a category
    if (deleted.category && deleted.category.slug) {
      await redis.del(`notifications:category:${deleted.category.slug}`);
    }
    
    console.log("✅ Notification deleted successfully:", deleted.title);
    return Response.json(deleted);
  } catch (err) {
    console.error("❌ DELETE error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}