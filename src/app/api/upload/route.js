// app/api/upload/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder: "products" }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
