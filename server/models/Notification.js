const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: {
      //The user receiving the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    type: { type: String, enum: ["task", "bid", "payment"], required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
