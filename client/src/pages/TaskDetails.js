// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import "./TaskDetails.css";

// const TaskDetails = () => {
//   const { taskId } = useParams(); // Get Task ID from URL
//   const navigate = useNavigate();
//   const [task, setTask] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setTask(taskResponse.data);
//         setBids(taskResponse.data.bids || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching task details:", error);
//         setLoading(false);
//       }
//     };

//     fetchTaskDetails();
//   }, [taskId]);

//   const handleAssignTask = async (bidderId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/api/tasks/assign",
//         { taskId, freelancerId: bidderId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Task assigned successfully!");
//       navigate("/client/dashboard"); // Redirect to dashboard
//     } catch (error) {
//       alert("Error assigning task: " + error.response.data.message);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <Navbar />
//       <div className="task-details-container">
//         <h2>Task Details</h2>
//         {task ? (
//           <div>
//             <p><strong>Title:</strong> {task.title}</p>
//             <p><strong>Description:</strong> {task.description}</p>
//             <p><strong>Budget:</strong> ${task.budget}</p>
//             <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
//             <p><strong>Status:</strong> {task.status}</p>

//             <h3>Bids</h3>
//             {bids.length > 0 ? (
//               <ul className="bids-list">
//                 {bids.map((bid) => (
//                   <li key={bid._id} className="bid-item">
//                     <span>{bid.freelancerName} - ${bid.amount}</span>
//                     <button onClick={() => handleAssignTask(bid.freelancerId)}>Assign</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No bids yet.</p>
//             )}
//           </div>
//         ) : (
//           <p>Task not found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TaskDetails;
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import "./TaskDetails.css";

// const TaskDetails = () => {
//   const { taskId } = useParams(); // Get Task ID from URL
//   const navigate = useNavigate();
//   const [task, setTask] = useState(null);
//   const [bids, setBids] = useState([]); // Store bids separately
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
        
//         // Fetch task details
//         const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setTask(taskResponse.data);
//       } catch (error) {
//         console.error("Error fetching task details:", error);
//       }
//     };

//     const fetchBids = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Fetch bids for this task
//         const bidsResponse = await axios.get(`http://localhost:5000/api/bids/${taskId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setBids(bidsResponse.data); // Store bids separately
//       } catch (error) {
//         console.error("Error fetching bids:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTaskDetails();
//     fetchBids();
//   }, [taskId]);

//   const handleAssignTask = async (bidderId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/api/tasks/assign",
//         { taskId, freelancerId: bidderId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Task assigned successfully!");
//       navigate("/client/dashboard"); // Redirect to dashboard
//     } catch (error) {
//       alert("Error assigning task: " + error.response.data.message);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <Navbar />
//       <div className="task-details-container">
//         <h2>Task Details</h2>
//         {task ? (
//           <div>
//             <p><strong>Title:</strong> {task.title}</p>
//             <p><strong>Description:</strong> {task.description}</p>
//             <p><strong>Budget:</strong> ${task.budget}</p>
//             <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
//             <p><strong>Status:</strong> {task.status}</p>

//             <h3>Bids</h3>
//             {bids.length > 0 ? (
//               <ul className="bids-list">
//                 {bids.map((bid) => (
//                   <li key={bid._id} className="bid-item">
//                     <span>{bid.freelancerName} - ${bid.amount}</span>
//                     <button onClick={() => handleAssignTask(bid.freelancerId)}>Assign</button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No bids yet.</p>
//             )}
//           </div>
//         ) : (
//           <p>Task not found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TaskDetails;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./TaskDetails.css";

const TaskDetails = () => {
  const { taskId } = useParams(); // Get Task ID from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [bids, setBids] = useState([]); // Store bids separately
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch task details
        const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTask(taskResponse.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    const fetchBids = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch bids for this task
        const bidsResponse = await axios.get(`http://localhost:5000/api/bids/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBids(bidsResponse.data); // Store bids separately
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
    fetchBids();
  }, [taskId]);

  const handleAssignTask = async (bidderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tasks/assign",
        { taskId, freelancerId: bidderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Task assigned successfully!");
      navigate("/client/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert("Error assigning task: " + error.response.data.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="task-details-container">
        <h2>Task Details</h2>
        {task ? (
          <div>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Budget:</strong> ${task.budget}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {task.status}</p>

            <h3>Bids</h3>
            {bids.length > 0 ? (
              <ul className="bids-list">
                {bids.map((bid) => (
                  <li key={bid._id} className="bid-item">
                    <div>
                      <p><strong>Name:</strong> {bid.bidderId?.name}</p>
                      <p><strong>Email:</strong> {bid.bidderId?.email}</p>
                      <p><strong>Role:</strong> {bid.bidderId?.role}</p>
                      <p><strong>Bid Amount:</strong> ${bid.amount}</p>
                      <p><strong>Status:</strong> {bid.status}</p>
                      <p><strong>Bid Date:</strong> {new Date(bid.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleAssignTask(bid.bidderId?._id)}>Assign</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bids yet.</p>
            )}
          </div>
        ) : (
          <p>Task not found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
