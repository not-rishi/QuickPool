const mongoose = require("mongoose");

const noShowSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    reason: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("NoShowReport", noShowSchema);
