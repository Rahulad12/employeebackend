import User from "../models/User.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

// Register the user
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    logger.warn("Email and Password are required");
    return res.status(400).json({ message: "Email and Password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password, role: "employee" });
    await newUser.save();
    logger.info("User registered successfully");
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    logger.warn(`Error registering user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in registering user: ${error.message}`,
    });
  }
};

// Login the user
const authUser = async (req, res) => {
  const { email, password } = req.body;
  logger.info("Logging in user...");
  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("User does not exist");
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if user is inactive
    if (user.status === "inactive") {
      logger.warn("User is inactive and cannot log in");
      return res.status(400).json({
        success: false,
        message: "User is inactive and cannot log in",
      });
    }

    // Checking if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn("Invalid credentials");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, isAuthenticated: user.isAuthenticated },
      process.env.JWT_SECRET
    );

    user.isAuthenticated = true;
    await user.save();

    logger.info("Login successful");
    return res.status(200).json({
      success: true,
      user: {
        role: user.role,
        isAuthenticated: user.isAuthenticated,
        isFormCompleted: user.isFormCompleted,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    logger.warn(`Error logging in user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const logoutUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    user.isAuthenticated = false;
    await user.save();
    logger.info("User logged out successfully");
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    logger.warn(`Error logging out user: ${error.message}`);
    return res.status(500).json({ success: false, message: `Error logging out user: ${error.message}` });
  }

};

const getUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt ");
    if (!user) {
      logger.warn("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    logger.info("User fetched successfully");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    logger.warn(`Error fetching user: ${error.message}`);
    return res.status(500).json({ success: false, message: `Error fetching user: ${error.message}` });
  }
}
export { authUser, registerUser, logoutUser, getUser };
