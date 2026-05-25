const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    rideTime: Date,

    status: {
      type: String,
      enum: ["FORMED", "STARTED", "COMPLETED"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Group", groupSchema);
