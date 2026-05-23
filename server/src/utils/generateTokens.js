import { ApiError } from "./ApiError.js";
import { User } from "../models/user.model.js";

const generateTokens = async function(userId) {
  try {
    const user = await User.findOne({ _id: userId });
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Access or refresh token generation failed.");
  }
}

export { generateTokens };