import { Schema, model } from "mongoose"

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  balance: { type: Number, default: 500 },
  skills: { type: [String] },
  interest: { type: [String] },
  coursesCompleted: { type: Schema.Types.ObjectId, default: 0 },
  coursesTaught: { type: Schema.Types.ObjectId, default: 0 },
  role: { type: [String], enum: ["student", "teacher"], required: true }
})

export const User = model("User", userSchema);
