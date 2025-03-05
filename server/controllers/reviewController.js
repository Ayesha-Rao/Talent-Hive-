const Review = require("../models/Review");
const Task = require("../models/Task");
const User = require("../models/User");
const Subtask = require("../models/Subtask");


const submitReview = async (req, res) => {
  try {
    const { recipientId, taskId, rating, comment } = req.body;

    // ✅ Ensure only completed tasks/subtasks can be reviewed
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

    // ✅ Ensure the reviewer is authorized
    const reviewerRole = req.user.role;
    let validReview = false;

    if (reviewerRole === "client") {
      // ✅ Clients can review Freelancers & Agency Owners
      if (
        task.assignedTo?.toString() === recipientId || // Independent Freelancer
        task.agencyOwnerId?.toString() === recipientId // Agency Owner
      ) {
        validReview = true;
      }
    } else if (reviewerRole === "independentFreelancer") {
      // ✅ Independent Freelancer can review Clients
      if (task.clientId.toString() === recipientId) {
        validReview = true;
      }
    } else if (reviewerRole === "agencyOwner") {
      // ✅ Agency Owners can review Agency Freelancers
      if (subtask && subtask.assignedTo.toString() === recipientId) {
        validReview = true;
      }
    }
   
    else if (reviewerRole === "agencyFreelancer") {
      // ✅ Agency Freelancers can review Agency Owners (based on agencyId field)
      const reviewer = await User.findById(req.user.id);
      if (reviewer.agencyId?.toString() === recipientId) {
        validReview = true;
      }
    }

    console.log("✅ Valid Review Check:", validReview);

    if (!validReview) {
      return res
        .status(403)
        .json({ message: "You are not allowed to review this user." });
    }

    // ✅ Check if a review already exists for this task/subtask
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

    // ✅ Create and save review
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
    console.error("❌ Error Submitting Review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ✅ Get Reviews for a Specific User (Including Reviewer & Task Details)
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 Fetching Reviews for User:", userId);

    const reviews = await Review.find({ recipientId: userId })
      .populate("reviewerId", "name email") // ✅ Fetch the person who gave the review
      .populate("taskId", "title"); // ✅ Fetch the task title

    // if (!reviews || reviews.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No reviews found for this user." });
    // }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error Fetching Reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Average Rating for a User
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
