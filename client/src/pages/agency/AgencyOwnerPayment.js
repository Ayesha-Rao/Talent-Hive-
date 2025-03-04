import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
// import "./AgencyOwnerPayments.css";

const AgencyOwnerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch agency owner's payments
        const response = await axios.get(
          "http://localhost:5000/api/payments/freelancer",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPayments(response.data.payments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to fetch payments.");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleReleasePayment = async (paymentId) => {
    try {
      setPaying(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/payments/release",
        { paymentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Payment released successfully!");
      setPaying(false);

      // Refresh payment list
      window.location.reload();
    } catch (error) {
      console.error("Error releasing payment:", error);
      setError("Failed to release payment.");
      setPaying(false);
    }
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="payment-container">
        <h2>Agency Payment Management</h2>

        {payments.length === 0 ? (
          <p>No completed tasks with received payments.</p>
        ) : (
          <div className="payments-list">
            {payments.map((payment) => (
              <div key={payment.taskId} className="payment-card">
                <h4>{payment.taskTitle}</h4>
                <p>
                  <strong>Total Received:</strong> ${payment.amountPaid}
                </p>
                <p>
                  <strong>Status:</strong> {payment.status}
                </p>

                {payment.status === "approved" && (
                  <button
                    className="pay-btn"
                    onClick={() => handleReleasePayment(payment.taskId)}
                    disabled={paying}
                  >
                    {paying ? "Processing..." : "Pay Freelancers"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyOwnerPayments;
