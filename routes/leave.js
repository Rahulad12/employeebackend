import express from "express";
import { auth } from "../middleware/accessMiddleware.js";
import { createLeave, getLeaves } from "../controllers/leaveControllers.js";
const leaveRouter = express.Router();

// @desc    Create a new leave request
// @route   POST /api/leave
// @access  Private

leaveRouter.post("/", auth, createLeave);
leaveRouter.get("/", auth, getLeaves);

export default leaveRouter;
