import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ClientDashboard from "./pages/ClientDashboard";
import PostTask from "./pages/PostTask";
import TaskDetails from "./pages/TaskDetails";
import ReviewPayment from "./pages/ReviewPayment";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import TaskBidding from "./pages/freelancer/TaskBidding";
import FreelancerTaskDetails from "./pages/freelancer/TaskDetails";
import ReviewTask from "./pages/ReviewTask";
import PaymentHistory from "./pages/freelancer/PaymentHistory";
import AgencyDashboard from "./pages/agency/AgencyDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ManageAgency from "./pages/agency/ManageAgency";
import AgencyTaskBidding from "./pages/agency/AgencyTaskBidding";
import AgencyTaskDetails from "./pages/agency/AgencyTaskDetails";
import TaskAssignment from "./pages/agency/TaskAssignment";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Entry Point) */}
        <Route path="/" element={<Home />} />
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/post-task" element={<PostTask />} />

          <Route path="/client/task/:taskId" element={<TaskDetails />} />
          <Route
            path="/client/review-payment/:taskId"
            element={<ReviewPayment />}
          />
          <Route
            path="/freelancer/dashboard"
            element={<FreelancerDashboard />}
          />
          <Route
            path="/freelancer/task/:taskId/bid"
            element={<TaskBidding />}
          />
          <Route
            path="/freelancer/task/:taskId"
            element={<FreelancerTaskDetails />}
          />
          <Route path="/client/task/:taskId/review" element={<ReviewTask />} />
          <Route path="/freelancer/payments" element={<PaymentHistory />} />
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/manage-freelancers" element={<ManageAgency />} />
          <Route
            path="/agency/task/:taskId/bid"
            element={<AgencyTaskBidding />}
          />
          <Route path="/agency/task/:taskId" element={<AgencyTaskDetails />} />
          <Route
            path="/agency/task-assignment/:taskId"
            element={<TaskAssignment />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
