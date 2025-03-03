const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  addAgencyFreelancer,
  getAgencyFreelancers,
  removeFreelancer,
} = require("../controllers/userController");

const router = express.Router();

// ✅ Agency Owner can add Agency Freelancer
router.post(
  "/add-freelancer",
  protect,
  authorizeRoles("agencyOwner"),
  addAgencyFreelancer
);
// ✅ Fetch Freelancers under an Agency
router.get(
  "/agency-freelancers",
  protect,
  authorizeRoles("agencyOwner"),
  getAgencyFreelancers
);

// ✅ Remove a Freelancer
router.delete(
  "/remove-freelancer/:id",
  protect,
  authorizeRoles("agencyOwner"),
  removeFreelancer
);

module.exports = router;
