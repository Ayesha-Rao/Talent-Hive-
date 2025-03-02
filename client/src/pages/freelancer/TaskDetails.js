import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./TaskDetails.css";

const FreelancerTaskDetails = () => {
  const { taskId } = useParams(); // Get Task ID from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTask(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching task details:", error);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const markComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tasks/complete",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Task marked as completed!");
      navigate("/freelancer/dashboard"); // Redirect back to dashboard
    } catch (error) {
      console.error("❌ Error marking task complete:", error);
      alert("Error marking task as complete: " + error.response?.data?.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="task-details-container">
        <h2>Task Details</h2>
        {task ? (
          <div>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Budget:</strong> ${task.budget}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {task.status}</p>

            {task.status !== "completed" && (
              <button onClick={markComplete} className="complete-btn">
                Mark as Complete
              </button>
            )}
          </div>
        ) : (
          <p>Task not found.</p>
        )}
      </div>
    </div>
  );
};

export default FreelancerTaskDetails;
