const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { addAgencyFreelancer } = require("../controllers/userController");

const router = express.Router();

// ✅ Agency Owner can add Agency Freelancer
router.post("/add-freelancer", protect, authorizeRoles("agencyOwner"), addAgencyFreelancer);

module.exports = router;
