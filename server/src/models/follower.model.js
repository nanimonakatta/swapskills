import { Model, Schema } from "mongoose";

const followerSchema = new Schema({
  userId: { type: Schema.types.ObjectId, ref: "User" },
  followerId: { type: Schema.types.ObjectId, ref: "User" }
});

export const Follower = Model("Follower", followerSchema);