const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    usn: {
      type: String,
      required: true,
      unique: true,
    },

    // role: {
    //   type: String,
    //   enum: ["STUDENT", "ADMIN"],
    //   default: "STUDENT", // Regular users default to STUDENT
    // },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    department: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    reputationScore: {
      type: Number,
      default: 100,
    },

    rideHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RideHistory",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
