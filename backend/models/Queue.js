const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  femaleOnly: {
    type: Boolean,
    default: false,
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

queueSchema.index({ routeId: 1, slotId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Queue", queueSchema);
