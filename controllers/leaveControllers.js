import Leave from "../models/Leave.js";
import logger from "../utils/logger.js";

const createLeave = async (req, res) => {
  logger.info("Creating leave request");
  const { leave_type, start_date, end_date, notes } = req.body;
  if (!leave_type || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const todayDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(start_date).toISOString().split("T")[0];
  const endDate = new Date(end_date).toISOString().split("T")[0];

  if (startDate > endDate) {
    logger.warn("Start date is greater than end date");
    return res.status(400).json({
      success: false,
      message: "Start date cannot be greater than end date",
    });
  }

  if (startDate < todayDate) {
    logger.warn("Start date is in the past");
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past",
    });
  }

  try {
    //existing leave of toaday 
    const existingLeave = await Leave.findOne({
      employee_id: req.params.id,
      start_date: { $lte: todayDate },
      end_date: { $gte: todayDate },
    });
    if (existingLeave) {
      logger.warn("Leave request already exists for today");
      return res.status(400).json({
        success: false,
        message: "You already have a leave request for today",
      });
    }
    const newLeave = new Leave({
      employee_id: req.params.id,
      user_id: req.user.userId,
      leave_type,
      start_date: startDate,
      end_date: endDate,
      notes,
      status: "pending",
    });
    await newLeave.save();
    logger.info("Leave request created successfully", newLeave);
    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      leave: newLeave,
    });
  } catch (error) {
    logger.error("Error creating leave request", error.message);
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLeaves = async (req, res) => {
  logger.info("Fetching leaves for user", req.user.userId);
  try {
    const leaves = await Leave.find({ user_id: req.user.userId }).sort({
      createdAt: -1,
    }).populate("employee_id", "name position department join_date");

    if (leaves.length === 0) {
      logger.warn("No leaves found for user", req.user.userId);
      return res.status(404).json({
        success: false,
        message: "No leaves found",
      });
    }
    logger.info("Leaves fetched successfully", leaves);
    res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    logger.error("Error fetching leaves", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { createLeave, getLeaves };
