import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./SubtaskDetails.css";

const SubtaskDetails = () => {
  const { subtaskId } = useParams();
  const [subtask, setSubtask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedSubtasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/subtasks/assigned/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const foundSubtask = response.data.find((s) => s._id === subtaskId);

        if (foundSubtask) {
          setSubtask(foundSubtask);
        } else {
          console.log("Subtask not found!");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching subtask details:", error);
        setLoading(false);
      }
    };

    fetchAssignedSubtasks();
  }, [subtaskId]);

  if (loading) return <p>Loading...</p>;
  if (!subtask) return <p>Subtask not found.</p>;

  return (
    <div>
      <Navbar />
      <div className="subtask-details-container">
        <h2>Subtask Details</h2>
        <p>
          <strong>Description:</strong> {subtask.description}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {new Date(subtask.deadline).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong> {subtask.status}
        </p>

        {/* {subtask.status !== "completed" && (
          <button onClick={() => console.log("Mark as complete")}>
            Mark as Complete
          </button>
        )} */}
      </div>
    </div>
  );
};

export default SubtaskDetails;
