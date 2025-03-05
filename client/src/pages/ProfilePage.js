// import { useEffect, useState } from "react";
// import { fetchReviews } from "../services/reviewService";
// import RatingStars from "../components/RatingStars";

// const ProfilePage = ({ userId }) => {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     const loadReviews = async () => {
//       const data = await fetchReviews(userId);
//       setReviews(data);
//     };

//     loadReviews();
//   }, [userId]);

//   return (
//     <div>
//       <h2>User Profile</h2>
//       <h3>Ratings & Reviews</h3>
//       {reviews.length === 0 ? (
//         <p>No reviews yet.</p>
//       ) : (
//         reviews.map((review) => (
//           <div key={review._id}>
//             <p><RatingStars rating={review.rating} /></p>
//             <p>{review.comment}</p>
//             <p>By: {review.reviewerId.name}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ProfilePage;
// import { useEffect, useState } from "react";
// import { fetchReviews } from "../services/reviewService";

// const ReviewPage = () => {
//   const [reviews, setReviews] = useState([]);

//   // Get userId from logged-in user
//   const user = JSON.parse(localStorage.getItem("user")); // ✅ Fetch user info
//   const userId = user ? user._id : null;

//   useEffect(() => {
//     if (!userId) {
//       console.error("❌ User ID is undefined");
//       return;
//     }

//     const getReviews = async () => {
//       try {
//         const data = await fetchReviews(userId);
//         setReviews(data);
//       } catch (error) {
//         console.error("❌ Error Fetching Reviews:", error);
//       }
//     };

//     getReviews();
//   }, [userId]);

//   return (
//     <div>
//       <h2>User Reviews</h2>
//       {reviews.length > 0 ? (
//         reviews.map((review) => <p key={review._id}>{review.comment}</p>)
//       ) : (
//         <p>No reviews found.</p>
//       )}
//     </div>
//   );
// };

// export default ReviewPage;
import { useEffect, useState } from "react";
import { fetchReviews } from "../services/reviewService";
import { getUser } from "../services/authService"; // Import user helper

const ProfilePage = () => {
  const [reviews, setReviews] = useState([]);

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

    const getReviews = async () => {
      try {
        const data = await fetchReviews(userId);
        setReviews(data);
      } catch (error) {
        console.error("❌ Error Fetching Reviews:", error);
      }
    };

    getReviews();
  }, [userId]);

  // return (
  //   <div>
  //     <h2>User Reviews</h2>
  //     {reviews.length > 0 ? (
  //       reviews.map((review) => <p key={review._id}>{review.comment}</p>)
  //     ) : (
  //       <p>No reviews found.</p>
  //     )}
  //   </div>
  // );
  return (
    <div>
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
