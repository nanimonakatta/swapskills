import express from "express";
import { uploadVideo } from "../controllers/video.controller.js";
import upload from "../middlewares/multer.middleware.js";

const videoRouter = express.Router();

videoRouter.route("/upload")
  .post(
    upload.fields([
      {
        name: "video",
        maxCount: 1
      },
      {
        name: "thumbnail",
        maxCount: 1
      }
    ]),
    uploadVideo
  );

export { videoRouter };