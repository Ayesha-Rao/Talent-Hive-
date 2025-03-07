const Review = require("../models/Review");
const Task = require("../models/Task");
const User = require("../models/User");
const Subtask = require("../models/Subtask");

const submitReview = async (req, res) => {
  try {
    const { recipientId, taskId, rating, comment } = req.body;

    //completed tasks here or subtasks
    const task = await Task.findById(taskId);
    const subtask = await Subtask.findOne({ taskId, assignedTo: req.user.id });

    if (!task && !subtask) {
      return res.status(404).json({ message: "Task or Subtask not found." });
    }

    if (task && task.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed tasks." });
    }
    if (subtask && subtask.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed subtasks." });
    }

    const reviewerRole = req.user.role; //auth
    let validReview = false;

    if (reviewerRole === "client") {
      if (
        task.assignedTo?.toString() === recipientId || // Independent Freelancer
        task.agencyOwnerId?.toString() === recipientId // Agency Owner
      ) {
        validReview = true;
      }
    } else if (reviewerRole === "independentFreelancer") {
      if (task.clientId.toString() === recipientId) {
        validReview = true;
      }
    } else if (reviewerRole === "agencyOwner") {
      //review client
      if (task.clientId.toString() === recipientId) {
        validReview = true;
      }
    } else if (reviewerRole === "agencyOwner") {
      if (subtask && subtask.assignedTo.toString() === recipientId) {
        validReview = true;
      }
    } else if (reviewerRole === "agencyFreelancer") {
      const reviewer = await User.findById(req.user.id);
      if (reviewer.agencyId?.toString() === recipientId) {
        validReview = true;
      }
    }

    console.log("Valid Review Check:", validReview);

    if (!validReview) {
      return res
        .status(403)
        .json({ message: "You are not allowed to review this user." });
    }

    const existingReview = await Review.findOne({
      taskId,
      recipientId,
      reviewerId: req.user.id,
    });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this user for this task.",
      });
    }

    const review = new Review({
      reviewerId: req.user.id,
      recipientId,
      taskId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error Submitting Review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 Fetching Reviews for User:", userId);

    const reviews = await Review.find({ recipientId: userId })
      .populate("reviewerId", "name email")
      .populate("taskId", "title");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error Fetching Reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ recipientId: userId });
    if (!reviews.length) return res.status(200).json({ averageRating: 0 });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.status(200).json({ averageRating: averageRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { submitReview, getUserReviews, getAverageRating };
