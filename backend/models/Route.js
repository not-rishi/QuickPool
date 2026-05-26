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

    // 1. Tell MongoDB to treat this as a TTL index.
    // It will automatically delete the document at the exact date/time stored here.
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

    // 2. Automatically calculate expiration time: endTime + 24 hours
    // (24 hours * 60 mins * 60 secs * 1000 ms)
    this.expiresAt = new Date(
      new Date(endTime).getTime() + 24 * 60 * 60 * 1000,
    );
  }

  if (this.routeType === "QUICK_ROUTE") {
    // Setting this to null ensures MongoDB's TTL worker completely ignores it,
    // allowing QUICK_ROUTEs to persist infinitely.
    this.expiresAt = null;
  }
});

module.exports = mongoose.model("Route", routeSchema);
