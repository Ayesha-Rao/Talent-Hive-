const Bid = require("../models/Bid");
const Task = require("../models/Task");
const { createNotification } = require("../controllers/notificationController");

const placeBid = async (req, res) => {
  try {
    console.log("Placing Bid...");
    console.log("Request Body:", req.body);

    const { taskId, amount, message } = req.body;

    if (
      req.user.role !== "independentFreelancer" &&
      req.user.role !== "agencyOwner"
    ) {
      return res
        .status(403)
        .json({ message: "Only Freelancers & Agencies can place bids." });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const bid = new Bid({
      taskId,
      bidderId: req.user.id,
      amount,
      message,
    });

    await bid.save();
    console.log("Bid Placed Successfully:", bid);

    res.status(201).json({ message: "Bid placed successfully", bid });

    await createNotification(
      task.clientId,
      `New bid placed on your task`,
      "bid"
    );
  } catch (error) {
    console.error("Error Placing Bid:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const viewBids = async (req, res) => {
  try {
    console.log("Viewing Bids for Task...");
    console.log("Request Params:", req.params);

    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.clientId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the Client who posted the task can view bids.",
      });
    }

    const bids = await Bid.find({ taskId }).populate(
      "bidderId",
      "name email role"
    );
    console.log("Bids Retrieved:", bids);

    res.status(200).json(bids);
  } catch (error) {
    console.error(" Error Viewing Bids:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const acceptBid = async (req, res) => {
  try {
    console.log("Accepting Bid...");
    console.log("Request Body:", req.body);

    const { bidId } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const task = await Task.findById(bid.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.clientId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the Client who posted the task can accept bids.",
      });
    }

    // Update
    task.assignedTo = bid.bidderId;
    task.status = "assigned";
    await task.save();

    // Update
    bid.status = "accepted";
    await bid.save();

    // Reject Other Bids
    await Bid.updateMany(
      { taskId: bid.taskId, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    console.log("✅ Bid Accepted, Task Assigned:", task);

    res
      .status(200)
      .json({ message: "Bid accepted successfully, Task assigned", task });
  } catch (error) {
    console.error("Error Accepting Bid:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { placeBid, viewBids, acceptBid };
