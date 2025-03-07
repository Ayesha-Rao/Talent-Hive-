import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../services/notificationService";
import Navbar from "../components/Navbar";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    getNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications([]);

      setUnreadCount(0);

      alert("All notifications marked as read!");
    } catch (error) {
      alert("Failed to mark notifications as read.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="notifications-container">
        <h2>Notifications</h2>
        {/* <button onClick={handleMarkAllAsRead}>Mark All as Read</button> */}
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${
                notification.isRead ? "read" : "unread"
              }`}
            >
              <p>{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
