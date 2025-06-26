// lib/handlers/uploadToCloudinary.js
import cloudinary from "@/lib/cloudinary";

/**
 * Uploads a file to Cloudinary with automatic folder routing
 * @param {File} file - The file object from formData
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error("No file provided");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Detect content type and choose target folder
  const mimeType = file.type;
  let folder = "products/misc";
  let resource_type = "auto";

  if (mimeType.startsWith("image/")) {
    folder = "products/images";
    resource_type = "image";
  } else if (mimeType === "application/pdf") {
    folder = "products/pdfs";
    resource_type = "raw"; // PDF is treated as "raw" by Cloudinary
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      )
      .end(buffer);
  });
}
