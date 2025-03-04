const Task = require("../models/Task");

// ✅ Create a new task (Client only)
const createTask = async (req, res) => {
  try {
    console.log("🔍 Task Creation Started...");
    console.log("🔹 Request Body:", req.body);
    console.log("🔹 Logged-in User:", req.user);

    const { title, description, budget, deadline } = req.body;

    if (req.user.role !== "client") {
      console.log("❌ Access Denied: Not a Client");
      return res
        .status(403)
        .json({ message: "Only clients can create tasks." });
    }

    const task = new Task({
      title,
      description,
      budget,
      deadline,
      clientId: req.user.id,
    });

    const savedTask = await task.save();
    console.log("✅ Task Saved Successfully:", savedTask);
    // // Notify all freelancers
    // const freelancers = await User.find({
    //   role: { $in: ["independentFreelancer", "agencyOwner"] },
    // });
    // freelancers.forEach((freelancer) => {
    //   createNotification(freelancer._id, `New Task Posted: ${title}`, "task");
    // });

    res.status(201).json({
      message: "Task Created Successfully",
      task: savedTask.toObject(),
    });
  } catch (error) {
    console.error("❌ Error Creating Task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all open tasks (Freelancers can view available tasks)
const getOpenTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" }).populate(
      "clientId",
      "name email"
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get tasks posted by the logged-in client
const getClientTasks = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Access denied." });
    }

    const tasks = await Task.find({ clientId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    console.log("🔍 Assign Task Started...");
    console.log("🔹 Logged-in User:", req.user);

    const { taskId, freelancerId } = req.body;

    // Allow only Clients OR Agency Owners to assign tasks
    if (req.user.role !== "client" && req.user.role !== "agencyOwner") {
      console.log(
        "❌ Access Denied: Only Clients and Agency Owners can assign tasks."
      );
      return res
        .status(403)
        .json({ message: "Only Clients and Agency Owners can assign tasks." });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // If the user is a Client, they can only assign tasks to Freelancers or Agencies
    if (req.user.role === "client") {
      console.log("✅ Client is assigning a task...");
      task.assignedTo = freelancerId;
      task.status = "assigned";
      await task.save();
      console.log("✅ Task Assigned by Client:", task);
      return res
        .status(200)
        .json({ message: "Task assigned successfully by Client", task });
    }
    createNotification(
      freelancerId,
      `You have been assigned a new task: ${task.title}`,
      "task-assigned"
    );

    // If the user is an Agency Owner, they can only assign Subtasks (handled separately)
    console.log("❌ Agency Owner should use the subtask assignment route.");
    return res
      .status(403)
      .json({ message: "Agency Owners must assign Subtasks, not main tasks." });
  } catch (error) {
    console.error("❌ Error Assigning Task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Mark a task as completed (Freelancer only)
const completeTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    createNotification(
      task.clientId,
      `Your task "${task.title}" has been completed`,
      "task-completed"
    );

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only assigned freelancer can mark task as complete.",
      });
    }

    task.status = "completed";
    await task.save();

    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    console.log("🔍 Fetching Task Details...");
    console.log("🔹 Task ID:", req.params.taskId);

    const task = await Task.findById(req.params.taskId).populate(
      "assignedTo",
      "name email"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Error Fetching Task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getOpenTasks,
  getClientTasks,
  assignTask,
  completeTask,
  getTaskById,
};
