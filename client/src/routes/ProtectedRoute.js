// import { Navigate, Outlet } from "react-router-dom";
// import { isAuthenticated } from "../services/authService";

// const ProtectedRoute = () => {
//   return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Check if user is logged in

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

