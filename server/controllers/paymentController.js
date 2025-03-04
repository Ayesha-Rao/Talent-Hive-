const Payment = require("../models/Payment");
const Task = require("../models/Task");
const { createNotification } = require("../controllers/notificationController");

// ✅ Client Approves Task Completion & Initiates Payment
const processPayment = async (req, res) => {
  try {
    console.log("🔍 Processing Payment...");
    console.log("🔹 Request Body:", req.body);

    const { taskId } = req.body;

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only the Client who posted the task can approve payment
    if (task.clientId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the Client can approve payment." });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ taskId });
    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment has already been processed for this task." });
    }

    let paymentData = {
      taskId,
      clientId: req.user.id,
      amount: task.budget,
    };

    if (task.assignedTo) {
      paymentData.freelancerId = task.assignedTo;
    }

    // Create a new payment record
    const payment = new Payment(paymentData);
    await payment.save();

    console.log("✅ Payment Processed:", payment);

    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    console.error("❌ Error Processing Payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Payment Details (Client & Freelancer)

const getPaymentDetails = async (req, res) => {
  try {
    console.log("🔍 Fetching Payment Details...");
    console.log("🔹 Request Params:", req.params);

    const { taskId } = req.params;

    const payment = await Payment.findOne({ taskId })
      .populate("clientId", "name email")
      .populate("freelancerId", "name email")
      .populate("agencyOwnerId", "name email")
      .populate("freelancersPaid.freelancerId", "name email"); // ✅ Populate freelancersPaid correctly

    if (!payment)
      return res.status(404).json({ message: "Payment record not found." });

    // ✅ Extract details of each paid freelancer
    const freelancersPaid = payment.freelancersPaid.map((fp) => ({
      freelancerId: fp.freelancerId._id,
      name: fp.freelancerId.name,
      email: fp.freelancerId.email,
      amountPaid: fp.amount,
      status: fp.status,
    }));

    res.status(200).json({
      message: "Payment details retrieved successfully",
      client: {
        id: payment.clientId._id,
        name: payment.clientId.name,
        email: payment.clientId.email,
      },
      agencyOwner: payment.agencyOwnerId
        ? {
            id: payment.agencyOwnerId._id,
            name: payment.agencyOwnerId.name,
            email: payment.agencyOwnerId.email,
          }
        : null,
      totalAmount: payment.amount,
      commission: payment.commission,
      status: payment.status,
      freelancersPaid,
    });
  } catch (error) {
    console.error("❌ Error Fetching Payment Details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const approvePayment = async (req, res) => {
  try {
    console.log("🔍 Approving Payment for Task ID:", req.body.taskId);

    const { taskId } = req.body;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required." });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "❌ Task not found." });
    

    if (task.status !== "completed") {
      return res.status(400).json({
        message: "❌ Task must be completed before approving payment.",
      });
    }

    let payment = await Payment.findOne({ taskId });
    if (!payment) {
      console.log("⚠️ No payment record found, creating a new one...");
      payment = new Payment({
        taskId,
        clientId: task.clientId,
        amount: task.budget, // ✅ Fix: Ensure amount is included
        status: "approved",
      });
      await payment.save();
    } else {
      // ✅ If payment exists, update status to approved
      payment.status = "approved";
      await payment.save();
    }
      // ✅ Notify the freelancer or agency that payment is approved
      if (payment.freelancerId) {
        await createNotification(payment.freelancerId, `Payment approved for your completed task`, "payment");
    } else if (payment.agencyOwnerId) {
        await createNotification(payment.agencyOwnerId, `Payment approved for your agency's task`, "payment");
    }

    console.log("✅ Payment Approved:", payment);
    res.status(200).json({ message: "Payment approved successfully", payment });
  } catch (error) {
    console.error("❌ Error Approving Payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const Subtask = require("../models/Subtask");
const User = require("../models/User");

// const releasePayment = async (req, res) => {
//   try {
//     console.log("🔍 Releasing Payment...");
//     console.log("🔹 Request Body:", req.body);

//     const { paymentId } = req.body;

//     const payment = await Payment.findById(paymentId);
//     if (!payment)
//       return res.status(404).json({ message: "Payment record not found." });

//     if (payment.status !== "approved") {
//       return res
//         .status(400)
//         .json({ message: "Payment must be approved before release." });
//     }

//     // ✅ Independent Freelancer Payment (Direct Payment)
//     if (payment.freelancerId) {
//       console.log(
//         "✅ Releasing payment to Independent Freelancer:",
//         payment.freelancerId
//       );

//       // Ensure `freelancersPaid` array gets updated correctly
//       payment.freelancersPaid = [
//         {
//           freelancerId: payment.freelancerId.toString(), // Ensure it's stored as a string
//           amount: payment.amount, // Full payment to freelancer
//           status: "paid",
//         },
//       ];

//       payment.status = "paid";
//       await payment.save();

//       // Double-check the database update
//       await Payment.updateOne(
//         { _id: payment._id },
//         {
//           $set: {
//             freelancersPaid: payment.freelancersPaid,
//             status: "paid",
//           },
//         }
//       );

//       console.log("✅ Final freelancersPaid array:", payment.freelancersPaid);

//       return res.status(200).json({
//         message: "Payment released successfully",
//         freelancersPaid: payment.freelancersPaid,
//       });
//     }

//     // ✅ If it's an Agency Task, proceed with normal payment distribution
//     const subtasks = await Subtask.find({
//       taskId: payment.taskId,
//       status: "completed",
//     });

//     if (subtasks.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No completed subtasks found for this task." });
//     }

//     let freelancerIds = [
//       ...new Set(subtasks.map((subtask) => subtask.assignedTo.toString())),
//     ];

//     if (freelancerIds.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No freelancers assigned to subtasks." });
//     }

//     const agencyCommission = payment.amount * 0.05;
//     const totalAmountToDistribute = payment.amount - agencyCommission;
//     const paymentPerFreelancer = totalAmountToDistribute / freelancerIds.length;

//     payment.freelancersPaid = freelancerIds.map((freelancerId) => ({
//       freelancerId: freelancerId.toString(), // Convert to string for consistency
//       amount: paymentPerFreelancer,
//       status: "paid",
//     }));

//     payment.commission = agencyCommission;
//     payment.status = "paid";
//     await payment.save();

//     res.status(200).json({
//       message: "Payment released successfully",
//       agencyCommission: agencyCommission,
//       freelancersPaid: payment.freelancersPaid,
//     });
//   } catch (error) {
//     console.error("❌ Error Releasing Payment:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const releasePayment = async (req, res) => {
  try {
    console.log("🔍 Releasing Payment...");
    console.log("🔹 Request Body:", req.body);

    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      console.log("❌ Payment not found");
      return res.status(404).json({ message: "Payment record not found." });
    }

    if (payment.status !== "approved") {
      console.log("❌ Payment must be approved before release.");
      return res
        .status(400)
        .json({ message: "Payment must be approved before release." });
    }

    console.log("✅ Payment Found:", payment);

    // ✅ Independent Freelancer Case
    if (payment.freelancerId) {
      console.log("✅ Paying Independent Freelancer:", payment.freelancerId);

      payment.freelancersPaid = [
        {
          freelancerId: payment.freelancerId.toString(),
          amount: payment.amount,
          status: "paid",
        },
      ];

      payment.status = "paid";
      await payment.save();

      console.log(
        "✅ Final freelancersPaid array (Independent):",
        payment.freelancersPaid
      );

      return res.status(200).json({
        message: "Payment released successfully",
        freelancersPaid: payment.freelancersPaid,
      });
    }

    // ✅ Agency Owner Payment
    if (payment.agencyOwnerId && !payment.agencyOwnerPaid) {
      console.log("✅ Paying Agency Owner:", payment.agencyOwnerId);

      // Agency takes 5% commission
      const agencyCommission = payment.amount * 0.05;
      const totalAfterCommission = payment.amount - agencyCommission;

      console.log(`✅ Agency Commission Deducted: ${agencyCommission}`);
      console.log(`✅ Total Payment to Agency Owner: ${totalAfterCommission}`);

      // ✅ Mark Agency Owner as paid
      payment.freelancersPaid.push({
        freelancerId: payment.agencyOwnerId.toString(),
        amount: totalAfterCommission,
        status: "paid",
      });

      payment.commission = agencyCommission;
      payment.agencyOwnerPaid = true;
      await payment.save();

      console.log("✅ Agency Owner Paid:", payment.freelancersPaid);
      return res
        .status(200)
        .json({ message: "Agency Owner Paid Successfully", payment });
    }

    // ✅ Agency Owner Pays Freelancers
    if (payment.agencyOwnerPaid) {
      console.log("✅ Agency Owner Distributing Payments...");

      // ✅ Find completed subtasks for the task
      const subtasks = await Subtask.find({
        taskId: payment.taskId,
        status: "completed",
      });

      console.log("✅ Completed Subtasks Found:", subtasks.length);

      if (subtasks.length === 0) {
        return res
          .status(400)
          .json({ message: "No completed subtasks found for this task." });
      }

      // ✅ Get freelancers who worked on subtasks
      let freelancerIds = [
        ...new Set(subtasks.map((subtask) => subtask.assignedTo.toString())),
      ];

      console.log("✅ Freelancers Assigned to Subtasks:", freelancerIds);

      if (freelancerIds.length === 0) {
        return res
          .status(400)
          .json({ message: "No freelancers assigned to subtasks." });
      }

      // ✅ Divide payment after commission
      const paymentPerFreelancer =
        (payment.amount - payment.commission) / freelancerIds.length;

      freelancerIds.forEach((freelancerId) => {
        console.log(
          `✅ Paying Freelancer ${freelancerId}: ${paymentPerFreelancer}`
        );
        payment.freelancersPaid.push({
          freelancerId: freelancerId.toString(),
          amount: paymentPerFreelancer,
          status: "paid",
        });
      });

      payment.status = "paid";
      await payment.save();

      console.log("✅ Final Payment Distributed:", payment.freelancersPaid);

      return res.status(200).json({
        message: "Payment released successfully",
        agencyCommission: payment.commission,
        freelancersPaid: payment.freelancersPaid,
      });
    }

    return res.status(400).json({ message: "Unexpected Payment Flow Issue" });
  } catch (error) {
    console.error("❌ Error Releasing Payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFreelancerPayments = async (req, res) => {
  try {
    const freelancerId = req.user.id; // Get logged-in freelancer ID
    console.log("🔍 Fetching Payment History for Freelancer:", freelancerId);

    // Find all payments where this freelancer was paid
    const payments = await Payment.find({
      "freelancersPaid.freelancerId": freelancerId,
    })
      .populate("taskId", "title")
      .populate("freelancersPaid.freelancerId", "name email");

    if (payments.length === 0) {
      console.log("❌ No payments found for this freelancer.");
      return res
        .status(404)
        .json({ message: "No payments found for this freelancer." });
    }

    // ✅ Only return freelancer's payment details
    const response = payments.map((payment) => {
      const freelancerPayment = payment.freelancersPaid.find(
        (fp) => fp.freelancerId._id.toString() === freelancerId
      );
      return {
        taskId: payment.taskId?._id,
        taskTitle: payment.taskId?.title,
        amountPaid: freelancerPayment ? freelancerPayment.amount : 0,
        status: payment.status,
      };
    });

    res.status(200).json({
      message: "Payment history retrieved successfully",
      payments: response,
    });
  } catch (error) {
    console.error("❌ Error Fetching Freelancer Payments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  processPayment,
  getPaymentDetails,
  approvePayment,
  releasePayment,
  getFreelancerPayments,
};
