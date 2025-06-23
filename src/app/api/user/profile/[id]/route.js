import User from "../../../../../models/user"
import connectDB from "../../../../../lib/dbConnect"

export async function GET(req, { params }) {
  await connectDB();
  const param = await params
  const user = await User.findById(param.id).select("-password");
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  return Response.json({data:user});
}

export async function PUT(req, { params }) {
  await connectDB();
  const param = await params
  const body = await req.json();
  const updatedUser = await User.findByIdAndUpdate(param.id, body, {
    new: true,
  }).select("-password");
  return Response.json({data:updatedUser});
}