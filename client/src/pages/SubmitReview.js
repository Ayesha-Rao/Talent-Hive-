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

//   const fetchCompletedTasks = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Ensure the token is stored in localStorage after login
//       const response = await axios.get("http://localhost:5000/api/tasks/completed", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCompletedTasks(response.data);
//     } catch (error) {
//       console.error("Error fetching completed tasks:", error);
//       setMessage("Failed to load completed tasks.");
//     }
//   };




  //new
  const fetchCompletedTasks = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tasks/completed", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const userRole = localStorage.getItem("role");

        if (userRole === "agencyFreelancer") {
            // ✅ Only change the display for agency freelancers
            setCompletedTasks(response.data.map(subtask => ({
                _id: subtask._id,
                title: subtask.description || "Subtask", // ✅ Show subtask description
                taskId: subtask.taskId?._id || "", // ✅ Store parent taskId for recipient logic
                agencyId: subtask.assignedTo?.agencyId || "",
            })));
        } else {
            // ✅ Keep existing functionality for other roles
            setCompletedTasks(response.data);
        }
    } catch (error) {
        console.error("Error fetching completed tasks:", error);
        setMessage("Failed to load completed tasks.");
    }
};


  //   const handleTaskChange = (taskId) => {
//     setSelectedTask(taskId);

//     const task = completedTasks.find((t) => t._id === taskId);
//     if (task) {
//       const userRole = localStorage.getItem("role"); // Get role from local storage (set during login)

//       // Determine recipientId based on role
//       if (userRole === "client") {
//         setRecipientId(task.assignedTo?._id || ""); // Client reviews freelancer/agency owner
//       } else if (userRole === "independentFreelancer") {
//         setRecipientId(task.clientId?._id || ""); // Freelancer reviews client
//       } else if (userRole === "agencyFreelancer") {
//         setRecipientId(task.taskId?.agencyId || ""); // Agency freelancer reviews agency owner
//       }else if (userRole === "agencyOwner") {
//         setRecipientId(task.clientId?._id || ""); // ✅ Fix: Agency owner reviews assigned freelancer
//       }
//     }
//   };
const handleTaskChange = (taskId) => {
    setSelectedTask(taskId);
  
    const task = completedTasks.find((t) => t._id === taskId);
    if (task) {
      const userRole = localStorage.getItem("role");
  
      let recipient = "";
      if (userRole === "client") {
        recipient = task.assignedTo?._id || ""; // Client reviews freelancer
      } else if (userRole === "independentFreelancer") {
        recipient = task.clientId?._id || ""; // Freelancer reviews client
      }
       else if (userRole === "agencyFreelancer") {
        recipient = task.agencyId || "";// Agency Freelancer reviews Agency Owner
      } 
    
      else if (userRole === "agencyOwner") {
        recipient = task.clientId?._id || ""; // ✅ FIXED: Agency Owner reviews Client
      }
  
      setRecipientId(recipient);
      console.log("Selected Task:", task);
      console.log("Auto-filled recipientId:", recipient);
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
