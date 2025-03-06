import express from "express";
import Attendance from "../models/Attendance.js";
import { auth, isAdmin } from "../middleware/accessMiddleware.js";
import logger from "../utils/logger.js"
const router = express.Router();

// Get attendance logs for an employee
router.get("/:employeeId", auth, async (req, res) => {
  logger.info("Getting attendance logs for employee");
  try {
    const logs = await Attendance.find({ employee_id: req.params.employeeId });
    logger.info("Attendance logs fetched successfully");
    res.json(logs);
  } catch (error) {
    logger.error("Error fetching attendance logs", error);
    res.status(500).json({ message: error.message });
  }
});

// Create attendance log
router.post("/", auth, async (req, res) => {
  logger.info("Creating attendance log");
  try {
    const attendance = new Attendance(req.body);

    //check date of attendance
    const date = new Date(attendance.date);
    const today = new Date();
    if (date > today) {
      logger.info("Date cannot be in the future");
      return res.status(400).json({ message: "Date cannot be in the future" });
    }

    const employee = await Attendance.findOne({
      employee_id: req.body.employee_id,
      date: req.body.date,
    });
    if (employee) {
      logger.info("Attendance already exists for this employee on this date");
      return res.status(400).json({
        message: "Attendance already exists for this employee on this date",
      });
    }
    logger.info("Attendance log created successfully");
    const newAttendance = await attendance.save();
    res.status(201).json({message:"Attendance log created", newAttendance});

  } catch (error) {
    logger.error("Error creating attendance log", error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
