// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar"; // Import the Navbar component
// import "./ClientDashboard.css"; // Custom styles

// const ClientDashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [stats, setStats] = useState({ total: 0, completed: 0, open: 0 });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/tasks/my-tasks", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setTasks(response.data);
//         const total = response.data.length;
//         const completed = response.data.filter(task => task.status === "completed").length;
//         const open = response.data.filter(task => task.status === "open").length;
//         setStats({ total, completed, open });
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   return (
//     <div>
//       <Navbar />
//       <div className="dashboard-container">
//         <h2>Client Dashboard</h2>

//         <div className="stats">
//           <div className="stat-card">Total Tasks: {stats.total}</div>
//           <div className="stat-card">Completed Tasks: {stats.completed}</div>
//           <div className="stat-card">Open Tasks: {stats.open}</div>
//         </div>

//         <button className="post-task-btn" onClick={() => navigate("/post-task")}>
//           Post a New Task
//         </button>
       

//         <h3>My Tasks</h3>
//         <ul className="task-list">
//           {tasks.length > 0 ? (
//             tasks.map(task => (
//               <li key={task._id} className="task-item">
//                 <span>{task.title}</span>
//                 <span>Status: {task.status}</span>
//                 <button onClick={() => navigate(`/client/task/${task._id}`)}>View Details</button>
//                  {/* Show Review Payment button only for completed tasks */}
//                  {task.status.toLowerCase() === "completed" && (
//                   <button className="review-btn" onClick={() => navigate(`/client/review-payment/${task._id}`)}>
//                     Review Payment
//                   </button>
//                 )}
//               </li>
//             ))
//           ) : (
//             <p>No tasks found.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import recharts
// import "./style.css"; // Import the updated styles

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // Blue, Green, Yellow colors for pie chart

// const ClientDashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [stats, setStats] = useState({ total: 0, completed: 0, open: 0 });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/tasks/my-tasks", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setTasks(response.data);
//         const total = response.data.length;
//         const completed = response.data.filter(task => task.status === "completed").length;
//         const open = response.data.filter(task => task.status === "open").length;
//         setStats({ total, completed, open });
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const chartData = [
//     { name: "Total Tasks", value: stats.total },
//     { name: "Completed Tasks", value: stats.completed },
//     { name: "Open Tasks", value: stats.open },
//   ];

//   return (
//     <div>
//       <Navbar />
//       <div className="dashboard-container">
//         <h2>Client Dashboard</h2>

//         {/* Chart & Stats */}
//         <div className="dashboard-stats">
//           <div className="chart-container">
//             <PieChart width={250} height={250}>
//               <Pie
//                 data={chartData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={90}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {chartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </div>

//           <div className="stats">
//             <div className="stat-card">Total Tasks: {stats.total}</div>
//             <div className="stat-card">Completed Tasks: {stats.completed}</div>
//             <div className="stat-card">Open Tasks: {stats.open}</div>
//           </div>
//         </div>

//         <button className="post-task-btn" onClick={() => navigate("/post-task")}>
//           Post a New Task
//         </button>

//         {/* My Tasks Section */}
//         <h3>My Tasks</h3>
//         <div className="task-list">
//           {tasks.length > 0 ? (
//             tasks.map(task => (
//               <div key={task._id} className="task-card">
//                 <h4>{task.title}</h4>
//                 <p>Status: <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span></p>
//                 <button className="view-btn" onClick={() => navigate(`/client/task/${task._id}`)}>View Details</button>

//                 {task.status.toLowerCase() === "completed" && (
//                   <button className="review-btn" onClick={() => navigate(`/client/review-payment/${task._id}`)}>
//                     Review Payment
//                   </button>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="no-tasks">No tasks found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import recharts
import "./style.css"; // Import the updated styles

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // Colors for pie chart

const ClientDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, open: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tasks/my-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data);
        const total = response.data.length;
        const completed = response.data.filter(task => task.status === "completed").length;
        const open = response.data.filter(task => task.status === "open").length;
        setStats({ total, completed, open });
      } catch (error) {
        console.error("❌ Error fetching client tasks:", error);
      }
    };

    fetchClientTasks();
  }, []);

  const chartData = [
    { name: "Total Tasks", value: stats.total },
    { name: "Completed Tasks", value: stats.completed },
    { name: "Open Tasks", value: stats.open },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>Client Dashboard</h2>

        {/* Chart & Stats Section */}
        <div className="dashboard-stats">
          <div className="chart-container">
            <PieChart width={250} height={250}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="stats">
            <div className="stat-card">Total Tasks: {stats.total}</div>
            <div className="stat-card">Completed Tasks: {stats.completed}</div>
            <div className="stat-card">Open Tasks: {stats.open}</div>
          </div>
        </div>

        {/* Post a Task Button */}
        <button className="post-task-btn" onClick={() => navigate("/post-task")}>
          Post a New Task
        </button>

        {/* Task List Section */}
        <h3>My Tasks</h3>
        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>Status: <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span></p>
                <button className="view-btn" onClick={() => navigate(`/client/task/${task._id}`)}>View Details</button>

                {task.status.toLowerCase() === "completed" && (
                  <button className="review-btn" onClick={() => navigate(`/client/task/${task._id}/review`)}>
                    Review & Approve
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-tasks">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
