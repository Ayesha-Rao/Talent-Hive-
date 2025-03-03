// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/Navbar";
// import "./TaskAssignment.css"; // Import CSS file for styling

// const TaskAssignment = () => {
//   const { taskId } = useParams(); // Get Task ID from URL
//   const [task, setTask] = useState(null);
//   const [subtasks, setSubtasks] = useState([]);
//   const [freelancers, setFreelancers] = useState([]);
//   const [newSubtask, setNewSubtask] = useState({
//     description: "",
//     deadline: "",
//     assignedTo: "",
//   });

//   useEffect(() => {
//     fetchTaskDetails();
//     fetchSubtasks();
//     fetchAgencyFreelancers();
//   }, [taskId]);

//   // ✅ Fetch Task Details
//   //   const fetchTaskDetails = async () => {
//   //     try {
//   //       const token = localStorage.getItem("token");
//   //       const response = await axios.get(
//   //         `http://localhost:5000/api/tasks/${taskId}`,
//   //         {
//   //           headers: { Authorization: `Bearer ${token}` },
//   //         }
//   //       );

//   //       setTask(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching task details:", error);
//   //     }
//   //   };
//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:5000/api/tasks/${taskId}`, // ✅ Fetch correct assigned task
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setTask(response.data);
//       } catch (error) {
//         console.error("Error fetching task details:", error);
//       }
//     };

//     fetchTaskDetails();
//   }, [taskId]);

//   // ✅ Fetch Existing Subtasks
//   const fetchSubtasks = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:5000/api/subtasks/${taskId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setSubtasks(response.data);
//     } catch (error) {
//       console.error("Error fetching subtasks:", error);
//     }
//   };

//   // ✅ Fetch Agency Freelancers
//   const fetchAgencyFreelancers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "http://localhost:5000/api/users/agency-freelancers",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setFreelancers(response.data);
//     } catch (error) {
//       console.error("Error fetching freelancers:", error);
//     }
//   };

//   // ✅ Create a Subtask
//   const handleCreateSubtask = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/api/subtasks",
//         { taskId, ...newSubtask },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Subtask created successfully!");
//       fetchSubtasks(); // Refresh list
//       setNewSubtask({ description: "", deadline: "", assignedTo: "" });
//     } catch (error) {
//       alert("Error creating subtask: " + error.response.data.message);
//     }
//   };

//   // ✅ Assign Subtask to a Freelancer
//   const handleAssignSubtask = async (subtaskId, freelancerId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/api/subtasks/assign",
//         { subtaskId, freelancerId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Subtask assigned successfully!");
//       fetchSubtasks(); // Refresh list
//     } catch (error) {
//       alert("Error assigning subtask: " + error.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="task-assignment-container">
//         <h2>Task Breakdown & Assignment</h2>

//         {/* Task Details */}
//         {task ? (
//           <div className="task-details">
//             <p>
//               <strong>Title:</strong> {task.title}
//             </p>
//             <p>
//               <strong>Description:</strong> {task.description}
//             </p>
//             <p>
//               <strong>Budget:</strong> ${task.budget}
//             </p>
//             <p>
//               <strong>Deadline:</strong>{" "}
//               {new Date(task.deadline).toLocaleDateString()}
//             </p>
//           </div>
//         ) : (
//           <p>Loading task details...</p>
//         )}

//         {/* Create Subtask Form */}
//         <h3>Create a Subtask</h3>
//         <form className="subtask-form" onSubmit={handleCreateSubtask}>
//           <input
//             type="text"
//             placeholder="Subtask Description"
//             value={newSubtask.description}
//             onChange={(e) =>
//               setNewSubtask({ ...newSubtask, description: e.target.value })
//             }
//             required
//           />
//           <input
//             type="date"
//             value={newSubtask.deadline}
//             onChange={(e) =>
//               setNewSubtask({ ...newSubtask, deadline: e.target.value })
//             }
//             required
//           />
//           <button type="submit">Create Subtask</button>
//         </form>

