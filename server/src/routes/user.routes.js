import express from "express";
import z from "zod";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"

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

  const duplicateUsername = User.findOne({
    $or: []
  })
})


