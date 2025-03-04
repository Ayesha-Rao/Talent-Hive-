import axios from "axios";

// const API_URL = "http://localhost:5000/api/reviews";

// export const fetchReviews = async (userId) => {
//   const response = await axios.get(`${API_URL}/${userId}`);
//   return response.data;
// };

// export const submitReview = async (reviewData) => {
//   const token = localStorage.getItem("token");
//   await axios.post(`${API_URL}/submit`, reviewData, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
export const fetchReviews = async (userId) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is included
  
      const response = await axios.get(`http://localhost:5000/api/reviews/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      return response.data;
    } catch (error) {
      console.error("❌ Error Fetching Reviews:", error);
      throw error;
    }
  };
