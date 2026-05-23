import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const uploadVideo = asyncHandler(
  async function(req, res) {
    const { title, description = '', category = [] } = req.body || {};
    if (!req.files?.video?.[0]?.mimetype.startsWith("video/")) {
      throw new ApiError(400, "Please upload a valid video file.")
    }
    if (!req.files?.thumbnail?.[0]?.mimetype.startsWith("image/")) {
      throw new ApiError(400, "Please upload a valid thumbnail");
    }
    if (!title) {
      throw new ApiError(400, "Video title is required.");
    }
    if (Array.isArray(category) && category?.length === 0) {
      throw new ApiError(400, "At least one keyword for uploaded video is required");
    }

    const uploadedVideo = await uploadOnCloudinary(req.files.video[0]);
    if (!uploadedVideo?.url) {
      throw new ApiError(500, "Failed to upload the video.")
    }
    const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0]);
    if (!uploadedThumbnail?.url) {
      throw new ApiError(500, "Failed to upload the thumbnail.")
    }
    const video = await Video.create({
      videoUrl: uploadedVideo.url,
      title,
      description,
      thumbnail: uploadedThumbnail.url,
      owner: req.authUser._id,
      duration: uploadedVideo.duration,
      category
    });

    const filteredVideo = video.toObject();
    delete filteredVideo.owner;
    res.status(200).json(
      new ApiResponse(
        200,
        filteredVideo,
        "Video uploaded successfully"
      )
    )
  }
);

export {
  uploadVideo
}