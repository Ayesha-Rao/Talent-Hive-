const Subtask = require("../models/Subtask");
const Task = require("../models/Task");

// ✅ Create a Subtask (Agency Owner Only)
const createSubtask = async (req, res) => {
    try {
        const { taskId, description, deadline, assignedTo } = req.body;

        if (req.user.role !== "agencyOwner") {
            return res.status(403).json({ message: "Only Agency Owners can create subtasks." });
        }

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Main task not found" });

        const subtask = new Subtask({
            taskId,
            description,
            deadline,
            assignedTo
        });

        await subtask.save();
        res.status(201).json({ message: "Subtask created successfully", subtask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get all Subtasks of a Task (Only Agency Owners & Assigned Freelancers)
const getSubtasksByTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const subtasks = await Subtask.find({ taskId }).populate("assignedTo", "name email");

        if (subtasks.length === 0) {
            return res.status(404).json({ message: "No subtasks found for this task" });
        }

        res.status(200).json(subtasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Mark Subtask as Completed (Only Assigned Freelancer)
const completeSubtask = async (req, res) => {
    try {
        const { subtaskId } = req.body;

        const subtask = await Subtask.findById(subtaskId);
        if (!subtask) return res.status(404).json({ message: "Subtask not found" });

        if (subtask.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only assigned freelancer can mark this subtask as complete." });
        }

        subtask.status = "completed";
        await subtask.save();

        // Check if all subtasks of the main task are completed
        const remainingSubtasks = await Subtask.find({ taskId: subtask.taskId, status: { $ne: "completed" } });

        if (remainingSubtasks.length === 0) {
            await Task.findByIdAndUpdate(subtask.taskId, { status: "completed" });
        }

        res.status(200).json({ message: "Subtask marked as completed", subtask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// ✅ Agency Owners Assign Subtasks
const assignSubtask = async (req, res) => {
    try {
        console.log("🔍 Assigning Subtask...");
        console.log("🔹 Logged-in User:", req.user);

        const { subtaskId, freelancerId } = req.body;

        if (req.user.role !== "agencyOwner") {
            console.log("❌ Access Denied: Only Agency Owners can assign subtasks.");
            return res.status(403).json({ message: "Only Agency Owners can assign subtasks." });
        }

        const subtask = await Subtask.findById(subtaskId);
        if (!subtask) return res.status(404).json({ message: "Subtask not found" });

        subtask.assignedTo = freelancerId;
        subtask.status = "assigned";
        await subtask.save();

        console.log("✅ Subtask Assigned Successfully:", subtask);
        res.status(200).json({ message: "Subtask assigned successfully", subtask });

    } catch (error) {
        console.error("❌ Error Assigning Subtask:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createSubtask, getSubtasksByTask, completeSubtask, assignSubtask };



