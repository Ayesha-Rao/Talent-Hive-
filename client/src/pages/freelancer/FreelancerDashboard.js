import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./FreelancerDashboard.css";

const FreelancerDashboard = () => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const availableResponse = await axios.get(
          "http://localhost:5000/api/tasks/open",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("🔍 Available Tasks Response:", availableResponse.data);
        setAvailableTasks(availableResponse.data);

        const assignedResponse = await axios.get(
          "http://localhost:5000/api/tasks/assigned",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAvailableTasks(availableResponse.data);
        setAssignedTasks(assignedResponse.data);

        const assigned = assignedResponse.data.length;
        const inProgress = assignedResponse.data.filter(
          (task) => task.status === "assigned"
        ).length;
        const completed = assignedResponse.data.filter(
          (task) => task.status === "completed"
        ).length;
        setStats({ assigned, inProgress, completed });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>Freelancer Dashboard</h2>

        <div className="stats">
          <div className="stat-card">Assigned Tasks: {stats.assigned}</div>
          <div className="stat-card">In Progress: {stats.inProgress}</div>
          <div className="stat-card">Completed: {stats.completed}</div>
        </div>

        <h3>Available Tasks</h3>
        <ul className="task-list">
          {availableTasks.length > 0 ? (
            availableTasks.map((task) => (
              <li key={task._id} className="task-item">
                <span>{task.title}</span>
                <span>Budget: ${task.budget}</span>
                <span>
                  Posted by: <strong>{task.clientId?.name || "Unknown"}</strong>
                </span>{" "}
                <button
                  onClick={() => navigate(`/freelancer/task/${task._id}/bid`)}
                >
                  Bid Now
                </button>
              </li>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </ul>

        <h3>Assigned Tasks</h3>
        <ul className="task-list">
          {assignedTasks.length > 0 ? (
            assignedTasks.map((task) => (
              <li key={task._id} className="task-item">
                <span>{task.title}</span>
                <span>Status: {task.status}</span>
                <button
                  onClick={() => navigate(`/freelancer/task/${task._id}`)}
                >
                  View Details
                </button>
                <button
                  className="view-btn"
                  onClick={() => navigate("/freelancer/payments")}
                >
                  View Payments
                </button>
              </li>
            ))
          ) : (
            <p>No assigned tasks.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
