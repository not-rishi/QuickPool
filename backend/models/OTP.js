const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    usn: String,

    email: String,

    otp: String,

    expiresAt: Date,

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("OTP", otpSchema);
