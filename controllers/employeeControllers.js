import Employee from "../models/Employee.js";
import logger from "../utils/logger.js";

//get all employee
const getEmployee = async (req, res) => {
  const userId = req.user.userId;
  logger.info(`Fetching Employee of ${userId}`);
  try {
    const emp = await Employee.find({ user_id: userId });

    if (!emp) {
      logger.info("Employee Not Found");

      return res.status(400).json({
        success: false,
        message: "Employee Not Found",
      });
    }

    logger.info("Employees fetched successfully");
    return res.status(200).json({
      success: true,
      emp,
    });
  } catch (error) {
    logger.error(`Error fetching employees ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error fetching employee: ${error}`,
    });
  }
};

//create Employee

const createEmployee = async (req, res) => {
  const { name, email, phone, position, department, joineddate } = req.body;
  if (!name || !email || !phone || !position || !department || !joineddate) {
    logger.error("All field are required");
    return res.status(400).json({
      success: false,
      message: "All field are required",
    });
  }
  logger.info("Creating employee");
  try {
    const existEmp = await Employee.findOne({ email: email });
    if (existEmp) {
      logger.error("Employee is already in our database");
      return res.status(400).json({
        success: false,
        message: "Employee is already in our database",
      });
    }
    joineddate = new Date(joineddate).toISOString().split("T")[0]; // Format date to YYYY-MM-DD

    const newEmp = new Employee({
      name: name,
      email: email,
      phone: phone,
      position: position,
      department: department,
      join_date: joineddate,
      user_id: req.user.userId,
    });
    await newEmp.save();
    logger.info("Employee register successfully");
    res.status(201).json({
      success: true,
      message: "Employee register successfully",
    });
  } catch (error) {
    logger.error(`Error creating employee: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error creating employee: ${error.message}`,
    });
  }
};

//updaing employee
const updateEmployee = async (req, res) => {
  const Id = req.params.id;
  logger.info(`updating employee of ${Id}`);
  try {
    const emp = await Employee.findByIdAndUpdate(Id, req.body, {
      new: true,
    });
    logger.info("Employee updated successfully");
    return res.status(201).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (error) {
    logger.warn(`Error update employee: ${error.message}`);
    return res.status(500).json({
      success: true,
      message: `Error update employee: ${error.message}`,
    });
  }
};

export { getEmployee, updateEmployee, createEmployee };
