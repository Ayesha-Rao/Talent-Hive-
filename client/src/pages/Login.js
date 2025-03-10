import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const { token, role, user } = response.data;

      if (!user || !user._id) {
        console.error("Error: User data is missing in response.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      switch (response.data.role) {
        case "client":
          navigate("/client/dashboard");
          break;
        case "independentFreelancer":
          navigate("/freelancer/dashboard");
          break;
        case "agencyOwner":
          navigate("/agency/dashboard");
          break;
        case "agencyFreelancer":
          navigate("/agency-freelancer/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
