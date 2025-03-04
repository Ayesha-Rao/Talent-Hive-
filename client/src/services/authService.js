// authService.js - Handles authentication and token management

export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  
  export const getUserRole = () => {
    return localStorage.getItem("role");
  };
  
  // export const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("role");
  // };
  
  // ✅ Get user details including ID
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user")); // Parse JSON
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user"); // ✅ Remove user data on logout
};