import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./style.css";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
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
