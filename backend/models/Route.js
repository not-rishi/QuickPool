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

    expiresAt: {
      type: Date,
      expires: 0,
    },

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

routeSchema.pre("save", function () {
  if (this.routeType === "USER_ROUTE") {
    if (!this.timeSlots || this.timeSlots.length !== 1) {
      throw new Error("User route can only have one slot");
    }

    const endTime = this.timeSlots[0].endTime;
    if (!endTime) {
      throw new Error("User route requires an endTime in timeSlots");
    }

    this.expiresAt = new Date(
      new Date(endTime).getTime() + 24 * 60 * 60 * 1000,
    );
  }

  if (this.routeType === "QUICK_ROUTE") {
    this.expiresAt = null;
  }
});

module.exports = mongoose.model("Route", routeSchema);
