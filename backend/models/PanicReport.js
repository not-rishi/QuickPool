const mongoose = require("mongoose");

const panicSchema = new mongoose.Schema(
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

    message: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PanicReport", panicSchema);
