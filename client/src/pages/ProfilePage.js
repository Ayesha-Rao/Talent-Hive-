// export default ReviewPage;
import { useEffect, useState } from "react";
import { fetchReviews } from "../services/reviewService";
import { getUser } from "../services/authService"; // Import user helper
import axios from "axios";
import "./style.css";

const ProfilePage = () => {
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState(null);

  // ✅ Get the logged-in user
  const user = getUser();
  const userId = user ? user._id : null;

  useEffect(() => {
    if (!userId) {
      console.error(
        "❌ User ID is undefined. Ensure user data is stored in localStorage."
      );
      return;
    }
    // ✅ Fetch User Details
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure auth token is included
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data); // Store user data in state
      } catch (error) {
        console.error("❌ Error Fetching User Info:", error);
      }
    };

    const getReviews = async () => {
      try {
        const data = await fetchReviews(userId);
        setReviews(data);
      } catch (error) {
        console.error("❌ Error Fetching Reviews:", error);
      }
    };
    fetchUserData();
    getReviews();
  }, [userId]);

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {/* ✅ Display User Information */}
      {userData ? (
        <div className="user-info">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Role:</strong> {userData.role}
          </p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
      <h2>User Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="review-card">
            <h3>{review.taskId?.title || "Unknown Task"}</h3>{" "}
            {/* ✅ Show Task Title */}
            <p>
              <strong>Reviewer:</strong>{" "}
              {review.reviewerId?.name || "Unknown User"}
            </p>{" "}
            {/* ✅ Show Reviewer Name */}
            <p>
              <strong>Rating:</strong> {review.rating} ⭐
            </p>{" "}
            {/* ✅ Show Rating */}
            <p>
              <strong>Comment:</strong> {review.comment}
            </p>{" "}
            {/* ✅ Show Review Comment */}
            <hr />
          </div>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
