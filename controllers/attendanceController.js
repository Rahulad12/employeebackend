import Attendance from "../models/Attendance.js";
import logger from "../utils/logger.js";
const createAttendance = async (req, res) => {
    logger.info("Attendance is Creating")
    const { date, clock_in, clock_out, status } = req.body;

    if (!date || !status) {
        return res.status(400).json({ message: "Date and status are required" });
    }
    // Convert  date to a comparable format
    const inputDate = new Date(date).toISOString().split("T")[0];
    const todayDate = new Date().toISOString().split("T")[0];
    // Ensure the date is not in the future
    if (inputDate > todayDate) {
        logger.warn("Future attendance is not allowed")
        return res.status(400).json({
            success: false,
            message: "Future attendance is not allowed."
        });
    }

    if (inputDate < todayDate) {
        logger.warn("Past attendance is not allowed for past")
        return res.status(400).json({
            success: false,
            message: "Past attendance is not allowed "
        });
    }

    try {
        // Check if attendance exists for today
        const existingAttendance = await Attendance.findOne({
            employee_id: req.params.id,
            date: inputDate
        })
        if (existingAttendance) {
            logger.warn("Attendance already taken for today")
            return res.status(400).json({
                success: false,
                message: "Attendance already taken for today."
            });
        }

        // Create new attendance record
        const newAttendance = new Attendance({
            employee_id: req.params.id,
            user_id: req.user.userId,
            date: inputDate,
            clock_in,
            clock_out,
            status
        });

        await newAttendance.save();
        logger.info("Attendace created successfully")
        return res.status(201).json({
            success: true,
            message: "Attendance created successfully"
        });

    } catch (error) {
        logger.error(`Error: ${error.message}`)
        return res.status(500).json({ message: error.message });
    }
};

const getAttendance = async (req, res) => {
    logger.info(`Fetching attendance of ${req.params.id}`)
    try {
        const attendance = await Attendance.find({ employee_id: req.params.id });

        if (!attendance.length) {
            logger.error("no attendance records found")
            return res.status(404).json({ message: "No attendance records found." });
        }
        logger.info("Attendance fetch successfully")
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        logger.error(`Error: ${error.message}`)
        return res.status(500).json({ message: error.message });
    }
};

export { createAttendance, getAttendance };
