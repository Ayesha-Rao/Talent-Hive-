// import { useEffect, useState } from "react";
// import {
//   fetchReviews,
//   submitReview,
//   fetchCompletedTasks,
// } from "../services/reviewService";
// import { getUser } from "../services/authService"; // ✅ Use getUser()

// const ReviewPage = () => {
//   const [reviews, setReviews] = useState([]);
//   const [completedTasks, setCompletedTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState("");
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [recipientId, setRecipientId] = useState("");

//   const user = getUser();
//   const userId = user ? user._id : null; // ✅ Get user ID correctly

//   // ✅ Fetch received reviews
//   useEffect(() => {
//     if (!userId) {
//       console.error("❌ User ID is missing! Ensure login works correctly.");
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

//   // ✅ Fetch completed tasks for submitting a review
//   useEffect(() => {
//     const getCompletedTasks = async () => {
//       try {
//         const data = await fetchCompletedTasks();
//         setCompletedTasks(data);
//       } catch (error) {
//         console.error("❌ Error Fetching Completed Tasks:", error);
//       }
//     };

//     getCompletedTasks();
//   }, []);

//   // ✅ Handle Review Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedTask || !recipientId || rating < 1) {
//       alert("Please select a task, recipient, and provide a rating.");
//       return;
//     }

//     try {
//       await submitReview({
//         taskId: selectedTask,
//         recipientId,
//         rating,
//         comment,
//       });

//       alert("✅ Review submitted successfully!");
//       setRating(5);
//       setComment("");
//       setSelectedTask("");
//       setRecipientId("");
//     } catch (error) {
//       alert("❌ Error submitting review.");
//     }
//   };

//   return (
//     <div>
//       <h2>Reviews</h2>

//       {/* ✅ List of Received Reviews */}
//       <h3>My Reviews</h3>
//       {reviews.length > 0 ? (
//         reviews.map((review) => (
//           <div key={review._id} className="review-card">
//             <h3>{review.taskId?.title || "Unknown Task"}</h3>
//             <p>
//               <strong>Reviewer:</strong>{" "}
//               {review.reviewerId?.name || "Unknown User"}
//             </p>
//             <p>
//               <strong>Rating:</strong> {review.rating} ⭐
//             </p>
//             <p>
//               <strong>Comment:</strong> {review.comment}
//             </p>
//             <hr />
//           </div>
//         ))
//       ) : (
//         <p>No reviews found.</p>
//       )}

//       {/* ✅ Form to Submit a Review */}
//       <h3>Submit a Review</h3>
//       <form onSubmit={handleSubmit}>
//         {/* ✅ Select Completed Task */}
//         <label>Completed Task:</label>
//         <select
//           value={selectedTask}
//           onChange={(e) => setSelectedTask(e.target.value)}
//           required
//         >
//           <option value="">Select Task</option>
//           {completedTasks.map((task) => (
//             <option key={task._id} value={task._id}>
//               {task.title}
//             </option>
//           ))}
//         </select>

//         {/* ✅ Enter Recipient ID */}
//         <label>Recipient ID (User to review):</label>
//         <input
//           type="text"
//           value={recipientId}
//           onChange={(e) => setRecipientId(e.target.value)}
//           required
//         />

//         {/* ✅ Rating Selection */}
//         <label>Rating:</label>
//         <input
//           type="number"
//           value={rating}
//           min="1"
//           max="5"
//           onChange={(e) => setRating(e.target.value)}
//           required
//         />

//         {/* ✅ Comment */}
//         <label>Comment:</label>
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           required
//         ></textarea>

//         <button type="submit">Submit Review</button>
//       </form>
//     </div>
//   );
// };

// export default ReviewPage;
// import { useEffect, useState } from "react";
// import { fetchAssignedTasks, submitReview } from "../services/reviewService";
// import { getUser } from "../services/authService"; // ✅ Get logged-in user
// import "../styles/Review.css"; // ✅ Add CSS styling

// const ReviewsPage = () => {
//   const [completedTasks, setCompletedTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState("");
//   const [recipientId, setRecipientId] = useState("");
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");

//   // ✅ Get logged-in user details
//   const user = getUser();

