const User = require("../models/User");
const Route = require("../models/Route");
const PanicReport = require("../models/PanicReport");

exports.dismissPanicReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await PanicReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Panic report not found" });
    }

    await PanicReport.deleteOne({ _id: reportId });

    res.json({ message: "Panic report dismissed successfully" });
  } catch (err) {
    next(err);
  }
};

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
    const reports = await PanicReport.find()
      .populate("userId")
      .populate({
        path: "groupId",
        populate: [
          {
            path: "members",
            select: "name usn email phone gender reputationScore",
          },
          {
            path: "routeId",
            select: "start destination description",
          },
        ],
      })
      .sort({ createdAt: -1 });

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
