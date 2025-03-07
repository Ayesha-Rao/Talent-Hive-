import { useState } from "react";
import { submitReview } from "../services/reviewService";

const ReviewForm = ({ completedTasks }) => {
  const [taskId, setTaskId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitReview({ taskId, recipientId, rating, comment });
      alert("Review submitted successfully!");
      window.location.reload(); // Refresh the page to update reviews
    } catch (error) {
      alert("Error submitting review.");
    }
  };

  return (
    <div className="review-form">
      <h3>Submit a Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Select Task */}
        <label>Select Task:</label>
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          required
        >
          <option value="">Select a Task</option>
          {completedTasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>

        {/* Select Recipient */}
        <label>Select User to Review:</label>
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          required
        >
          <option value="">Select a User</option>
          {completedTasks
            .filter((task) => task._id === taskId)
            .flatMap((task) => [task.assignedTo, task.clientId])
            .map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
        </select>

        {/* Rating */}
        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        {/* Comment */}
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
