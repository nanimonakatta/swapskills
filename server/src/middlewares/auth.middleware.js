import { asyncHandler } from "../utils/api/asyncHandler.js";
import { ApiError } from "../utils/api/ApiError.js";
import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const verifyJWT = asyncHandler(
  async function(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const authUser = await User.findById(tokenData?._id).select("-refreshToken -__v");

    if (!authUser) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.authUser = authUser;
    next();
  }
);