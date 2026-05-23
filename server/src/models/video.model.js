import { Model, Schema } from "mongoose";

const videoSchema = new Schema({
  title: { type: string, required: true },
  categoty: { type: [string], required: true },
  ratings: [{
    rating: { type: string, default: 0 },
    content: { type: Schema.types.Ojectid, ref: Content },
    ownerId: { type: Schema.types.Objectid, ref: User }
  }],
  videoUrl: { type: string, required: true },
  owner: { type: Schema.types.Objectid },
  views: {
    type: Number, default: 0
  }
})

export const Video = Model("Video", videoSchema);