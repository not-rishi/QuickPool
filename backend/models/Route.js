const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    description: String,

    batchSize: {
      type: Number,
      enum: [3, 4, 6],
    },

    rideTime: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Route", routeSchema);
