import { Model, Schema } from "mongoose";

const videoSchema = new Schema({
  title: { type: String, required: true },
  categoty: { type: [String], required: true },
  ratings: [{
    rating: { type: Number, default: 0 },
    content: { type: Schema.types.Ojectid, ref: Content },
    ownerId: { type: Schema.types.Objectid, ref: User }
  }],
  videoUrl: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId },
  views: {
    type: Number, default: 0
  }
})

export const Video = Model("Video", videoSchema);