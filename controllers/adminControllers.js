import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

const updateUser = async (req, res) => {
  const Id = req.params.id;
  const updates = req.body;
  try {
    const user = await User.findById(Id);
    if (!user) {
      return (
        res.status(400),
        json({
          success: false,
          message: "User does not exist",
        })
      );
    }
    Object.keys(updates).forEach((key) => {
      if (key !== "password" && updates[key]) {
        user[key] = updates[key];
      }
    });

    const updatedUser = await user.save();
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User banned failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User update successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error}`,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const user = await User.find({}).select("-password");
    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user is not found in database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const emp = await Employee.find({}).populate({
      path: "user_id",
      select: "status",
    });
    if (!emp) {
      return res.status(400).json({
        success: false,
        message: "Error fetching employee",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee Fetched Successfully",
      emp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};
export { updateUser, getAllUser, getAllEmployee };
