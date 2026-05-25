const PanicReport = require("../models/PanicReport");
const sendOTP = require("../services/emailService");

exports.panic = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;
    const report = await PanicReport.create({
      userId: req.userId,
      groupId,
      message,
    });
    // Optionally notify admin via email - using EMAIL_FROM as sender and CLIENT_URL as admin contact
    // For now, just save and respond
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};
