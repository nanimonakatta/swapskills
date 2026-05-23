import express from "express";
import z from "zod";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

export const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  const validateSchema = z.object({
    username: z.string().min(3).max(24).trim().toLowerCase(),
    password: z.string().min(8).max(50),
    fullName: z.string().max(50),
    email: z.email(),
    interest: z.array(z.string()),
    role: z.enum(),
  })

  const parsedData = validateSchema.safeParse(req.body);

  if (!parsedData.success) {
    throw new ApiError(400, "invalid data provided");
  }

  const data = parsedData.data;

  const duplicateUsername = User.findOne({
    $or: [
      { username: data.username },
      { email: data.email }
    ]
  })

  if (duplicate) {
    const conflict = duplicate.email === email ? "Email" : "Username";

    throw new ApiError(400, `${conflict} is already taken.`)
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  
  await User.create({
    username: data.username,
    email: data.email,
    passsword: hashedPassword,
    fullName: data.fullName,
    interests: data.interest,
    role: data.interest
  })

  return ApiResponse(201, "you have been signed up!!")
})

