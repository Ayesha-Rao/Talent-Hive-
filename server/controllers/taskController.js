const Task = require("../models/Task");
const { createNotification } = require("../controllers/notificationController");
const User = require("../models/User"); // ✅ Add this line if missing
const Subtask = require("../models/Subtask"); // ✅ Add this line if missing

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

    // ✅ Notify Freelancers & Agencies
    const freelancers = await User.find({
      role: { $in: ["independentFreelancer", "agencyOwner"] },
    });
    for (const freelancer of freelancers) {
      await createNotification(
        freelancer._id,
        `New task posted: ${title}`,
        "task"
      );
    }

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

      // ✅ Fix: Use `freelancerId` instead of `assignedTo`
      console.log("🔔 Creating Notification for Task Assignment...");
      await createNotification(
        freelancerId,
        `You have been assigned to task: ${task.title}`,
        "task"
      );

      return res
        .status(200)
        .json({ message: "Task assigned successfully by Client", task });
    }

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

    // ✅ Notify the Client
    await createNotification(
      task.clientId, // Client ID (Recipient)
      `Your task "${task.title}" has been completed by the freelancer.`,
      "task"
    );

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
// ✅ Get completed tasks for logged-in user (Freelancer or Agency Freelancer)
// const getCompletedTasks = async (req, res) => {
//   try {
//     console.log("🔍 Fetching Completed Tasks for User:", req.user.id);

//     const completedTasks = await Task.find({
//       assignedTo: req.user.id, // Tasks assigned to the logged-in user
//       status: "completed",
//     })
//       .populate("clientId", "name email")
//       .populate("assignedTo", "name email");

//     if (!completedTasks.length) {
//       return res.status(200).json([]); // Return empty array instead of 404
//     }

//     res.status(200).json(completedTasks);
//   } catch (error) {
//     console.error("❌ Error Fetching Completed Tasks:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// const getCompletedTasks = async (req, res) => {
//   try {
//     console.log("🔍 Fetching Completed Tasks for User:", req.user.id);

//     let filter = { status: "completed" };

//     if (req.user.role === "client") {
//       filter.clientId = req.user.id; // Clients see their created tasks
//     } else if (req.user.role === "independentFreelancer") {
//       filter.assignedTo = req.user.id; // Freelancers see tasks assigned to them
//     } else if (req.user.role === "agencyFreelancer") {
//       // Agency Freelancers check their `agencyId`
//       const user = await User.findById(req.user.id);
//       if (!user || !user.agencyId) {
//         return res.status(403).json({ message: "You are not part of any agency." });
//       }
//       filter["subtasks.assignedTo"] = req.user.id; // Subtasks assigned to them
//     }

//     const completedTasks = await Task.find(filter)
//       .populate("clientId", "name email") // ✅ Populate client
//       .populate("assignedTo", "name email"); // ✅ Populate freelancer

//     res.status(200).json(completedTasks);
//   } catch (error) {
//     console.error("❌ Error Fetching Completed Tasks:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



const getCompletedTasks = async (req, res) => {
  try {
    console.log("🔍 Fetching Completed Tasks for User:", req.user.id);

    let filter = { status: "completed" };

    if (req.user.role === "client") {
      filter.clientId = req.user.id; // Clients see their created tasks
      const completedTasks = await Task.find(filter)
        .populate("clientId", "name email")
        .populate("assignedTo", "name email");
      return res.status(200).json(completedTasks);
    } 
    
    else if (req.user.role === "independentFreelancer") {
      filter.assignedTo = req.user.id; // Freelancers see tasks assigned to them
      const completedTasks = await Task.find(filter)
        .populate("clientId", "name email")
        .populate("assignedTo", "name email");
      return res.status(200).json(completedTasks);
    } 
    
    else if (req.user.role === "agencyOwner") {
      filter.agencyId = req.user.id; // Agency owners see tasks they manage
      
      const completedTasks = await Task.find(filter)
        .populate("clientId", "name email") // ✅ Agency owner CAN see client info
        .populate("assignedTo", "name email");
      return res.status(200).json(completedTasks);
    } 
    
    else if (req.user.role === "agencyFreelancer") {
      // Fetch completed subtasks assigned to this agency freelancer
      const completedSubtasks = await Subtask.find({
        assignedTo: req.user.id,
        status: "completed",
      }).populate("taskId", "title description"); // ❌ Removed clientId population

      if (completedSubtasks.length === 0) {
        return res.status(200).json([]); // Return empty array if no completed subtasks
      }

      return res.status(200).json(completedSubtasks);
    }

    res.status(403).json({ message: "Unauthorized access" });
  } catch (error) {
    console.error("❌ Error Fetching Completed Tasks:", error);
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
  getCompletedTasks,
};
