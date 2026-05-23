import { model, Schema } from "mongoose";

const followerSchema = new Schema({

  userId: { type: Schema.Types.ObjectId, ref: "User" },
  followerId: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Follower = model("Follower", followerSchema);