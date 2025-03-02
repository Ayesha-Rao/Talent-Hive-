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
const { createSubtask, getSubtasksByTask, completeSubtask, assignSubtask } = require("../controllers/subtaskController");

const router = express.Router();

// ✅ Agency Owners can create subtasks
router.post("/", protect, authorizeRoles("agencyOwner"), createSubtask);

// ✅ Agency Owners can assign subtasks to freelancers
router.post("/assign", protect, authorizeRoles("agencyOwner"), assignSubtask);

// ✅ Agency Owners & Assigned Freelancers can view subtasks of a main task
router.get("/:taskId", protect, getSubtasksByTask);

// ✅ Assigned Freelancer can mark a subtask as completed
router.post("/complete", protect, authorizeRoles("agencyFreelancer"), completeSubtask);

module.exports = router;
