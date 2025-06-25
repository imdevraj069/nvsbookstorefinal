import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// POST /api/user/auth/:userId
export async function POST(req, { params }) {
  await connectDB();
  const param = await params

  const { userId } = param;
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return Response.json(
        { error: "Incorrect current password" },
        { status: 401 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return Response.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CHANGE_PASSWORD_ERROR]", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const param = await params
  const { userId } = param;
  const { newPassword } = await req.json();

  if (!newPassword || newPassword.length < 6) {
    return Response.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("[UPDATE_PASSWORD_ERROR]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  const param = await params
  const { userId } = param;
  const { password } = await req.json();

  if (!password) {
    return Response.json({ error: "Password is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: "Incorrect password" }, { status: 401 });
    }

    await User.findByIdAndDelete(userId);
    return Response.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("[DELETE_USER]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}