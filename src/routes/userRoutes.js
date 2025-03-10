import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

export default userRouter;
