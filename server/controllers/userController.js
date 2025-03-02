const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Agency Owner Adds an Agency Freelancer
const addAgencyFreelancer = async (req, res) => {
    try {
        console.log("🔍 Adding Agency Freelancer...");
        console.log("🔹 Logged-in User:", req.user);

        if (req.user.role !== "agencyOwner") {
            console.log("❌ Access Denied: Not an Agency Owner");
            return res.status(403).json({ message: "Only Agency Owners can add Agency Freelancers." });
        }

        const { name, email, password, skills } = req.body;

        // Check if the freelancer already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
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
            skills
        });

        await freelancer.save();
        console.log("✅ Agency Freelancer Added Successfully:", freelancer);

        res.status(201).json({
            message: "Agency Freelancer added successfully",
            freelancer
        });
    } catch (error) {
        console.error("❌ Error Adding Freelancer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { addAgencyFreelancer };
