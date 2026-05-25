const PanicReport = require("../models/PanicReport");
const { sendPanicEmail } = require("../services/emailService");
const User = require("../models/User");

exports.panic = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;
    const report = await PanicReport.create({
      userId: req.userId,
      groupId,
      message,
    });

    const user = await User.findById(req.userId);
    if (user) {
      await sendPanicEmail(groupId, message, user.email);
    }

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};
