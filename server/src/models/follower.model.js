import { Model, Schema } from "mongoose";

const followerSchema = new Schema({
  userId: { type: Schema.types.ObjectId },
  followerId: { type: Schema.types.ObjectId }
})

export const Follower = Model("Follower", followerSchema);