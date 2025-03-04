const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { submitReview, getUserReviews, getAverageRating } = require("../controllers/reviewController");

const router = express.Router();

// ✅ Submit a Review (Only Clients Can Review Freelancers)
router.post("/submit", protect, authorizeRoles("client"), submitReview);

// ✅ Get All Reviews for a User
router.get("/:userId", protect, getUserReviews);

// ✅ Get Average Rating for a User
router.get("/:userId/average", protect, getAverageRating);

module.exports = router;
