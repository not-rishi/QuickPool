const User = require("../models/User");
const Route = require("../models/Route");
const PanicReport = require("../models/PanicReport");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find().populate("createdBy", "name usn");
    res.json(routes);
  } catch (err) {
    next(err);
  }
};

exports.getPanicReports = async (req, res, next) => {
  try {
    const reports = await PanicReport.find().populate("userId groupId routeId");
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

exports.updateReputation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reputationScore } = req.body;
    if (typeof reputationScore !== "number")
      return res
        .status(400)
        .json({ message: "reputationScore must be a number" });
    const user = await User.findByIdAndUpdate(
      userId,
      { reputationScore },
      { new: true },
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};