//         {/* Subtasks List */}
//         <h3>Subtasks</h3>
//         <ul className="subtask-list">
//           {subtasks.length > 0 ? (
//             subtasks.map((subtask) => (
//               <li key={subtask._id} className="subtask-item">
//                 <span>{subtask.description}</span>
//                 <span>
//                   Deadline: {new Date(subtask.deadline).toLocaleDateString()}
//                 </span>
//                 {subtask.assignedTo ? (
//                   <p>Assigned to: {subtask.assignedTo.name}</p>
//                 ) : (
//                   <div>
//                     <select
//                       onChange={(e) =>
//                         handleAssignSubtask(subtask._id, e.target.value)
//                       }
//                     >
//                       <option value="">Assign Freelancer</option>
//                       {freelancers.map((freelancer) => (
//                         <option key={freelancer._id} value={freelancer._id}>
//                           {freelancer.name}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={() =>
//                         handleAssignSubtask(subtask._id, newSubtask.assignedTo)
//                       }
//                     >
//                       Assign
//                     </button>
//                   </div>
//                 )}
//               </li>
//             ))
//           ) : (
//             <p>No subtasks found.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TaskAssignment;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./TaskAssignment.css"; // Import CSS file for styling

const TaskAssignment = () => {
  const { taskId } = useParams(); // Get Task ID from URL
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [newSubtask, setNewSubtask] = useState({
    description: "",
    deadline: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetchTaskDetails();
    fetchSubtasks();
    fetchAgencyFreelancers();
  }, [taskId]);

  // ✅ Fetch Task Details
  const fetchTaskDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${taskId}`, // ✅ Fetch correct assigned task
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // ✅ Fetch Existing Subtasks
  const fetchSubtasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/subtasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubtasks(response.data);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  // ✅ Fetch Agency Freelancers
  const fetchAgencyFreelancers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/users/agency-freelancers",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFreelancers(response.data);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    }
  };

  // ✅ Create a Subtask
  const handleCreateSubtask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/subtasks",
        {
          taskId, // ✅ Ensure taskId is sent correctly
          ...newSubtask,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Subtask created successfully!");
      fetchSubtasks(); // Refresh list
      setNewSubtask({ description: "", deadline: "", assignedTo: "" });
    } catch (error) {
      alert("Error creating subtask: " + error.response.data.message);
    }
  };

  // ✅ Assign Subtask to a Freelancer
  const handleAssignSubtask = async (subtaskId, freelancerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/subtasks/assign",
        { subtaskId, freelancerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Subtask assigned successfully!");
      fetchSubtasks(); // Refresh list
    } catch (error) {
      alert("Error assigning subtask: " + error.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="task-assignment-container">
        <h2>Task Breakdown & Assignment</h2>

        {/* Task Details */}
        {task ? (
          <div className="task-details">
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
          </div>
        ) : (
          <p>Loading task details...</p>
        )}

        {/* Create Subtask Form */}
        <h3>Create a Subtask</h3>
        <form className="subtask-form" onSubmit={handleCreateSubtask}>
          <input
            type="text"
            placeholder="Subtask Description"
            value={newSubtask.description}
            onChange={(e) =>
              setNewSubtask({ ...newSubtask, description: e.target.value })
            }
            required
          />
          <input
            type="date"
            value={newSubtask.deadline}
            onChange={(e) =>
              setNewSubtask({ ...newSubtask, deadline: e.target.value })
            }
            required
          />
          <button type="submit">Create Subtask</button>
        </form>

        {/* Subtasks List */}
        <h3>Subtasks</h3>
        <ul className="subtask-list">
          {subtasks.length > 0 ? (
            subtasks.map((subtask) => (
              <li key={subtask._id} className="subtask-item">
                <span>{subtask.description}</span>
                <span>
                  Deadline: {new Date(subtask.deadline).toLocaleDateString()}
                </span>
                {subtask.assignedTo ? (
                  <p>Assigned to: {subtask.assignedTo.name}</p>
                ) : (
                  <div>
                    <select
                      onChange={(e) =>
                        handleAssignSubtask(subtask._id, e.target.value)
                      }
                    >
                      <option value="">Assign Freelancer</option>
                      {freelancers.map((freelancer) => (
                        <option key={freelancer._id} value={freelancer._id}>
                          {freelancer.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        handleAssignSubtask(subtask._id, newSubtask.assignedTo)
                      }
                    >
                      Assign
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No subtasks found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskAssignment;
