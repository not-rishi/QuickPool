const Group = require("../models/Group");
const Swap = require("../models/Swap");
const NoShowReport = require("../models/NoShowReport");

exports.getCurrentGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      members: req.userId,
      status: { $ne: "COMPLETED" },
    }).populate("members", "name usn");
    res.json(group);
  } catch (err) {
    next(err);
  }
};

exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId).populate(
      "members",
      "name usn email",
    );
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

exports.leaveGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.members = group.members.filter((m) => m.toString() !== req.userId);
    await group.save();
    res.json({ message: "Left group" });
  } catch (err) {
    next(err);
  }
};

exports.swap = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { avoidUserId } = req.body;
    if (!avoidUserId)
      return res.status(400).json({ message: "avoidUserId required" });
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    const swap = await Swap.create({
      routeId: group.routeId,
      userId: req.userId,
      avoidUserId,
    });
    res.json(swap);
  } catch (err) {
    next(err);
  }
};

exports.reportNoShow = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { reportedUserId, reason } = req.body;
    if (!reportedUserId)
      return res.status(400).json({ message: "reportedUserId required" });
    const report = await NoShowReport.create({
      reporterId: req.userId,
      reportedUserId,
      groupId,
      reason,
    });
    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.getReportStatus = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const reports = await NoShowReport.find({ groupId }).populate(
      "reporterId reportedUserId",
      "name usn",
    );
    res.json(reports);
  } catch (err) {
    next(err);
  }
};
