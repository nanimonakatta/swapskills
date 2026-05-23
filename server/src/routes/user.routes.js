import express from "express";

import { registerUser } from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post('/signup', registerUser);

export { userRouter };
