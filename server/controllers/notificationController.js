// const Notification = require("../models/Notifications");

// // ✅ Fetch notifications for logged-in user
// const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user.id }).sort(
//       { createdAt: -1 }
//     );
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("❌ Error Fetching Notifications:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ✅ Mark notifications as read
// const markNotificationsAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany({ userId: req.user.id }, { read: true });
//     res.status(200).json({ message: "All notifications marked as read" });
//   } catch (error) {
//     console.error("❌ Error Marking Notifications as Read:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ✅ Internal function to create notifications
// const createNotification = async (userId, message, type) => {
//   try {
//     const notification = new Notification({ userId, message, type });
//     await notification.save();
//   } catch (error) {
//     console.error("❌ Error Creating Notification:", error);
//   }
// };

// module.exports = {
//   getNotifications,
//   markNotificationsAsRead,
//   createNotification,
// };
const Notification = require("../models/Notification");

// ✅ Create a New Notification (Called from Task, Bid, or Payment Controllers)
const createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({ userId, message, type });
    await notification.save();
    console.log("✅ Notification Created:", notification);
  } catch (error) {
    console.error("❌ Error Creating Notification:", error);
  }
};

// ✅ Get Notifications for Logged-in User
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error Fetching Notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Mark a Notification as Read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("❌ Error Marking Notification as Read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a Notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("❌ Error Deleting Notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
