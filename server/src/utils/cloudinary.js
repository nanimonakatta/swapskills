import { v2 as cloudinary } from 'cloudinary';
import streamifier from "streamifier";
import fs from "node:fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export { cloudinary };

export const uploadOnCloudinary = async function (file) {
  try {
    if (!file) throw new ApiError(400, "No file provided.");
    const MAX_MEMORY_SIZE = 1 * 1024 * 1024; // 1MB

    if (file.buffer && file.size <= MAX_MEMORY_SIZE) {
      return new Promise(function (resolve, reject) {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            colors: true,
            resource_type: "auto"
          },
          function (err, result) {
            if (err) reject(err);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } else if (file.path && file.size > MAX_MEMORY_SIZE) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        colors: true
      });
      fs.unlinkSync(file.path);
      return result;
    } else {
      throw new ApiError(400, "No file provided to upload.");
    }

  } catch (err) {
    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    console.log("Error: ", err);
    throw new ApiError(500, "File upload failed.");
  }
}