//   useEffect(() => {
//     const loadCompletedTasks = async () => {
//       if (!user || !user._id) {
//         console.error("❌ User not found. Ensure they are logged in.");
//         return;
//       }

//       try {
//         const assignedTasks = await fetchAssignedTasks(); // ✅ Uses the working API
//         const filteredTasks = assignedTasks.filter(
//           (task) => task.status === "completed"
//         );
//         setCompletedTasks(filteredTasks);
//       } catch (error) {
//         console.error("❌ Error Fetching Completed Tasks:", error);
//       }
//     };

//     loadCompletedTasks();
//   }, []);

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedTask || !recipientId || !rating || !comment) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const reviewData = {
//       recipientId,
//       taskId: selectedTask,
//       rating,
//       comment,
//     };

//     // ✅ Debugging: Check what's being sent
//     console.log("🔹 Submitting Review with Data:", reviewData);

//     try {
//       await submitReview(reviewData);
//       alert("✅ Review submitted successfully!");
//       setComment("");
//     } catch (error) {
//       console.error("❌ Error Submitting Review:", error);
//       alert("❌ Error submitting review.");
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();

//     console.log("🔹 Selected Task:", selectedTask);
//     console.log("🔹 Recipient ID:", recipientId);
//     console.log("🔹 Rating:", rating);
//     console.log("🔹 Comment:", comment);

//     if (!selectedTask || !recipientId || !rating || !comment) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const reviewData = {
//       recipientId,
//       taskId: selectedTask,
//       rating,
//       comment,
//     };

//     console.log("🔹 Submitting Review with Data:", reviewData); // ✅ Check final payload

//     try {
//       await submitReview(reviewData);
//       alert("✅ Review submitted successfully!");
//       setComment(""); // Reset comment field
//     } catch (error) {
//       console.error("❌ Error Submitting Review:", error.response || error);
//       alert("❌ Error submitting review.");
//     }
//   };

//   return (
//     <div className="reviews-container">
//       <h2>Submit a Review</h2>

//       {/* ✅ Task Dropdown */}
//       <label>Select Completed Task:</label>
//       <select
//         value={selectedTask}
//         onChange={(e) => {
//           setSelectedTask(e.target.value);
//           const task = completedTasks.find(
//             (task) => task._id === e.target.value
//           );
//           setRecipientId(task ? task.assignedTo : ""); // ✅ Auto-select recipient
//         }}
//       >
//         <option value="">Select a task</option>
//         {completedTasks.map((task) => (
//           <option key={task._id} value={task._id}>
//             {task.title}
//           </option>
//         ))}
//       </select>

//       {/* ✅ Rating Input */}
//       <label>Rating:</label>
//       <input
//         type="number"
//         min="1"
//         max="5"
//         value={rating}
//         onChange={(e) => setRating(e.target.value)}
//       />

//       {/* ✅ Review Comment */}
//       <label>Comment:</label>
//       <textarea
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         placeholder="Write your review..."
//       />

//       {/* ✅ Submit Button */}
//       <button onClick={handleReviewSubmit}>Submit Review</button>
//     </div>
//   );
// };

// export default ReviewsPage;
// import { useEffect, useState } from "react";
// import { fetchCompletedTasks, submitReview } from "../services/reviewService";
// import { getUser } from "../services/authService";
// import { useNavigate } from "react-router-dom";
// // import "./SubmitReview.css"; // CSS for form styling

// const SubmitReview = () => {
//   const navigate = useNavigate();
//   const user = getUser(); // Get logged-in user
//   const userId = user ? user._id : null;
//   const userRole = user ? user.role : null;

//   const [completedTasks, setCompletedTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState("");
//   const [recipientId, setRecipientId] = useState("");
//   const [rating, setRating] = useState("");
//   const [comment, setComment] = useState("");
//   const [eligibleRecipients, setEligibleRecipients] = useState([]);

//   useEffect(() => {
//     if (!userId) {
//       alert("❌ Error: User is not logged in.");
//       navigate("/login");
//       return;
//     }

//     // Fetch only completed tasks
//     const loadCompletedTasks = async () => {
//       try {
//         const data = await fetchCompletedTasks();
//         setCompletedTasks(data);
//       } catch (error) {
//         console.error("❌ Error Fetching Completed Tasks:", error);
//       }
//     };

//     loadCompletedTasks();
//   }, [userId, navigate]);

//   // ✅ When a task is selected, filter eligible recipients
//   const handleTaskSelection = (taskId) => {
//     setSelectedTask(taskId);

//     // Find the selected task
//     const task = completedTasks.find((t) => t._id === taskId);

//     if (!task) return;

//     let recipients = [];

//     // ✅ Logic for who can review whom
//     if (userRole === "client") {
//       if (task.assignedTo) {
//         recipients.push({
//           id: task.assignedTo._id,
//           name: task.assignedTo.name,
//         });
//       }
//       if (task.agencyOwnerId) {
//         recipients.push({
//           id: task.agencyOwnerId._id,
//           name: task.agencyOwnerId.name,
//         });
//       }
//     } else if (userRole === "independentFreelancer") {
//       recipients.push({ id: task.clientId._id, name: task.clientId.name });
//     } else if (userRole === "agencyOwner") {
//       if (task.subtasks) {
//         task.subtasks.forEach((subtask) => {
//           recipients.push({
//             id: subtask.assignedTo._id,
//             name: subtask.assignedTo.name,
//           });
//         });
//       }
//     } else if (userRole === "agencyFreelancer") {
//       if (task.agencyOwnerId) {
//         recipients.push({
//           id: task.agencyOwnerId._id,
//           name: task.agencyOwnerId.name,
//         });
//       }
//     }

//     setEligibleRecipients(recipients);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedTask || !recipientId || !rating || !comment) {
//       alert("❌ Please fill in all fields.");
//       return;
//     }

//     const reviewData = {
//       recipientId,
//       taskId: selectedTask,
//       rating,
//       comment,
//     };

//     try {
//       await submitReview(reviewData);
//       alert("✅ Review submitted successfully!");
//       setComment("");
//       setSelectedTask("");
//       setRecipientId("");
//       setRating("");
//     } catch (error) {
//       console.error("❌ Error Submitting Review:", error);
//       alert("❌ Error submitting review.");
//     }
//   };

//   return (
//     <div className="submit-review-container">
//       <h2>Submit a Review</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Select Completed Task:</label>
//         <select
//           value={selectedTask}
//           onChange={(e) => handleTaskSelection(e.target.value)}
//         >
//           <option value="">Select Task</option>
//           {completedTasks.map((task) => (
//             <option key={task._id} value={task._id}>
//               {task.title}
//             </option>
//           ))}
//         </select>

//         <label>Select Recipient:</label>
//         <select
//           value={recipientId}
//           onChange={(e) => setRecipientId(e.target.value)}
//         >
//           <option value="">Select Recipient</option>
//           {eligibleRecipients.map((rec) => (
//             <option key={rec.id} value={rec.id}>
//               {rec.name}
//             </option>
//           ))}
//         </select>

//         <label>Rating:</label>
//         <select value={rating} onChange={(e) => setRating(e.target.value)}>
//           <option value="">Select Rating</option>
//           <option value="1">⭐</option>
//           <option value="2">⭐⭐</option>
//           <option value="3">⭐⭐⭐</option>
//           <option value="4">⭐⭐⭐⭐</option>
//           <option value="5">⭐⭐⭐⭐⭐</option>
//         </select>

//         <label>Comment:</label>
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Write your review..."
//         ></textarea>

//         <button type="submit">Submit Review</button>
//       </form>
//     </div>
//   );
// };

// export default SubmitReview;
import { useEffect, useState } from "react";
import { fetchCompletedTasks, submitReview } from "../services/reviewService";
import { getUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const SubmitReview = () => {
  const navigate = useNavigate();
  const user = getUser(); // Get logged-in user
  const userId = user ? user._id : null;
  const userRole = user ? user.role : null;

  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("Select a task first"); // ✅ Default message
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!userId) {
      alert("❌ Error: User is not logged in.");
      navigate("/login");
      return;
    }

    // ✅ Fetch only completed tasks
    const loadCompletedTasks = async () => {
      try {
        const data = await fetchCompletedTasks();
        console.log("🔍 Completed Tasks API Response:", data); // ✅ Debugging API response
        setCompletedTasks(data);
      } catch (error) {
        console.error("❌ Error Fetching Completed Tasks:", error);
      }
    };

    loadCompletedTasks();
  }, [userId, navigate]);

  // ✅ When a task is selected, automatically set the recipient
  //   const handleTaskSelection = (taskId) => {
  //     setSelectedTask(taskId);

  //     // Find the selected task
  //     const task = completedTasks.find((t) => t._id === taskId);
  //     console.log("🔹 Selected Task:", task); // ✅ Debugging selected task

  //     if (!task) {
  //       setRecipientId("");
  //       setRecipientName("Unknown User");
  //       return;
  //     }

  //     let recipient = null;

  //     // ✅ Determine the recipient based on the user's role
  //     if (userRole === "client") {
  //       recipient = task.assignedTo; // Client reviews freelancer
  //     } else if (
  //       userRole === "independentFreelancer" ||
  //       userRole === "agencyFreelancer"
  //     ) {
  //       recipient = task.clientId; // Freelancer reviews client
  //     } else if (userRole === "agencyOwner") {
  //       recipient = task.assignedTo; // Agency owner reviews agency freelancer
  //     }

  //     // ✅ Fix: Ensure recipient exists
  //     if (recipient && recipient._id && recipient.name) {
  //       setRecipientId(recipient._id);
  //       setRecipientName(recipient.name);
  //     } else {
  //       setRecipientId("");
  //       setRecipientName("Recipient Not Found");
  //       console.warn("⚠️ Recipient is missing in task data. Check API response.");
  //     }
  //   };
  const handleTaskSelection = (taskId) => {
    setSelectedTask(taskId);

    // ✅ Find the selected task from the completed tasks list
    const task = completedTasks.find((t) => t._id === taskId);

    if (!task) {
      console.error("❌ No Task Found! API Data May Be Incorrect.");
      return;
    }

    let recipient = null;

    // ✅ Automatically assign recipient based on user role
    if (userRole === "client" && task.assignedTo) {
      recipient = task.assignedTo; // Client reviews Freelancer
    } else if (
      (userRole === "independentFreelancer" ||
        userRole === "agencyFreelancer") &&
      task.clientId
    ) {
      recipient = task.clientId; // Freelancer reviews Client
    } else if (userRole === "agencyOwner" && task.assignedTo) {
      recipient = task.assignedTo; // Agency Owner reviews Freelancer
    }

    // ✅ Debugging Output
    console.log("🔹 Selected Task:", task);
    console.log("🔹 Auto-Assigned Recipient:", recipient);

    // ✅ Set recipient ID if found
    if (recipient) {
      setRecipientId(recipient._id);
    } else {
      setRecipientId("");
      console.warn("⚠️ No recipient found for this task.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTask || !recipientId || !rating || !comment) {
      alert("❌ Please fill in all fields.");
      return;
    }

    const reviewData = {
      recipientId,
      taskId: selectedTask,
      rating,
      comment,
    };

    try {
      await submitReview(reviewData);
      alert("✅ Review submitted successfully!");
      setComment("");
      setSelectedTask("");
      setRecipientId("");
      setRecipientName("Select a task first");
      setRating("");
    } catch (error) {
      console.error("❌ Error Submitting Review:", error);
      alert("❌ Error submitting review.");
    }
  };

  return (
    <div className="submit-review-container">
      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit}>
        {/* ✅ Select Completed Task */}
        <label>Select Completed Task:</label>
        <select
          value={selectedTask}
          onChange={(e) => handleTaskSelection(e.target.value)}
        >
          <option value="">-- Select Task --</option>
          {completedTasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>

        {/* ✅ Automatically Show the Recipient */}
        <label>Reviewing:</label>
        <p>
          <strong>{recipientName}</strong>
        </p>

        {/* ✅ Rating Selection */}
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Select Rating</option>
          <option value="1">⭐</option>
          <option value="2">⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
        </select>

        {/* ✅ Comment Field */}
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        ></textarea>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default SubmitReview;
