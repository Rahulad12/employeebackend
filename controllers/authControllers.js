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
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    logger.info("Login successful");
    return res.status(200).json({
      success: true,
      user: {
        role: user.role,
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

export { authUser, registerUser };
