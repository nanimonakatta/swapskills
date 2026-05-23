import { Schema, Model } from "mongoose"

const userSchema = new Schema({
  username: { type: string, required: true, unique: true },
  password: { type: string, required: true, unique: true },
  email: { type: email, required: true, unique: true },
  fullName: { type: string, required: true },
  balance: { type: Number, default: 500 },
  skills: { type: [string] },
  interest: { type: [string] },
  coursesCompleted: { type: Schema.types.Objectid, default: 0 },
  coursesTaught: { type: Schema.types.Objectid, default: 0 },
  role: { type: [string], enum: ["student", "teacher"], requied: true }
})

export const User = Model("User", userSchema);