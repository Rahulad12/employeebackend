import express from "express";
import { registerUser, authUser, logoutUser, getUser } from "../controllers/authControllers.js";
import { auth } from "../middleware/accessMiddleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", authUser);
authRouter.post("/logout", auth, logoutUser);
authRouter.get("/user", auth, getUser);

export default authRouter;
