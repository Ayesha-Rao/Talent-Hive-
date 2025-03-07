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

router.post("/approve", protect, authorizeRoles("client"), approvePayment);

router.post("/release", protect, authorizeRoles("agencyOwner"), releasePayment);

router.get(
  "/freelancer",
  protect,
  authorizeRoles("independentFreelancer", "agencyFreelancer", "agencyOwner"),
  getFreelancerPayments
);

router.get("/:taskId", protect, getPaymentDetails);

router.get("/status/:taskId", getPaymentStatus);

module.exports = router;
