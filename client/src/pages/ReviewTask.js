// export default ReviewTask;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ReviewTask.css";

const ReviewTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(""); // ✅ Store payment status
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    fetchPaymentStatus();
  }, [taskId]);

  // ✅ Fetch Task Details
  const fetchTaskDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTask(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching task details:", error);
      setLoading(false);
    }
  };

  // ✅ Fetch Payment Status
  const fetchPaymentStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/payments/status/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Payment Status:", response.data.status);
      setPaymentStatus(response.data.status); // ✅ Store payment status in state
    } catch (error) {
      console.error("❌ Error fetching payment status:", error);
    }
  };

  // ✅ Approve Payment
  const approvePayment = async () => {
    try {
      setIsApproving(true);
      const token = localStorage.getItem("token");
      console.log("🔍 Approving Payment for Task ID:", taskId);

      const response = await axios.post(
        "http://localhost:5000/api/payments/approve",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Payment Approved Response:", response.data);
      alert("Payment approved successfully!");

      // ✅ Update status to "approved" after approval
      setPaymentStatus("approved");
      navigate("/client/dashboard"); // Redirect after approval
    } catch (error) {
      console.error(
        "❌ Error approving payment:",
        error.response?.data || error.message
      );
      alert(
        "Error approving payment: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="review-task-container">
        <h2>Review Completed Task</h2>
        {task ? (
          <div>
            <p>
              <strong>Title:</strong> {task.title}
            </p>
            <p>
              <strong>Description:</strong> {task.description}
            </p>
            <p>
              <strong>Budget:</strong> ${task.budget}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Payment Status:</strong> {paymentStatus || "Loading..."}
            </p>

            {task.status === "completed" && (
              <button
                onClick={approvePayment}
                className="approve-btn"
                disabled={
                  paymentStatus === "approved" || paymentStatus === "paid"
                } // ✅ Disable button when status is "approved" or "paid"
              >
                {paymentStatus === "approved" || paymentStatus === "paid"
                  ? "Payment Approved"
                  : isApproving
                  ? "Approving..."
                  : "Approve Payment"}
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
