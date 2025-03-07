const express = require("express");
const Payment = require("../models/Payment");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  processPayment,
  getPaymentDetails,
  approvePayment,
  releasePayment,
  getFreelancerPayments,
  getPaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

// ✅ Client Approves Payment for Completed Task
//  router.post("/", protect, authorizeRoles("client"), processPayment);
// ✅ Client Approves Payment for Completed Task
router.post("/approve", protect, authorizeRoles("client"), approvePayment);

// ✅ Agency Owner Releases Payment to Freelancer
router.post("/release", protect, authorizeRoles("agencyOwner"), releasePayment);
// ✅ Get Payment History for Logged-In Freelancer
router.get(
  "/freelancer",
  protect,
  authorizeRoles("independentFreelancer", "agencyFreelancer", "agencyOwner"),
  getFreelancerPayments
);
// ✅ Get Payment Details
router.get("/:taskId", protect, getPaymentDetails);
// ✅ Get Payment History for a Specific Freelancer
// router.get("/freelancer/:freelancerId", protect, getFreelancerPayments);
// ✅ Backend Route to Get Payment Status

router.get("/status/:taskId", getPaymentStatus);

module.exports = router;
