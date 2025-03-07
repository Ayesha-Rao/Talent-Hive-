import axios from "axios";

export const fetchReviews = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:5000/api/reviews/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error Fetching Reviews:", error);
    throw error;
  }
};

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
    console.error("Error Fetching Completed Tasks:", error);
    return [];
  }
};

export const submitReview = async (reviewData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No auth token found.");
    }

    const response = await axios.post(
      "http://localhost:5000/api/reviews/submit",
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error Submitting Review:", error.response || error);
    throw error;
  }
};
