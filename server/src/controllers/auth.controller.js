import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import z from "zod";
import { options } from "../constants.js";
import { generateTokens } from "../utils/generateTokens.js";

const registerUser = asyncHandler(
  async (req, res) => {
    const validateSchema = z.object({
      username: z.string().min(3).max(24).trim().toLowerCase(),
      password: z.string().min(8).max(50),
      fullName: z.string().max(50),
      email: z.email(),
      interest: z.array(z.string()),
      role: z.string(),
      skills: z.array(z.string())
    })

    const parsedData = validateSchema.safeParse(req.body || {});

    if (!parsedData.success) {
      console.log(parsedData.error.issues)
      throw new ApiError(400, "invalid data provided");
    }

    const data = parsedData.data;

    const duplicateUser = await User.findOne({
      $or: [
        { username: data.username },
        { email: data.email }
      ]
    });

    if (duplicateUser) {
      const conflict = duplicateUser.email === data.email ? "Email" : "Username";
      console.log("duplicate user")
      throw new ApiError(400, `${conflict} is already taken.`)
    }

    const newUser = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      interest: data.interest,
      role: data.role,
      skills: data.skills
    })

    if (!newUser) {
      throw new ApiError(500, "something got cooked on our side, plis try again later.")
    }

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });


    const loggedInUser = {
      _id: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
    }

    return res.status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(201, loggedInUser, "you have been signed up!!")
      );
  })

const renewAccessToken = asyncHandler(
  async function (req, res) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "No refresh token recieved. Please login again.");
    }
    let tokenData;
    try {
      tokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(403, "Invalid or expired refresh token.");
    }
    const user = await User.findById(tokenData?.id).select("-_v");

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(403, "Invalid refresh token.");
    }
    const accessToken = await user.generateAccessToken();
    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", user.refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { userId: user._id },
          "Access token renewed."
        )
      );
  }
);

const logoutUser = asyncHandler(
  async function (req, res) {
    await User.findByIdAndUpdate(
      req.authUser._id,
      {
        $set: { refreshToken: null }
      }
    );

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(
          200,
          null,
          "User logged out successfully."
        )
      );
  }
);

const logUserIn = asyncHandler(
  async (req, res) => {
    const validateSchema = z.object({
      username: z.string().min(3).max(24).trim().toLowerCase().optional(),
      password: z.string().min(8).max(50),
      email: z.email().optional()
    }).refine((data) => data.username || data.email, {
      message: "either username or email must be provided to log you in.",
      path: ["username"]
    } )

    const parsedData = validateSchema.safeParse(req.body || {});

    if (!parsedData.success) {
      console.log(parsedData.error.issues)
      throw new ApiError(400, "invalid data provided")
    }

    const data = parsedData.data;

    const foundUser = await User.findOne({
      $or: [
        { username: data.username },
        { email: data.email }
      ]
    });

    if (!foundUser) {
      throw new ApiError(404, "user not found")
    };

    const isPasswordCorrect = await foundUser.isPasswordCorrect(data.password);

    if (!isPasswordCorrect) {
      throw new ApiError(403, "incorrect credentials")
    }

    return res.status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(201, loggedInUser, "you have been signed up!!")
      );
  })

export {
  registerUser,
  logUserIn
};
