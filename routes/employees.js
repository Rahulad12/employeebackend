import express from "express";
import { auth, isAdmin, isSuperAdmin } from "../middleware/accessMiddleware.js";
import {
  getAllEmployee,
  updateEmployee,
  createEmployee,
} from "../controllers/employeeControllers.js";
const empRouter = express.Router();

empRouter.get("/", auth, getAllEmployee);
empRouter.post("/register", auth, createEmployee);
empRouter.patch("/update/:id", auth, isSuperAdmin, updateEmployee);

export default empRouter;
