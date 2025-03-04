// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const {
//   getNotifications,
//   markNotificationsAsRead,
// } =
//  require("../controllers/notificationController");

// const router = express.Router();

// // ✅ Get all notifications for the logged-in user
// router.get("/", protect, getNotifications);

// // ✅ Mark all notifications as read
// router.post("/mark-read", protect, markNotificationsAsRead);

// module.exports = router;
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// ✅ Get Logged-in User's Notifications
router.get("/", protect, getUserNotifications);

// ✅ Mark Notification as Read
// router.put("/:notificationId", protect, markNotificationAsRead);
router.put("/mark-all-as-read", protect, markAllAsRead);

// ✅ Delete a Notification
router.delete("/:notificationId", protect, deleteNotification);

module.exports = router;
