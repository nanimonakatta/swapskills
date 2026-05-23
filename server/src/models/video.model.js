import { Model, Schema } from "mongoose";

const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: [{ type: String }],
  ratings: [{
    rating: { type: Number, required: true },
    content: String,
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 }
}, { timeStamps: true });

export const Video = Model("Video", videoSchema);