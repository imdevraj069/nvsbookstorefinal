import connectDB from "@/lib/dbConnect";
import {Notification} from "@/models/notification"

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
    const notification = await Notification.findOne({ slug: param.slug });
    if (!notification) return Response.json({ error: "Notification not found" }, { status: 404 });
    
    Object.assign(notification, body);
    await notification.save();
    return Response.json(notification);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PATCH - Update a single field (e.g., visibility)
export async function PATCH(req, { params }) {
  try {
    const param = await params;
    const notification = await Notification.findOne({ slug: param.slug });
    if (!notification) return Response.json({ error: "Notification not found" }, { status: 404 });
    
    notification.isVisible = !notification.isVisible;
    await notification.save();
    return Response.json(notification);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove notification
export async function DELETE(req, { params }) {
  try {
    const param = await params;
    const deleted = await Notification.findOneAndDelete({ slug: param.slug });
    if (!deleted) return Response.json({ error: "Notification not found" }, { status: 404 });
    return Response.json(deleted);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}