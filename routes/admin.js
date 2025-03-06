// import express from "express";
// import Employee from "../models/Employee.js";
// import User from "../models/User.js";
// const adminRouter = express.Router();

// // employee
// adminRouter.get("/employees", async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// adminRouter.post("/employee", async (req, res) => {
//   try {
//     const Employee = await Employee.create(req.body);
//     res.json(Employee);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// adminRouter.put("/employee/:id", async (req, res) => {
//   try {
//     const Employee = await Employee.findByIdAndUpdate(req.params.id, req.body);
//     res.json(Employee);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// adminRouter.delete("/employee/:id", async (req, res) => {
//   try {
//     const Employee = await Employee.findByIdAndDelete(req.params.id);
//     res.json(Employee);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// adminRouter.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // user
// adminRouter.put("/user/:id", async (req, res) => {
//   try {
//     const User = await User.findByIdAndUpdate(req.params.id, req.body);
//     res.json(User);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// adminRouter.delete("/user/:id", async (req, res) => {
//   try {
//     const User = await User.findByIdAndDelete(req.params.id);
//     res.json(User);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Attendance
// adminRouter.get("/attendance/:id", async (req, res) => {
//   try {
//     const Attendance = await Attendance.find({ employee_id: req.params.id });
//     res.json(Attendance);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// adminRouter.put("/attendance/:id", async (req, res) => {
//   try {
//     const Attendance = await Attendance.findByIdAndUpdate(
//       req.params.id,
//       req.body
//     );
//     res.json(Attendance);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default adminRouter;
import express from "express";
import {
  updateUser,
  getAllUser,
  getAllEmployee,
} from "../controllers/adminControllers.js";
const adminRouter = express.Router();

adminRouter.get("/alluser", getAllUser);
adminRouter.get("/allemployee", getAllEmployee);
adminRouter.put("/userupdate/:id", updateUser);

export default adminRouter;
