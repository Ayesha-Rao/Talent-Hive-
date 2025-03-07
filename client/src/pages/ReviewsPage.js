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
      alert("Error: User is not logged in.");
      navigate("/login");
      return;
    }

    // completed tasks
    const loadCompletedTasks = async () => {
      try {
        const data = await fetchCompletedTasks();
        console.log("Completed Tasks API Response:", data);
        setCompletedTasks(data);
      } catch (error) {
        console.error("Error Fetching Completed Tasks:", error);
      }
    };

    loadCompletedTasks();
  }, [userId, navigate]);

  const handleTaskSelection = (taskId) => {
    setSelectedTask(taskId);

    const task = completedTasks.find((t) => t._id === taskId);

    if (!task) {
      console.error("No Task Found! API Data May Be Incorrect.");
      return;
    }

    console.log("Selected Task API Response:", task);

    let recipient = null;

    if (userRole === "client") {
      if (task.assignedTo) {
        recipient = task.assignedTo;
      }
    } else if (userRole === "independentFreelancer") {
      if (task.clientId) {
        recipient = task.clientId;
      }
    } else if (userRole === "agencyOwner") {
      if (task.assignedTo) {
        recipient = task.assignedTo;
      }
    } else if (userRole === "agencyFreelancer") {
      if (user.agencyId) {
        recipient = {
          _id: user.agencyId,
          name: "Agency Owner",
        };
      }
    }

    console.log("Auto-Assigned Recipient:", recipient);

    if (recipient && recipient._id) {
      setRecipientId(recipient._id);
      setRecipientName(recipient.name);
      console.log(
        `Recipient Assigned: ${recipient.name} (ID: ${recipient._id})`
      );
    } else {
      setRecipientId("");
      setRecipientName("⚠️ No recipient found");
      console.warn("⚠️ No recipient found for this task.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTask || !recipientId || !rating || !comment) {
      alert("Please fill in all fields.");
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
      alert("Review submitted successfully!");
      setComment("");
      setSelectedTask("");
      setRecipientId("");
      setRecipientName("Select a task first");
      setRating("");
    } catch (error) {
      console.error("Error Submitting Review:", error);
      alert("Error submitting review.");
    }
  };

  return (
    <div className="submit-review-container">
      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit}>
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

        {/* Automatically Show the Recipient */}
        {/* <label>Reviewing:</label>
        <p>
          <strong>{recipientName}</strong>
        </p> */}
        <label>Reviewing:</label>
        <p>
          <strong>
            {recipientName ? recipientName : "⚠️ No recipient found"}
          </strong>
        </p>

        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Select Rating</option>
          <option value="1">⭐</option>
          <option value="2">⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
        </select>

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
