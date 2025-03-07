import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ReviewPayment.css";

const ReviewPayment = () => {
  const { taskId } = useParams(); // Get task ID from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTask(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/payments/approve",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment Approved! The freelancer will be paid.");
      navigate("/client/dashboard");
    } catch (error) {
      alert("Error approving payment: " + error.response.data.message);
    }
  };

  const handleRequestRevisions = () => {
    alert("Revisions requested! The freelancer will be notified.");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="review-payment-container">
        <h2>Review and Approve Payment</h2>
        {task ? (
          <div>
            <p>
              <strong>Task:</strong> {task.title}
            </p>
            <p>
              <strong>Submitted Work:</strong> (Freelancer has completed the
              task)
            </p>
            <p>
              <strong>Budget:</strong> ${task.budget}
            </p>

            <div className="action-buttons">
              <button className="approve-btn" onClick={handleApprove}>
                Approve Payment
              </button>
              <button className="revision-btn" onClick={handleRequestRevisions}>
                Request Revisions
              </button>
            </div>
          </div>
        ) : (
          <p>Task not found.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPayment;
