// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema({
//     taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
//     clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Independent Freelancer
//     agencyOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Only for Agency Owners
//     agencyFreelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Only for Agency Freelancers
//     amount: { type: Number, required: true },
//     commission: { type: Number, default: 0 }, // Only applicable if it's an agency
//     status: {
//         type: String,
//         enum: ["pending", "paid", "approved", "released"],
//         default: "pending"
//     }
// }, { timestamps: true });

// module.exports = mongoose.model("Payment", PaymentSchema);

// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema(
//   {
//     taskId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Task",
//       required: true,
//     },
//     clientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For Independent Freelancer
//     agencyOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For Agency Owner
//     agencyFreelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Add this field
//     amount: { type: Number, required: true },
//     commission: { type: Number, default: 0 }, // Agency Commission
//     status: {
//       type: String,
//       enum: ["pending", "approved", "paid"],
//       default: "pending",
//     },
//     // ✅ Store payments made to multiple freelancers
//     freelancersPaid: [
//       {
//         freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         amount: { type: Number },
//         status: { type: String, enum: ["paid"], default: "paid" },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Payment", PaymentSchema);

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
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For Independent Freelancer
    agencyOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For Agency Owner
    amount: { type: Number, required: true },
    commission: { type: Number, default: 0 }, // Agency Commission
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
    },

    // ✅ Tracks whether the agency owner has received payment from the client
    agencyOwnerPaid: { type: Boolean, default: false },

    // ✅ List of freelancers paid (for agency freelancers)
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
