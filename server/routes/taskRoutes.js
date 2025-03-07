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
  getAssignedTasks,
} = require("../controllers/taskController");
const Task = require("../models/Task");
const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  console.log("🔍 Test Route Hit!");
  res.json({ message: "Task API is working!" });
});

router.get("/my-tasks", protect, authorizeRoles("client"), getClientTasks);

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
  getAssignedTasks
);

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

router.get("/:taskId", protect, getTaskById);

router.post(
  "/bid",
  protect,
  authorizeRoles("independentFreelancer", "agencyOwner"),
  (req, res) => {
    res.json({ message: "Bid Placed Successfully", user: req.user });
  }
);

router.post("/", protect, authorizeRoles("client"), createTask);

router.post(
  "/assign",
  protect,
  authorizeRoles("client", "agencyOwner"),
  assignTask
);

router.post(
  "/complete",
  protect,
  authorizeRoles("independentFreelancer", "agencyFreelancer", "agencyOwner"),
  completeTask
);

module.exports = router;
