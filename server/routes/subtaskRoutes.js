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
  getAssignedSubtasks,
} = require("../controllers/subtaskController");

const router = express.Router();

router.post("/", protect, authorizeRoles("agencyOwner"), createSubtask);

router.post("/assign", protect, authorizeRoles("agencyOwner"), assignSubtask);

router.get("/:taskId", protect, getSubtasksByTask);

router.post(
  "/complete",
  protect,
  authorizeRoles("agencyFreelancer", "agencyOwner"),
  completeSubtask
);

router.get(
  "/assigned/me",
  protect,
  authorizeRoles("agencyFreelancer"),
  getAssignedSubtasks
);

module.exports = router;
