import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./TaskBidding.css";

const TaskBidding = () => {
  const { taskId } = useParams(); // Get Task ID from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
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
        console.error("Error fetching task details:", error);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

//   
const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      // Log the request payload
      console.log("🔍 Sending Bid Data:", { taskId, amount: bidAmount });
  
      const response = await axios.post(
        "http://localhost:5000/api/bids",  // ✅ Correct endpoint for bid placement
        { taskId, amount: parseInt(bidAmount, 10) },  // Convert bidAmount to number
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Bid Response:", response.data);
      alert("Bid placed successfully!");
      navigate("/freelancer/dashboard"); // Redirect after bidding
    } catch (error) {
      console.error("❌ Error placing bid:", error.response?.data || error.message);
      alert("Error placing bid: " + (error.response?.data?.message || "Unknown error"));
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="task-bidding-container">
        <h2>Bid on Task</h2>
        {task ? (
          <div>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Budget:</strong> ${task.budget}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>

            <form onSubmit={handleBidSubmit}>
              <input
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
              <button type="submit">Place Bid</button>
            </form>
          </div>
        ) : (
          <p>Task not found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskBidding;
