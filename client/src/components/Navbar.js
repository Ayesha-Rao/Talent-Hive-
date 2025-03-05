// import { Link,useNavigate } from "react-router-dom";
// import "./Navbar.css"; // Custom styles for the navbar
// import { useEffect, useState } from "react";
// import { fetchNotifications } from "../services/notificationService";
// import { getUserRole } from "../services/authService";
// import { isAuthenticated, logout } from "../services/authService";

// const Navbar = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const userId = localStorage.getItem("userId"); // Get logged-in user ID
//   const userRole = getUserRole();
//   const isLoggedIn = isAuthenticated(); // Check if user is logged in

//   const handleLogout = () => {
//     logout(navigate); // Call logout function
//   };

//   useEffect(() => {
//     const getNotifications = async () => {
//       const data = await fetchNotifications();
//       setNotifications(data);
//       setUnreadCount(data.filter((n) => !n.isRead).length);
//     };

//     getNotifications();
//   }, []);

//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <Link to="/">Talent Hive</Link>
//       </div>
//       <div className="nav-links">
//         <Link to="/login">Login</Link>
//         <Link to="/signup">Sign Up</Link>

//         <Link to={`/profile/${userId}`}>Profile</Link>
//         <Link to="/notifications">
//           🔔
//           {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
//         </Link>
//         <Link to="/reviews">Reviews</Link> {/* ✅ New Link */}

//       </div>

//     </nav>
//   );
// };

// export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Custom styles for the navbar
import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";
import {
  getUserRole,
  isAuthenticated,
  logout,
  getUser,
} from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = getUser(); // ✅ Get logged-in user details
  const userId = user ? user._id : null; // ✅ Get user ID
  const userRole = getUserRole();
  const isLoggedIn = isAuthenticated(); // ✅ Check if user is logged in

  const handleLogout = () => {
    logout(navigate); // ✅ Call logout function & redirect
  };

  useEffect(() => {
    if (!isLoggedIn) return; // ✅ Fetch notifications only if logged in

    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("❌ Error Fetching Notifications:", error);
      }
    };

    getNotifications();
  }, [isLoggedIn]);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Talent Hive</Link>
      </div>
      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to={`/profile/${userId}`}>Profile</Link>
            <Link to="/submit-review">Submit Review</Link>
            {/* <Link to="/reviews">Reviews</Link> */}
            <Link to="/notifications">
              🔔{" "}
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
