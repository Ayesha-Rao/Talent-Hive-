import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./PostTask.css";

const PostTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task posted successfully!");
      navigate("/client/dashboard"); // Redirect after posting
    } catch (error) {
      alert("Error posting task: " + error.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="post-task-container">
        <h2>Post a New Task</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Task Title" onChange={handleChange} required />
          <textarea name="description" placeholder="Task Description" onChange={handleChange} required />
          <input type="number" name="budget" placeholder="Budget ($)" onChange={handleChange} required />
          <input type="date" name="deadline" onChange={handleChange} required />
          <button type="submit">Post Task</button>
        </form>
      </div>
    </div>
  );
};

export default PostTask;
