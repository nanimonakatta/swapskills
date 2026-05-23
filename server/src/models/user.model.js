import { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
});

userSchema.pre("save", async function(next) {
  if (!this.isModified) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userScema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
}

userScema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
}

export const User = Model("User", userSchema);