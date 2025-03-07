import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./ManageAgency.css"; // Import CSS file for styling

const ManageAgency = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFreelancer, setNewFreelancer] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
  });

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/users/agency-freelancers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFreelancers(response.data);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    }
  };

  const handleAddFreelancer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/add-freelancer",
        newFreelancer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Freelancer added successfully!");
      setShowForm(false);
      fetchFreelancers();
      setNewFreelancer({ name: "", email: "", password: "", skills: "" });
    } catch (error) {
      alert("Error adding freelancer: " + error.response.data.message);
    }
  };

  const handleRemoveFreelancer = async (id) => {
    if (!window.confirm("Are you sure you want to remove this freelancer?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/users/remove-freelancer/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Freelancer removed successfully!");
      fetchFreelancers();
    } catch (error) {
      alert("Error removing freelancer: " + error.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="manage-agency-container">
        <h2>Manage Agency Freelancers</h2>

        <button
          className="add-freelancer-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Freelancer"}
        </button>

        {showForm && (
          <form className="freelancer-form" onSubmit={handleAddFreelancer}>
            <input
              type="text"
              placeholder="Freelancer Name"
              value={newFreelancer.name}
              onChange={(e) =>
                setNewFreelancer({ ...newFreelancer, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Freelancer Email"
              value={newFreelancer.email}
              onChange={(e) =>
                setNewFreelancer({ ...newFreelancer, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newFreelancer.password}
              onChange={(e) =>
                setNewFreelancer({ ...newFreelancer, password: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Skills (comma-separated)"
              value={newFreelancer.skills}
              onChange={(e) =>
                setNewFreelancer({ ...newFreelancer, skills: e.target.value })
              }
              required
            />
            <button type="submit">Add Freelancer</button>
          </form>
        )}

        <h3>Current Freelancers</h3>
        <div className="freelancer-list">
          {freelancers.length > 0 ? (
            freelancers.map((freelancer) => (
              <div key={freelancer._id} className="freelancer-card">
                <p>
                  <strong>{freelancer.name}</strong>
                </p>
                <p>Email: {freelancer.email}</p>
                <p>Skills: {freelancer.skills}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFreelancer(freelancer._id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No freelancers in your agency.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAgency;
