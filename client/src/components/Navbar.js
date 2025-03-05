import { Link } from "react-router-dom";
import "./Navbar.css"; // Custom styles for the navbar
import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";
import { getUserRole } from "../services/authService";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem("userId"); // Get logged-in user ID
  const userRole = getUserRole();

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    };

    getNotifications();
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Talent Hive</Link>
      </div>
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        {/* <Link to="/notifications" className="notification-icon">
          🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </Link> */}
        <Link to={`/profile/${userId}`}>Profile</Link>
        <Link to="/notifications">
          🔔
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </Link>
        <Link to="/reviews">Reviews</Link> {/* ✅ New Link */}
        {/* <Link to="/profile/:userI">Profile</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
