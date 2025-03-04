import { useEffect, useState } from "react";
import { fetchNotifications, markAllNotificationsAsRead } from "../services/notificationService";
import Navbar from "../components/Navbar";
// import "./NotificationsPage.css"; // Add CSS styles

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

//   const handleMarkAllAsRead = async () => {
//     try {
//         await markAllNotificationsAsRead();
//         setNotifications((prev) =>
//             prev.map((notification) => ({ ...notification, isRead: true }))
//         );
//         alert("✅ All notifications marked as read!");
//     } catch (error) {
//         alert("❌ Failed to mark notifications as read.");
//     }
// };
const handleMarkAllAsRead = async () => {
    try {
        await markAllNotificationsAsRead();

        // ✅ Update state: Hide all notifications
        setNotifications([]);

        // ✅ Update the notification count to 0
        setUnreadCount(0);

        alert("✅ All notifications marked as read!");
    } catch (error) {
        alert("❌ Failed to mark notifications as read.");
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
            <div key={notification._id} className={`notification-card ${notification.isRead ? "read" : "unread"}`}>
              <p>{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
