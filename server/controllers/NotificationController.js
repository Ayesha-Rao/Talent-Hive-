const Notification = require("../models/Notifications");

// ✅ Fetch notifications for logged-in user
const getNotifications = async (req, res) => {
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

// ✅ Mark notifications as read
const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("❌ Error Marking Notifications as Read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Internal function to create notifications
const createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({ userId, message, type });
    await notification.save();
  } catch (error) {
    console.error("❌ Error Creating Notification:", error);
  }
};

module.exports = {
  getNotifications,
  markNotificationsAsRead,
  createNotification,
};
