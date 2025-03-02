import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import the Navbar component
import "./style.css"; // Add custom styles for Home page

const Home = () => {
  const navigate = useNavigate();

  return (
    // Add the Navbar component to the Home page
    
    <div>
    <Navbar /> {/* Add the Navbar here */}
    <div className="home-container">
      <h1>Welcome to Talent Hive</h1>
      <p>Your ultimate freelance management platform</p>

      <div className="buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  </div>
  );
};

export default Home;
