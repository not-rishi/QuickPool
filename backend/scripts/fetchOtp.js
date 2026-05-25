const mongoose = require("mongoose");
const OTP = require("../models/OTP");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/quickpool";
const usn = process.argv[2];
if (!usn) {
  console.error("Usage: node fetchOtp.js <USN>");
  process.exit(2);
}

(async () => {
  try {
    await mongoose.connect(uri);
    const record = await OTP.findOne({ usn }).sort({ createdAt: -1 }).lean();
    if (!record) {
      console.log("NO_RECORD");
      process.exit(0);
    }
    console.log(record.otp);
    process.exit(0);
  } catch (e) {
    console.error("ERR", e.message || e);
    process.exit(1);
  }
})();
