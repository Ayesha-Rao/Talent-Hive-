const Notification = require("../models/Notification");

const createNotification = async (recipientId, message, type) => {
  try {
    const notification = new Notification({ recipientId, message, type });
    await notification.save();
    console.log("Notification Created:", notification);
  } catch (error) {
    console.error("Error Creating Notification:", error);
  }
};

const getUserNotifications = async (req, res) => {
  try {
    console.log("Fetching Notifications for User:", req.user.id);

    const notifications = await Notification.find({
      recipientId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error Fetching Notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    console.log("Marking all notifications as read...");
    console.log("Logged-in User:", req.user);

    const updatedNotifications = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    console.log("Notifications Marked as Read:", updatedNotifications);

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error Marking All Notifications as Read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error Deleting Notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAllAsRead,
  deleteNotification,
};
