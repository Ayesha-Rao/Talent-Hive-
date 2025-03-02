const Payment = require("../models/Payment");
const Task = require("../models/Task");

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
            return res.status(403).json({ message: "Only the Client can approve payment." });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ taskId });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment has already been processed for this task." });
        }

        let paymentData = {
            taskId,
            clientId: req.user.id,
            amount: task.budget
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

        if (!payment) return res.status(404).json({ message: "Payment record not found." });

        // ✅ Extract details of each paid freelancer
        const freelancersPaid = payment.freelancersPaid.map(fp => ({
            freelancerId: fp.freelancerId._id,
            name: fp.freelancerId.name,
            email: fp.freelancerId.email,
            amountPaid: fp.amount,
            status: fp.status
        }));

        res.status(200).json({
            message: "Payment details retrieved successfully",
            client: {
                id: payment.clientId._id,
                name: payment.clientId.name,
                email: payment.clientId.email
            },
            agencyOwner: payment.agencyOwnerId ? {
                id: payment.agencyOwnerId._id,
                name: payment.agencyOwnerId.name,
                email: payment.agencyOwnerId.email
            } : null,
            totalAmount: payment.amount,
            commission: payment.commission,
            status: payment.status,
            freelancersPaid
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
        if (!taskId) return res.status(400).json({ message: "Task ID is required." });

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "❌ Task not found." });

        if (task.status !== "completed") {
            return res.status(400).json({ message: "❌ Task must be completed before approving payment." });
        }

        let payment = await Payment.findOne({ taskId });
        if (!payment) {
            console.log("⚠️ No payment record found, creating a new one...");
            payment = new Payment({ taskId, clientId: task.clientId, status: "pending" });
            await payment.save();
        }

        // ✅ Approve Payment
        payment.status = "approved";
        await payment.save();

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
//     try {
//         console.log("🔍 Releasing Payment...");
//         console.log("🔹 Request Body:", req.body);

//         const { paymentId } = req.body;

//         const payment = await Payment.findById(paymentId);
//         if (!payment) return res.status(404).json({ message: "Payment record not found." });

//         if (payment.status !== "approved") {
//             return res.status(400).json({ message: "Payment must be approved before release." });
//         }

//         // ✅ Check if it's an Independent Freelancer Payment
//         if (payment.freelancerId) {
//             console.log("✅ Releasing payment to Independent Freelancer");

//             payment.status = "paid";
//             await payment.save();

//             return res.status(200).json({
//                 message: "Payment released successfully",
//                 freelancerId: payment.freelancerId,
//                 amountPaid: payment.amount,
//                 status: "paid"
//             });
//         }

//         // ✅ If it's an Agency Task, proceed with normal payment distribution
//         const subtasks = await Subtask.find({ taskId: payment.taskId, status: "completed" });

//         if (subtasks.length === 0) {
//             return res.status(400).json({ message: "No completed subtasks found for this task." });
//         }

//         let freelancerIds = [...new Set(subtasks.map(subtask => subtask.assignedTo.toString()))];

//         if (freelancerIds.length === 0) {
//             return res.status(400).json({ message: "No freelancers assigned to subtasks." });
//         }

//         const agencyCommission = payment.amount * 0.05;
//         const totalAmountToDistribute = payment.amount - agencyCommission;
//         const paymentPerFreelancer = totalAmountToDistribute / freelancerIds.length;

//         payment.freelancersPaid = freelancerIds.map(freelancerId => ({
//             freelancerId,
//             amount: paymentPerFreelancer,
//             status: "paid"
//         }));

//         payment.commission = agencyCommission;
//         payment.status = "paid";
//         await payment.save();

//         res.status(200).json({
//             message: "Payment released successfully",
//             agencyCommission: agencyCommission,
//             freelancersPaid: payment.freelancersPaid
//         });

//     } catch (error) {
//         console.error("❌ Error Releasing Payment:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
// const releasePayment = async (req, res) => {
//     try {
//         console.log("🔍 Releasing Payment...");
//         console.log("🔹 Request Body:", req.body);

//         const { paymentId } = req.body;

//         const payment = await Payment.findById(paymentId);
//         if (!payment) return res.status(404).json({ message: "Payment record not found." });

//         if (payment.status !== "approved") {
//             return res.status(400).json({ message: "Payment must be approved before release." });
//         }

//         // ✅ If Independent Freelancer, release full payment
//         if (payment.freelancerId) {
//             console.log("✅ Releasing payment to Independent Freelancer");

//             payment.freelancersPaid = [{
//                 freelancerId: payment.freelancerId,
//                 amount: payment.amount,
//                 status: "paid"
//             }];

//             payment.status = "paid";
//             await payment.save();

//             return res.status(200).json({
//                 message: "Payment released successfully",
//                 freelancersPaid: payment.freelancersPaid
//             });
//         }

//         // ✅ If it's an Agency Task, proceed with normal payment distribution
//         const subtasks = await Subtask.find({ taskId: payment.taskId, status: "completed" });

//         if (subtasks.length === 0) {
//             return res.status(400).json({ message: "No completed subtasks found for this task." });
//         }

//         let freelancerIds = [...new Set(subtasks.map(subtask => subtask.assignedTo.toString()))];

//         if (freelancerIds.length === 0) {
//             return res.status(400).json({ message: "No freelancers assigned to subtasks." });
//         }

//         const agencyCommission = payment.amount * 0.05;
//         const totalAmountToDistribute = payment.amount - agencyCommission;
//         const paymentPerFreelancer = totalAmountToDistribute / freelancerIds.length;

//         payment.freelancersPaid = freelancerIds.map(freelancerId => ({
//             freelancerId,
//             amount: paymentPerFreelancer,
//             status: "paid"
//         }));

//         payment.commission = agencyCommission;
//         payment.status = "paid";
//         await payment.save();

//         res.status(200).json({
//             message: "Payment released successfully",
//             agencyCommission: agencyCommission,
//             freelancersPaid: payment.freelancersPaid
//         });

//     } catch (error) {
//         console.error("❌ Error Releasing Payment:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
const releasePayment = async (req, res) => {
    try {
        console.log("🔍 Releasing Payment...");
        console.log("🔹 Request Body:", req.body);

        const { paymentId } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ message: "Payment record not found." });

        if (payment.status !== "approved") {
            return res.status(400).json({ message: "Payment must be approved before release." });
        }

        // ✅ Independent Freelancer Payment
        // if (payment.freelancerId) {
        //     console.log("✅ Releasing payment to Independent Freelancer");

        //     payment.freelancersPaid = [{
        //         freelancerId: payment.freelancerId.toString(), // Ensure it's stored as a string
        //         amount: payment.amount,
        //         status: "paid"
        //     }];

        //     payment.status = "paid";
        //     await payment.save();

        //     return res.status(200).json({
        //         message: "Payment released successfully",
        //         freelancersPaid: payment.freelancersPaid
        //     });
        // }
        // ✅ Independent Freelancer Payment (Direct Payment)
        if (payment.freelancerId) {
            console.log("✅ Releasing payment to Independent Freelancer:", payment.freelancerId);

            // Ensure `freelancersPaid` array gets updated correctly
            payment.freelancersPaid = [{
                freelancerId: payment.freelancerId.toString(), // Ensure it's stored as a string
                amount: payment.amount, // Full payment to freelancer
                status: "paid"
            }];

            payment.status = "paid";
            await payment.save();
            
            // Double-check the database update
            await Payment.updateOne(
                { _id: payment._id },
                { 
                    $set: { 
                        freelancersPaid: payment.freelancersPaid, 
                        status: "paid" 
                    } 
                }
            );

            console.log("✅ Final freelancersPaid array:", payment.freelancersPaid);

            return res.status(200).json({
                message: "Payment released successfully",
                freelancersPaid: payment.freelancersPaid
            });
        }


        // ✅ If it's an Agency Task, proceed with normal payment distribution
        const subtasks = await Subtask.find({ taskId: payment.taskId, status: "completed" });

        if (subtasks.length === 0) {
            return res.status(400).json({ message: "No completed subtasks found for this task." });
        }

        let freelancerIds = [...new Set(subtasks.map(subtask => subtask.assignedTo.toString()))];

        if (freelancerIds.length === 0) {
            return res.status(400).json({ message: "No freelancers assigned to subtasks." });
        }

        const agencyCommission = payment.amount * 0.05;
        const totalAmountToDistribute = payment.amount - agencyCommission;
        const paymentPerFreelancer = totalAmountToDistribute / freelancerIds.length;

        payment.freelancersPaid = freelancerIds.map(freelancerId => ({
            freelancerId: freelancerId.toString(), // Convert to string for consistency
            amount: paymentPerFreelancer,
            status: "paid"
        }));

        payment.commission = agencyCommission;
        payment.status = "paid";
        await payment.save();

        res.status(200).json({
            message: "Payment released successfully",
            agencyCommission: agencyCommission,
            freelancersPaid: payment.freelancersPaid
        });

    } catch (error) {
        console.error("❌ Error Releasing Payment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// const getFreelancerPayments = async (req, res) => {
//     try {
//         const freelancerId = req.params.freelancerId;

//         // Find all payments where this freelancer was paid
//         const payments = await Payment.find({ "freelancersPaid.freelancerId": freelancerId });

//         if (payments.length === 0) {
//             return res.status(404).json({ message: "No payments found for this freelancer." });
//         }

//         // ✅ Only return freelancer's payment details (hide commission)
//         const response = payments.map(payment => ({
//             taskId: payment.taskId,
//             amountPaid: payment.freelancersPaid.find(fp => fp.freelancerId.toString() === freelancerId)?.amount || 0,
//             status: payment.status
//         }));

//         res.status(200).json({
//             message: "Payment history retrieved successfully",
//             payments: response
//         });
//     } catch (error) {
//         console.error("❌ Error Fetching Freelancer Payments:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
// const getFreelancerPayments = async (req, res) => {
//     try {
//         const freelancerId = req.user.id; // Get logged-in freelancer ID

//         // Find all payments where this freelancer was paid
//         const payments = await Payment.find({ "freelancersPaid.freelancerId": freelancerId })
//             .populate("taskId", "title")
//             .populate("freelancersPaid.freelancerId", "name email");

//         if (payments.length === 0) {
//             return res.status(404).json({ message: "No payments found for this freelancer." });
//         }

//         // ✅ Only return freelancer's payment details (hide commission)
//         const response = payments.map(payment => {
//             const freelancerPayment = payment.freelancersPaid.find(fp => fp.freelancerId._id.toString() === freelancerId);
//             return {
//                 taskId: payment.taskId._id,
//                 taskTitle: payment.taskId.title,
//                 amountPaid: freelancerPayment ? freelancerPayment.amount : 0,
//                 status: payment.status
//             };
//         });

//         res.status(200).json({
//             message: "Payment history retrieved successfully",
//             payments: response
//         });
//     } catch (error) {
//         console.error("❌ Error Fetching Freelancer Payments:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


const getFreelancerPayments = async (req, res) => {
    try {
        const freelancerId = req.user.id; // Get logged-in freelancer ID
        console.log("🔍 Fetching Payment History for Freelancer:", freelancerId);

        // Find all payments where this freelancer was paid
        const payments = await Payment.find({ "freelancersPaid.freelancerId": freelancerId })
            .populate("taskId", "title")
            .populate("freelancersPaid.freelancerId", "name email");

        if (payments.length === 0) {
            console.log("❌ No payments found for this freelancer.");
            return res.status(404).json({ message: "No payments found for this freelancer." });
        }

        // ✅ Only return freelancer's payment details
        const response = payments.map(payment => {
            const freelancerPayment = payment.freelancersPaid.find(fp => fp.freelancerId._id.toString() === freelancerId);
            return {
                taskId: payment.taskId?._id,
                taskTitle: payment.taskId?.title,
                amountPaid: freelancerPayment ? freelancerPayment.amount : 0,
                status: payment.status
            };
        });

        res.status(200).json({
            message: "Payment history retrieved successfully",
            payments: response
        });
    } catch (error) {
        console.error("❌ Error Fetching Freelancer Payments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { processPayment, getPaymentDetails, approvePayment, releasePayment,getFreelancerPayments };
