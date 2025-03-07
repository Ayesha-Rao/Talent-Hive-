// authService.js - Handles authentication and token management

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

// ✅ Get user details including ID
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user")); // Parse JSON
};

// ✅ Logout function to clear user data and redirect
export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user"); // ✅ Remove user data on logout
  navigate("/login"); // ✅ Redirect to Login Page
};
