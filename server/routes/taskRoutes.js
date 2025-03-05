const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  createTask,
  getOpenTasks,
  getClientTasks,
  assignTask,
  completeTask,
  getTaskById,
  getCompletedTasks,
} = require("../controllers/taskController");
const Task = require("../models/Task");
const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  console.log("🔍 Test Route Hit!");
  res.json({ message: "Task API is working!" });
});
// ✅ Clients can view their own tasks
router.get("/my-tasks", protect, authorizeRoles("client"), getClientTasks);
// ✅ Freelancers can view available tasks
router.get(
  "/open",
  protect,
  authorizeRoles("independentFreelancer", "agencyOwner"),
  getOpenTasks
);
router.get(
  "/assigned",
  protect,
  authorizeRoles("independentFreelancer", "agencyFreelancer", "agencyOwner"),
  async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.user.id });

      if (!tasks.length) {
        return res.status(200).json([]); // Return empty array instead of 404
      }

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
// ✅ Get Completed Tasks for the Logged-in Freelancer/Agency Freelancer
router.get(
  "/completed",
  protect,
  authorizeRoles(
    "independentFreelancer",
    "agencyFreelancer",
    "agencyOwner",
    "client"
  ),
  getCompletedTasks
);
// ✅ Get Task Details by ID (Clients, Freelancers, Agency Owners)
router.get("/:taskId", protect, getTaskById);
// ✅ Only "freelancers" and "agency owners" can bid on tasks
router.post(
  "/bid",
  protect,
  authorizeRoles("independentFreelancer", "agencyOwner"),
  (req, res) => {
    res.json({ message: "Bid Placed Successfully", user: req.user });
  }
);

// ✅ Only "client" role can create tasks
router.post("/", protect, authorizeRoles("client"), createTask);

// ✅ Agency Owners can assign tasks to freelancers

router.post(
  "/assign",
  protect,
  authorizeRoles("client", "agencyOwner"),
  assignTask
);

// ✅ Freelancers can mark a task as completed
router.post(
  "/complete",
  protect,
  authorizeRoles("independentFreelancer", "agencyFreelancer"),
  completeTask
);
// ✅ Freelancers can view their assigned tasks

module.exports = router;
