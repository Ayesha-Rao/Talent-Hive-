import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmitReview = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage after login
      const response = await axios.get("http://localhost:5000/api/tasks/completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompletedTasks(response.data);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setMessage("Failed to load completed tasks.");
    }
  };

  const handleTaskChange = (taskId) => {
    setSelectedTask(taskId);

    const task = completedTasks.find((t) => t._id === taskId);
    if (task) {
      const userRole = localStorage.getItem("role"); // Get role from local storage (set during login)

      // Determine recipientId based on role
      if (userRole === "client") {
        setRecipientId(task.assignedTo?._id || ""); // Client reviews freelancer/agency owner
      } else if (userRole === "independentFreelancer") {
        setRecipientId(task.clientId?._id || ""); // Freelancer reviews client
      } else if (userRole === "agencyFreelancer") {
        setRecipientId(task.taskId?.agencyId || ""); // Agency freelancer reviews agency owner
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !recipientId || !rating || !comment) {
      setMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/reviews/submit",
        { recipientId, taskId: selectedTask, rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Review submitted successfully!");
      setRating("");
      setComment("");
      setSelectedTask("");
      setRecipientId("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-container">
      <h2>Submit a Review</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Task Selection */}
        <label>Select a Completed Task:</label>
        <select value={selectedTask} onChange={(e) => handleTaskChange(e.target.value)}>
          <option value="">Select a task</option>
          {completedTasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title} (Completed)
            </option>
          ))}
        </select>

        {/* Rating Selection */}
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>

        {/* Comment Input */}
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        ></textarea>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;
