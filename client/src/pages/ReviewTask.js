import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ReviewTask.css";

const ReviewTask = () => {
  const { taskId } = useParams();
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


const approvePayment = async () => {
    try {
        const token = localStorage.getItem("token");
        console.log("🔍 Approving Payment for Task ID:", taskId); // ✅ Debugging Log

        const response = await axios.post(
            "http://localhost:5000/api/payments/approve",  // ✅ Verify correct URL
            { taskId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Payment Approved Response:", response.data);
        alert("Payment approved successfully!");
        navigate("/client/dashboard"); // Redirect after approval
    } catch (error) {
        console.error("❌ Error approving payment:", error.response?.data || error.message);
        alert("Error approving payment: " + (error.response?.data?.message || "Unknown error"));
    }
};


  return (
    <div>
      <Navbar />
      <div className="review-task-container">
        <h2>Review Completed Task</h2>
        {task ? (
          <div>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Budget:</strong> ${task.budget}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {task.status}</p>

            {task.status === "completed" && (
              <button onClick={approvePayment} className="approve-btn">
                Approve Payment
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

export default ReviewTask;
