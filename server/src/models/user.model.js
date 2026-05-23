import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  fullName: { type: String, required: true },
  balance: { type: Number, default: 500 },
  skills: { type: [String] },
  interest: { type: [String] },
  coursesCompleted: { type: Schema.Types.ObjectId, ref: "Video" },
  coursesTaught: { type: Schema.Types.ObjectId, ref: "Video" },
  role: { type: [String], enum: ["student", "teacher"], required: true },
  refreshToken: {
    type: String
  }
}, { timeStamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
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

userSchema.methods.generateRefreshToken = function() {
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

export const User = model("User", userSchema);
