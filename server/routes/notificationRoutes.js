const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

// ✅ Get all notifications for the logged-in user
router.get("/", protect, getNotifications);

// ✅ Mark all notifications as read
router.post("/mark-read", protect, markNotificationsAsRead);

module.exports = router;
