// import axios from "axios";

// const API_URL = "http://localhost:5000/api/notifications";

// // Fetch notifications
// export const getNotifications = async (token) => {
//   const response = await axios.get(API_URL, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// // Mark notifications as read
// export const markNotificationsAsRead = async (token) => {
//   await axios.post(
//     `${API_URL}/mark-read`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
// };
import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";


// ✅ Fetch all notifications for the logged-in user
export const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error Fetching Notifications:", error);
    return [];
  }
};

// ✅ Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `${API_URL}/mark-as-read/${notificationId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("❌ Error Marking Notification as Read:", error);
  }
};

// ✅ Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/mark-all-as-read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Marked All as Read:", response.data);
      return response.data;
  } catch (error) {
      console.error("❌ Error Marking All Notifications as Read:", error);
      throw error;
  }
};