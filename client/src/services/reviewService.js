import axios from "axios";

export const fetchReviews = async (userId) => {
  try {
    const token = localStorage.getItem("token"); // Ensure token is included

    const response = await axios.get(
      `http://localhost:5000/api/reviews/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error Fetching Reviews:", error);
    throw error;
  }
};

// ✅ Fetch assigned tasks (works like Freelancer Dashboard)
export const fetchCompletedTasks = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/api/tasks/completed",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error Fetching Completed Tasks:", error);
    return [];
  }
};

// ✅ Submit a new review
export const submitReview = async (reviewData) => {
  try {
    const token = localStorage.getItem("token"); // ✅ Get stored token

    if (!token) {
      throw new Error("❌ No auth token found.");
    }

    const response = await axios.post(
      "http://localhost:5000/api/reviews/submit",
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is sent
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error Submitting Review:", error.response || error);
    throw error;
  }
};
