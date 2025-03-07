const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  addAgencyFreelancer,
  getAgencyFreelancers,
  removeFreelancer,
  getUserDetails,
} = require("../controllers/userController");

const router = express.Router();

router.post(
  "/add-freelancer",
  protect,
  authorizeRoles("agencyOwner"),
  addAgencyFreelancer
);

router.get(
  "/agency-freelancers",
  protect,
  authorizeRoles("agencyOwner"),
  getAgencyFreelancers
);

router.delete(
  "/remove-freelancer/:id",
  protect,
  authorizeRoles("agencyOwner"),
  removeFreelancer
);
// Get all User Details
router.get("/:userId", protect, getUserDetails);

module.exports = router;
