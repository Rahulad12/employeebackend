import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import empRouter from "./routes/employees.js";
import attendanceRoutes from "./routes/attendance.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import leaveRouter from "./routes/leave.js";
import connectDB from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/employee", empRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/leave", leaveRouter);

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Api is running",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
