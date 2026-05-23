import { Model, Schema } from "mongoose";

const followerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  followerId: { type: Schema.Types.ObjectId }
})

export const Follower = Model("Follower", followerSchema);