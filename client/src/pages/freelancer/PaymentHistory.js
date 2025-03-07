import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./PaymentHistory.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/payments/freelancer/:freelancerId",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPayments(response.data.payments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="payment-history-container">
        <h2>Payment History</h2>
        {payments.length > 0 ? (
          <ul>
            {payments.map((payment) => (
              <li key={payment.taskId}>
                <p>
                  <strong>Task ID:</strong> {payment.taskId}
                </p>
                <p>
                  <strong>Amount Paid:</strong> ${payment.amountPaid}
                </p>
                <p>
                  <strong>Status:</strong> {payment.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments found.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
