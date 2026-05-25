const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  avoidUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Swap", swapSchema);
