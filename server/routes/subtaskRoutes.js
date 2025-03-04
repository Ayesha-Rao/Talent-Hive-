// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { authorizeRoles } = require("../middleware/roleMiddleware");
// const { createSubtask, getSubtasksByTask, completeSubtask } = require("../controllers/subtaskController");

// const router = express.Router();

// // ✅ Agency Owners can create subtasks
// router.post("/", protect, authorizeRoles("agencyOwner"), createSubtask);

// router.post("/assign", protect, authorizeRoles("agencyOwner"), assignSubtask);

// // ✅ Agency Owners & Assigned Freelancers can view subtasks of a main task
// router.get("/:taskId", protect, getSubtasksByTask);

// // ✅ Assigned Freelancer can mark a subtask as completed
// router.post("/complete", protect, authorizeRoles("agencyFreelancer"), completeSubtask);

// module.exports = router;
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const Subtask = require("../models/Subtask");
const {
  createSubtask,
  getSubtasksByTask,
  completeSubtask,
  assignSubtask,
} = require("../controllers/subtaskController");

const router = express.Router();

// ✅ Agency Owners can create subtasks
router.post("/", protect, authorizeRoles("agencyOwner"), createSubtask);

// ✅ Agency Owners can assign subtasks to freelancers
router.post("/assign", protect, authorizeRoles("agencyOwner"), assignSubtask);

// ✅ Agency Owners & Assigned Freelancers can view subtasks of a main task
router.get("/:taskId", protect, getSubtasksByTask);

// ✅ Assigned Freelancer can mark a subtask as completed
router.post(
  "/complete",
  protect,
  authorizeRoles("agencyFreelancer"),
  completeSubtask
);
// ✅ Get all subtasks assigned to the logged-in agency freelancer
router.get(
  "/assigned/me",
  protect,
  authorizeRoles("agencyFreelancer"),
  async (req, res) => {
    try {
      console.log("🔍 Fetching Assigned Subtasks for Freelancer:", req.user.id);

      const assignedSubtasks = await Subtask.find({ assignedTo: req.user.id });

      if (assignedSubtasks.length === 0) {
        return res
          .status(404)
          .json({ message: "No subtasks assigned to you." });
      }

      res.status(200).json(assignedSubtasks);
    } catch (error) {
      console.error("❌ Error Fetching Assigned Subtasks:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
