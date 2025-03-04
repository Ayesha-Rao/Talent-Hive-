const Review = require("../models/Review");
const Task = require("../models/Task");
const User = require("../models/User");

// ✅ Submit a Review (Only if Task is Completed)
const submitReview = async (req, res) => {
  try {
    const { recipientId, taskId, rating, comment } = req.body;

    // ✅ Ensure only completed tasks can be reviewed
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });
    if (task.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed tasks." });
    }

    // ✅ Ensure user is authorized to review
    if (task.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the client can submit a review for this task." });
    }

    // ✅ Check if a review already exists for this task
    const existingReview = await Review.findOne({ taskId, recipientId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this freelancer." });
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Reviews for a User
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ recipientId: userId }).populate("reviewerId", "name email");
    if (!reviews.length) return res.status(404).json({ message: "No reviews found for this user." });

    res.status(200).json(reviews);
  } catch (error) {
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
