// export default AgencyPaymentManagement;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";

const AgencyPaymentManagement = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subtasks, setSubtasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCompletedTasks();
    fetchPayments();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/tasks/completed",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedTasks(response.data);
      response.data.forEach((task) => fetchSubtasks(task._id));
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setMessage("Failed to load completed tasks.");
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/payments/freelancer",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayments(response.data.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setMessage("Failed to load payments.");
    }
  };

  const fetchSubtasks = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/subtasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtasks((prev) => ({ ...prev, [taskId]: response.data }));
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  const tasksWithPayments = completedTasks.map((task) => {
    const payment = payments.find((p) => p.taskId === task._id);
    return {
      ...task,
      paymentReceived: payment ? payment.amountPaid : 0,
      paymentStatus: payment ? payment.status : "pending",
      isPaid: payment ? payment.status === "paid" : false,
    };
  });

  const handlePaymentRelease = async (taskId) => {
    try {
      console.log("🔍 Searching Payment ID for Task:", taskId);

      const paymentRecord = payments.find(
        (payment) => payment.taskId === taskId
      );
      if (!paymentRecord) {
        console.error("❌ No payment record found for this task.");
        setMessage("No payment record found for this task.");
        return;
      }

      const paymentId = paymentRecord.paymentId;
      console.log("✅ Matched Payment ID:", paymentId);

      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      // ✅ Disable button immediately in the UI before API call completes
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.taskId === taskId ? { ...p, status: "paid" } : p
        )
      );

      await axios.post(
        "http://localhost:5000/api/payments/release",
        { paymentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Payment successfully released to freelancers!");
      await fetchPayments(); // ✅ Refresh payments to keep state correct after API response
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
          {tasksWithPayments.map((task) => {
            const commissionAmount = task.paymentReceived * 0.05;
            const finalPayment = task.paymentReceived - commissionAmount;
            // ✅ Get freelancer names or "None worked..."
            const assignedFreelancers =
              subtasks[task._id]?.map((s) => s.assignedTo?.name) || [];
            const freelancerNames =
              assignedFreelancers.length > 0
                ? assignedFreelancers.join(", ")
                : "None worked...";

            // ✅ Condition to disable/hide button
            const noFreelancersWorked = freelancerNames === "None worked...";

            return (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>
                  {subtasks[task._id]
                    ?.map((s) => s.assignedTo?.name)
                    .join(", ") || "None worked..."}
                </td>
                <td>
                  <p>
                    <strong>Total:</strong> ${task.paymentReceived}
                  </p>

                  {task.isPaid ? (
                    <>
                      <p className="commission-info">
                        <strong>Commission Deducted (5%):</strong>
                        <span className="commission-amount">
                          {" "}
                          -${commissionAmount.toFixed(2)}
                        </span>
                      </p>
                      <p>
                        <strong>Final Payment:</strong> $
                        {finalPayment.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="commission-info">
                      <strong>Commission (5%):</strong> Pending Deduction
                    </p>
                  )}
                </td>
                <td>{task.paymentStatus}</td>
                <td>
                  {/* <button
                    onClick={() => handlePaymentRelease(task._id)}
                    disabled={loading || task.isPaid}
                  >
                    {task.isPaid ? "Paid" : "Deduct & Pay"}
                  </button> */}
                  {/* ✅ Hide button if no freelancers worked */}
                  {!noFreelancersWorked && (
                    <button
                      onClick={() => handlePaymentRelease(task._id)}
                      disabled={loading || task.isPaid}
                    >
                      {task.isPaid ? "Paid" : "Deduct & Pay"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AgencyPaymentManagement;
