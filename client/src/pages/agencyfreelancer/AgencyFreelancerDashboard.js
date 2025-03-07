// export default AgencyFreelancerDashboard;
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

import "./AgencyFreelancerDashboard.css"; // Ensure this CSS file exists

const COLORS = ["#0088FE", "#FFBB28", "#00C49F"]; // Chart Colors

const AgencyFreelancerDashboard = () => {
  const [subtasks, setSubtasks] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchAssignedSubtasks = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch only the subtasks assigned to the logged-in agency freelancer
        const response = await axios.get(
          "http://localhost:5000/api/subtasks/assigned/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSubtasks(response.data);

        // ✅ Calculate task stats
        const assigned = response.data.length;
        const inProgress = response.data.filter(
          (subtask) => subtask.status === "assigned"
        ).length;
        const completed = response.data.filter(
          (subtask) => subtask.status === "completed"
        ).length;

        setStats({ assigned, inProgress, completed });
      } catch (error) {
        console.error("Error fetching assigned subtasks:", error);
      }
    };

    fetchAssignedSubtasks();
  }, []);

  const handleCompleteSubtask = async (subtaskId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/subtasks/complete",
        { subtaskId }, // Send subtask ID to mark it as completed
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Subtask marked as completed!");
      window.location.reload(); // Refresh to update status
    } catch (error) {
      alert("❌ Error completing subtask: " + error.response.data.message);
    }
  };

  const chartData = [
    { name: "Assigned", value: stats.assigned },
    { name: "In Progress", value: stats.inProgress },
    { name: "Completed", value: stats.completed },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>Agency Freelancer Dashboard</h2>

        {/* Stats & Chart */}
        <div className="stats-container">
          <div className="chart">
            <PieChart width={350} height={350}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="stats">
            <div className="stat-card">Assigned: {stats.assigned}</div>
            <div className="stat-card">In Progress: {stats.inProgress}</div>
            <div className="stat-card">Completed: {stats.completed}</div>
          </div>
        </div>

        {/* Subtask List */}
        <h3>Assigned Subtasks</h3>
        <div className="task-list">
          {subtasks.length > 0 ? (
            subtasks.map((subtask) => (
              <div key={subtask._id} className="task-card">
                <h4>{subtask.description}</h4>
                <p>Status: {subtask.status}</p>
                <p>
                  Deadline: {new Date(subtask.deadline).toLocaleDateString()}
                </p>

                <Link to={`/agency-freelancer/subtask/${subtask._id}`}>
                  View Details
                </Link>
                {subtask.status !== "completed" && (
                  <button
                    className="complete-btn"
                    onClick={() => handleCompleteSubtask(subtask._id)}
                  >
                    ✅ Mark as Complete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-tasks">No subtasks assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyFreelancerDashboard;
