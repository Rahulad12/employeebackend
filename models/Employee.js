import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    join_date: {
      type: Date,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
