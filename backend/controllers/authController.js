const OTP = require("../models/OTP");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const { sendOTP } = require("../services/emailService");
const generateToken = require("../utils/generateToken");

const DEV_CONFIG = {
  magicUsn: "SMARTRISHI", // Any designated testing USN
  magicOtp: "111111", // The easy bypass code
  mockEmail: "rishicool@bmsce.ac.in", // Fallback mock email for testing
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { usn } = req.body;

    if (!usn) {
      return res.status(400).json({
        message: "USN required",
      });
    }

    if (usn === DEV_CONFIG.magicUsn) {
      return res.json({
        message: "OTP sent to registered email (Dev Bypass Enabled)",
      });
    }

    // Find user using USN
    const user = await User.findOne({ usn });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateOTP(6);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({
      usn,
      email: user.email,
      otp,
      expiresAt,
      verified: false,
    });

    await sendOTP(user.email, otp);

    res.json({
      message: "OTP sent to registered email",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { usn, otp } = req.body;
    if (!usn || !otp)
      return res.status(400).json({ message: "usn and otp required" });

    if (usn === DEV_CONFIG.magicUsn && otp === DEV_CONFIG.magicOtp) {
      let user = await User.findOne({ usn });
      if (!user) {
        user = await User.create({
          usn: DEV_CONFIG.magicUsn,
          email: DEV_CONFIG.mockEmail,
          name: "Dev Sandbox",
        });
      }
      const token = generateToken({ id: user._id });
      return res.json({ token, user });
    }
    const record = await OTP.findOne({ usn, otp }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });
    record.verified = true;
    await record.save();
    // find or create user
    let user = await User.findOne({ usn });
    if (!user) {
      user = await User.create({ usn, email: record.email, name: usn });
    }
    const token = generateToken({ id: user._id });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  // For stateless JWT, logout handled client-side. Still provide endpoint.
  res.json({ message: "Logged out" });
};
