import { Link } from "react-router-dom";
import "./Navbar.css"; // Custom styles for the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Talent Hive</Link>
      </div>
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
