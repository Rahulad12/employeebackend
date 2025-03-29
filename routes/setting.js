import { updateUserEmail, updateUserPassword } from "../controllers/settingControllers.js";
import express from "express";
import { auth } from "../middleware/accessMiddleware.js";
const settingRouter = express.Router();

settingRouter.put("/user/updateemail", auth, updateUserEmail)
settingRouter.put("/user/updatepassword", auth, updateUserPassword);

export default settingRouter;