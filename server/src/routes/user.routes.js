import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { logUserIn } from "../controllers/auth.controller.js"

const userRouter = express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', logUserIn)

export { userRouter };
