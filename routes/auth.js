import express from "express";
import { registerUser, authUser } from "../controllers/authControllers.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", authUser);

export default authRouter;
