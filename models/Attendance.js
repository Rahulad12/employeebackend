import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    clock_in: {
      type: Date,
    },
    clock_out: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half_day"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
