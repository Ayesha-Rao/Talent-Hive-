//Handles authentication and token management

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

// Get user details including ID
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  navigate("/login");
};
