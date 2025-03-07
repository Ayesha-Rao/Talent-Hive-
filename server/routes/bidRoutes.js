const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  placeBid,
  viewBids,
  acceptBid,
} = require("../controllers/bidController");

const router = express.Router();

// Freelancers & Agencies Place Bids
router.post(
  "/",
  protect,
  authorizeRoles("independentFreelancer", "agencyOwner"),
  placeBid
);

// Clients View Bids on Their Task
router.get("/:taskId", protect, authorizeRoles("client"), viewBids);

// Clients Accept a Bid
router.post("/accept", protect, authorizeRoles("client"), acceptBid);

module.exports = router;
