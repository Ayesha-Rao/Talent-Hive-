import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";

const AgencyPaymentManagement = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subtasks, setSubtasks] = useState({}); // Store subtasks separately
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCompletedTasks();
    fetchPayments();
  }, []);

  // Fetch completed tasks assigned to the agency owner
  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/tasks/completed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompletedTasks(response.data);

      // Fetch subtasks for each completed task
      response.data.forEach((task) => fetchSubtasks(task._id));
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setMessage("Failed to load completed tasks.");
    }
  };

  // Fetch payment details
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/payments/freelancer",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayments(response.data.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setMessage("Failed to load payments.");
    }
  };

  // Fetch subtasks for a given task
  const fetchSubtasks = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/subtasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubtasks((prev) => ({ ...prev, [taskId]: response.data }));
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  // Merge Payment Data into Tasks
  const tasksWithPayments = completedTasks.map((task) => {
    const payment = payments.find((p) => p.taskId === task._id);
    return {
      ...task,
      paymentReceived: payment ? payment.amountPaid : 0,
      paymentStatus: payment ? payment.status : "pending",
    };
  });

  const handlePaymentRelease = async (taskId) => {
    try {
      console.log("🔍 Searching Payment ID for Task:", taskId);

      // ✅ Ensure payments data is available before searching
      if (!payments || payments.length === 0) {
        console.error("❌ No payment records available.");
        setMessage("No payment records available.");
        return;
      }

      console.log("🔍 Available Payments:", payments);

      // ✅ Find the correct `paymentId` for the given `taskId`
      const paymentRecord = payments.find(
        (payment) => payment.taskId === taskId
      );

      if (!paymentRecord) {
        console.error("❌ No payment record found for this task.");
        setMessage("No payment record found for this task.");
        return;
      }

      const paymentId = paymentRecord.paymentId; // ✅ Extract paymentId
      console.log("✅ Matched Payment ID:", paymentId);

      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      // ✅ Now send the correct `paymentId` to release payment
      await axios.post(
        "http://localhost:5000/api/payments/release",
        { paymentId }, // ✅ Send paymentId instead of taskId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Payment successfully released to freelancers!");
      fetchCompletedTasks();
      fetchPayments(); // Refresh data
    } catch (error) {
      console.error("❌ Error releasing payment:", error);
      setMessage("Failed to release payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-management-container">
      <h2>Agency Payment Management</h2>
      {message && <p className="message">{message}</p>}

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Freelancers</th>
            <th>Payment Received</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasksWithPayments.length === 0 ? (
            <tr>
              <td colSpan="5">No completed tasks found.</td>
            </tr>
          ) : (
            tasksWithPayments.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>
                  {subtasks[task._id]?.map((subtask) => (
                    <span key={subtask._id}>{subtask.assignedTo?.name} </span>
                  )) || "Fetching..."}
                </td>
                {/* <td>${task.paymentReceived || 0}</td> */}
                <td>
                  <p>
                    <strong>Total:</strong> ${task.paymentReceived || 0}
                  </p>
                  <p className="commission-info">
                    <strong>Commission (5%):</strong>
                    <span className="commission-amount">
                      {" "}
                      -${(task.paymentReceived * 0.05).toFixed(2)}
                    </span>
                    <span className="tooltip">
                      ⓘ
                      <span className="tooltip-text">
                        Agency deducts 5% commission from total payment.
                      </span>
                    </span>
                  </p>
                  <p>
                    <strong>Final Payment:</strong> $
                    {(task.paymentReceived * 0.95).toFixed(2)}
                  </p>
                </td>

                <td>{task.paymentStatus}</td>
                <td>
                  {task.paymentStatus === "Paid" ? (
                    <button disabled>Paid</button>
                  ) : (
                    <button
                      onClick={() => handlePaymentRelease(task._id)}
                      disabled={loading}
                    >
                      Deduct Commision & pay freelancers
                      {/* {loading ? "Processing..." : "Pay Freelancers"} */}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgencyPaymentManagement;
