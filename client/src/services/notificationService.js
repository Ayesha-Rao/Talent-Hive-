import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

// Fetch notifications
export const getNotifications = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Mark notifications as read
export const markNotificationsAsRead = async (token) => {
  await axios.post(
    `${API_URL}/mark-read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
