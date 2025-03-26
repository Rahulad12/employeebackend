import Leave from "../models/Leave.js";

const createLeave = async (req, res) => {
  const { leave_type, start_date, end_date, notes } = req.body;
  if (!leave_type || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newLeave = new Leave({
      employee_id: req.user.userId,
      leave_type,
      start_date,
      end_date,
      notes,
      status: "pending",
    });
    await newLeave.save();
    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      leave: newLeave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee_id: req.user.userId });
    if (leaves.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leaves found",
      });
    }
    res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { createLeave, getLeaves };
