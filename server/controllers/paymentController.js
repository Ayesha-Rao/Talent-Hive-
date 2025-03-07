const Payment = require("../models/Payment");
const Task = require("../models/Task");
const { createNotification } = require("../controllers/notificationController");
const Subtask = require("../models/Subtask");
const User = require("../models/User");

// Client Approves Task Completion & Initiates Payment
const processPayment = async (req, res) => {
  try {
    console.log("Processing Payment...");
    console.log("Request Body:", req.body);

    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.clientId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the Client can approve payment." });
    }

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

    const payment = new Payment(paymentData);
    await payment.save();

    console.log("Payment Processed:", payment);

    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    console.error("Error Processing Payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    console.log("Fetching Payment Details...");
    console.log("Request Params:", req.params);

    const { taskId } = req.params;

    const payment = await Payment.findOne({ taskId })
      .populate("clientId", "name email")
      .populate("freelancerId", "name email")
      .populate("agencyOwnerId", "name email")
      .populate("freelancersPaid.freelancerId", "name email");

    if (!payment)
      return res.status(404).json({ message: "Payment record not found." });

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
    console.error("Error Fetching Payment Details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const approvePayment = async (req, res) => {
  try {
    console.log("Approving Payment for Task ID:", req.body.taskId);

    const { taskId } = req.body;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required." });

    const task = await Task.findById(taskId).populate("assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found." });

    if (task.status !== "completed") {
      return res.status(400).json({
        message: "Task must be completed before approving payment.",
      });
    }

    console.log("Task Found:", task);
    console.log("Task Assigned To:", task.assignedTo);

    let payment = await Payment.findOne({ taskId });
    if (!payment) {
      console.log("⚠️ No payment record found, creating a new one...");

      let freelancerId = null;
      let agencyOwnerId = null;

      if (task.assignedTo) {
        console.log("🔹 Task Assigned To Role:", task.assignedTo.role);

        if (task.assignedTo.role === "independentFreelancer") {
          freelancerId = task.assignedTo._id;
          console.log("Storing freelancerId:", freelancerId);
        } else if (task.assignedTo.role === "agencyOwner") {
          agencyOwnerId = task.assignedTo._id;
          console.log("Storing agencyOwnerId:", agencyOwnerId);
        }
      }

      payment = new Payment({
        taskId,
        clientId: task.clientId,
        amount: task.budget,
        status: "approved",
        freelancerId,
        agencyOwnerId,
      });

      await payment.save();
    } else {
      console.log("Existing Payment Found, Updating...");
      payment.status = "approved";

      if (!payment.freelancerId && !payment.agencyOwnerId) {
        if (task.assignedTo) {
          console.log(
            "Checking Assigned User Role Again:",
            task.assignedTo.role
          );

          if (task.assignedTo.role === "independentFreelancer") {
            payment.freelancerId = task.assignedTo._id;
            console.log("Updated freelancerId:", payment.freelancerId);
          } else if (task.assignedTo.role === "agencyOwner") {
            payment.agencyOwnerId = task.assignedTo._id;
            console.log("Updated agencyOwnerId:", payment.agencyOwnerId);
          }
        }
      }

      await payment.save();
    }

    console.log("Final Payment Record:", payment);

    // Notify
    if (payment.freelancerId) {
      await createNotification(
        payment.freelancerId,
        `Payment approved for your completed task`,
        "payment"
      );
    } else if (payment.agencyOwnerId) {
      await createNotification(
        payment.agencyOwnerId,
        `Payment approved for your agency's task`,
        "payment"
      );
    }

    res.status(200).json({ message: "Payment approved successfully", payment });
  } catch (error) {
    console.error("Error Approving Payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const releasePayment = async (req, res) => {
  try {
    console.log("Releasing Payment for Agency Freelancer...");
    console.log("Request Body:", req.body);

    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      console.log("Payment not found");
      return res.status(404).json({ message: "Payment record not found." });
    }

    if (payment.status !== "approved") {
      console.log("Payment must be approved before release.");
      return res
        .status(400)
        .json({ message: "Payment must be approved before release." });
    }

    if (!payment.agencyOwnerId) {
      console.log("Payment is not for an agency task.");
      return res.status(400).json({
        message: "Only agency owners can release payments to freelancers.",
      });
    }

    console.log("Payment Found for Agency Owner:", payment.agencyOwnerId);

    // Find completed subtasks assigned to freelancers
    const completedSubtasks = await Subtask.find({
      taskId: payment.taskId,
      status: "completed",
    });

    if (completedSubtasks.length === 0) {
      return res
        .status(400)
        .json({ message: "No completed subtasks found for this task." });
    }

    // Get  freelancers who worked on subtasks
    let freelancerIds = [
      ...new Set(
        completedSubtasks.map((subtask) => subtask.assignedTo.toString())
      ),
    ];

    if (freelancerIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No freelancers assigned to subtasks." });
    }

    console.log("Freelancers Assigned to Subtasks:", freelancerIds);

    if (payment.commission > 0) {
      return res.status(400).json({ message: "Commission already deducted." });
    }

    // Deduct Agency Commission 5%
    const agencyCommission = payment.amount * 0.05;
    const totalAfterCommission = payment.amount - agencyCommission;

    console.log(`Agency Commission Deducted: ${agencyCommission}`);
    console.log(`Total Amount to be distributed: ${totalAfterCommission}`);

    // Divide remaining amount among freelancers
    const paymentPerFreelancer = totalAfterCommission / freelancerIds.length;

    freelancerIds.forEach((freelancerId) => {
      console.log(`Paying Freelancer ${freelancerId}: ${paymentPerFreelancer}`);
      payment.freelancersPaid.push({
        freelancerId: freelancerId.toString(),
        amount: paymentPerFreelancer,
        status: "paid",
      });
    });

    payment.commission = agencyCommission;
    payment.status = "paid"; //Mark full payment as done
    await payment.save();

    console.log("Final Payment Distributed:", payment.freelancersPaid);

    return res.status(200).json({
      message: "Payment released successfully to freelancers",
      agencyCommission: payment.commission,
      freelancersPaid: payment.freelancersPaid,
    });
  } catch (error) {
    console.error("Error Releasing Payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFreelancerPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Fetching Payment History for User:", userId);

    //finfing freelancvers
    const payments = await Payment.find({
      $or: [
        { freelancerId: userId },
        { agencyOwnerId: userId },
        { "freelancersPaid.freelancerId": userId },
      ],
    })
      .populate("taskId", "title")
      .populate("freelancerId", "name email")
      .populate("agencyOwnerId", "name email")
      .populate("freelancersPaid.freelancerId", "name email");

    console.log("Payments Found:", payments);

    if (!payments || payments.length === 0) {
      console.log("No payments found for this user.");
      return res
        .status(404)
        .json({ message: "No payments found for this user." });
    }

    // Format response
    const response = payments
      .map((payment) => {
        console.log("🔹 Processing Payment:", payment);

        if (
          payment.freelancerId &&
          payment.freelancerId._id.toString() === userId
        ) {
          console.log("Independent Freelancer Payment Found:", payment);
          return {
            paymentId: payment._id,
            taskId: payment.taskId?._id,
            taskTitle: payment.taskId?.title,
            amountPaid: payment.amount,
            status: payment.status,
            type: "Independent Freelancer",
          };
        }

        if (
          payment.agencyOwnerId &&
          payment.agencyOwnerId._id.toString() === userId
        ) {
          console.log("✅ Agency Owner Payment Found:", payment);
          return {
            paymentId: payment._id,
            taskId: payment.taskId?._id,
            taskTitle: payment.taskId?.title,
            amountPaid: payment.amount - payment.commission,
            status: payment.status,
            type: "Agency Owner",
          };
        }

        //Agency Freelancer Payment
        const freelancerPayment = payment.freelancersPaid.find(
          (fp) => fp.freelancerId && fp.freelancerId._id.toString() === userId
        );

        if (freelancerPayment) {
          console.log("✅ Agency Freelancer Payment Found:", freelancerPayment);
          return {
            paymentId: payment._id,
            taskId: payment.taskId?._id,
            taskTitle: payment.taskId?.title,
            amountPaid: freelancerPayment.amount || 0, //amount paid from freelancersPaid array
            status: payment.status,
            type: "Agency Freelancer",
          };
        }

        console.log("Payment does not match user role, skipping.");
        return null;
      })
      .filter(Boolean);

    console.log("Final Response:", response);

    res.status(200).json({
      message: "Payment history retrieved successfully",
      payments: response,
    });
  } catch (error) {
    console.error("Error Fetching User Payments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//ayment status
const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ taskId: req.params.taskId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ status: payment.status });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  processPayment,
  getPaymentDetails,
  approvePayment,
  releasePayment,
  getFreelancerPayments,
  getPaymentStatus,
};
