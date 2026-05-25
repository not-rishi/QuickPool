const mongoose = require("mongoose");

const rideHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    rideDate: Date,

    groupSize: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("RideHistory", rideHistorySchema);
