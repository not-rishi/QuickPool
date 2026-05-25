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

    routeType: {
      type: String,
      enum: ["QUICK_ROUTE", "USER_ROUTE"],
      required: true,
    },

    timeSlots: [
      {
        startTime: Date,
        endTime: Date,
      },
    ],

    expiresAt: Date,

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

routeSchema.pre("save", function (next) {
  if (this.routeType === "USER_ROUTE") {
    if (!this.timeSlots || this.timeSlots.length !== 1) {
      return next(new Error("User route can only have one slot"));
    }

    if (!this.expiresAt) {
      return next(new Error("User route requires expiry"));
    }
  }

  if (this.routeType === "QUICK_ROUTE") {
    this.expiresAt = null;
  }

  next();
});

module.exports = mongoose.model("Route", routeSchema);
