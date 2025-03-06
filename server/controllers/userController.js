const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Agency Owner Adds an Agency Freelancer
const addAgencyFreelancer = async (req, res) => {
  try {
    console.log("🔍 Adding Agency Freelancer...");
    console.log("🔹 Logged-in User:", req.user);

    if (req.user.role !== "agencyOwner") {
      console.log("❌ Access Denied: Not an Agency Owner");
      return res
        .status(403)
        .json({ message: "Only Agency Owners can add Agency Freelancers." });
    }

    const { name, email, password, skills } = req.body;

    // Check if the freelancer already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new freelancer under the agency
    const freelancer = new User({
      name,
      email,
      password: hashedPassword,
      role: "agencyFreelancer",
      agencyId: req.user.id, // Link freelancer to the Agency Owner
      skills,
    });

    await freelancer.save();
    console.log("✅ Agency Freelancer Added Successfully:", freelancer);

    res.status(201).json({
      message: "Agency Freelancer added successfully",
      freelancer,
    });
  } catch (error) {
    console.error("❌ Error Adding Freelancer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getAgencyFreelancers = async (req, res) => {
  try {
    console.log("🔍 Fetching Agency Freelancers for:", req.user.id);

    if (req.user.role !== "agencyOwner") {
      return res
        .status(403)
        .json({ message: "Only Agency Owners can view Agency Freelancers." });
    }

    const freelancers = await User.find({
      agencyId: req.user.id,
      role: "agencyFreelancer",
    }).select("-password");

    res.status(200).json(freelancers);
  } catch (error) {
    console.error("❌ Error Fetching Freelancers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const removeFreelancer = async (req, res) => {
  try {
    console.log("🗑 Removing Freelancer:", req.params.id);

    if (req.user.role !== "agencyOwner") {
      return res
        .status(403)
        .json({ message: "Only Agency Owners can remove Agency Freelancers." });
    }

    const freelancer = await User.findById(req.params.id);
    if (!freelancer || freelancer.agencyId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Freelancer not found or unauthorized action." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Freelancer removed successfully." });
  } catch (error) {
    console.error("❌ Error Removing Freelancer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get User Details by ID
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ Fetch user by ID, exclude password for security
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error Fetching User Details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUserDetails };

module.exports = {
  addAgencyFreelancer,
  getAgencyFreelancers,
  removeFreelancer,
  getUserDetails,
};
