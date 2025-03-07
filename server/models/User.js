const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "client",
        "independentFreelancer",
        "agencyOwner",
        "agencyFreelancer",
      ],
      required: true,
    },
    agencyName: {
      type: String,
      required: function () {
        return this.role === "agencyOwner";
      },
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Only for agency freelancers
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
