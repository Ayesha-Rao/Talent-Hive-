import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../services/notificationService";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const data = await getNotifications(token);
      setNotifications(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n._id} style={{ fontWeight: n.read ? "normal" : "bold" }}>
            {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
