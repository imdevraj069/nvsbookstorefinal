import connectDB from "@/lib/dbConnect";
import {Notification} from "@/models/notification"

import {toggleVisibility} from "../../../../handler/notification"


export async function GET(req, {params}){
  await connectDB()
  const param = await params;
  const notification = await Notification.findById(param.id);

  if(!notification) return Response.json( {error: "Notification not found"}, {status: 404} )

  return Response.json(notification)
}


export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const param = await params;
    const body = await req.json();
    const updated = await Notification.findByIdAndUpdate(
      param.id,
      body,
      { new: true }
    );
    if (!updated) return Response.json({ error: "Notification not found" }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PATCH - Update a single field (e.g., visibility)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const param = await params;
    const res = await toggleVisibility(param.id);
    console.log(res)
    return Response.json(res);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove notification
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const param = await params;
    const deleted = await Notification.findByIdAndDelete(param.id);
    if (!deleted) return Response.json({ error: "Notification not found" }, { status: 404 });
    return Response.json({ message: "Notification deleted successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}