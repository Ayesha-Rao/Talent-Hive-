const mongoose = require("mongoose");

const SubtaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["assigned", "in progress", "completed"],
      default: "assigned",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subtask", SubtaskSchema);
