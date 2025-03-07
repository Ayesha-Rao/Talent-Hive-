const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    agencyOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    commission: { type: Number, default: 0 }, // Agency Commission
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
    },

    // List of freelancers paid (for agency freelancers)
    freelancersPaid: [
      {
        freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number },
        status: { type: String, enum: ["paid"], default: "paid" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
