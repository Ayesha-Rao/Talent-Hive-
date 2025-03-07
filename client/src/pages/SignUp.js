import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    agencyName: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="independentFreelancer">
              Independent Freelancer
            </option>
            <option value="agencyOwner">Agency Owner</option>
          </select>

          {formData.role === "agencyOwner" && (
            <input
              type="text"
              name="agencyName"
              placeholder="Agency Name"
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
