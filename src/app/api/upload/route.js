// app/api/upload/route.js
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/handler/uploadToCloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const result = await uploadToCloudinary(file);

    return NextResponse.json({ url: result.secure_url, folder: result.folder });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
