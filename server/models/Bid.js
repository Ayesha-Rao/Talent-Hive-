const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Freelancer or Agency
    amount: { type: Number, required: true },
    message: { type: String }, // Optional //not using
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);
