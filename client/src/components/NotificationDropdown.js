import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../services/notificationService";
import "./NotificationDropdown.css";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    getNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setNotifications(
      notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            <p>{notification.message}</p>
          </div>
        ))
      )}
      <button onClick={handleMarkAllAsRead}>Mark All as Read</button>
    </div>
  );
};

export default NotificationDropdown;
