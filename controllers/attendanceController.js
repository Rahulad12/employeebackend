import Attendance from "../models/Attendance.js";


const createAttendace = async (req, res) => {
    const { date, clock_in, clock_out, status } = req.body;
    if (!date || !status) {
        return res.status(400).json({ message: "Date and status are required" });
    }
    try {
        const newAttendance = new Attendance({ employee_id: req.params.id, user_id: req.user.userId, date, clock_in, clock_out, status });
        await newAttendance.save();
        return res.status(201).json({ success: true, message: "Attendance created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ employee_id: req.params.id });
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export { createAttendace, getAttendance };