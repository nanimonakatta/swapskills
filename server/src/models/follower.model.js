import { Model, Schema } from "mongoose";

const followerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  followerId: { type: Schema.Types.ObjectId, ref: "User" }
});

export const Follower = Model("Follower", followerSchema);