const Group = require("../models/Group");
const Swap = require("../models/Swap");
const NoShowReport = require("../models/NoShowReport");
const Queue = require("../models/Queue");
const { formGroupsForRoute } = require("../services/matchingService");

exports.getCurrentGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      members: req.userId,
      status: { $ne: "COMPLETED" },
    }).populate("members", "name email usn phone");
    res.json(group);
  } catch (err) {
    next(err);
  }
};

exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId).populate(
      "members",
      "name usn email phone gender reputationScore",
    );
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

exports.startGroupRide = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // 1. Fetch group and verify existence
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // 2. Guard: Ensure the user trying to start it is an authorized group member
    const isMember = group.members.some((m) => m.toString() === req.userId);
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not a member of this group" });
    }

    // 3. Guard: Prevent redundant updates if someone else already started it
    if (group.status === "STARTED") {
      return res
        .status(400)
        .json({ message: "Ride has already been started by another member" });
    }
    if (group.status === "COMPLETED") {
      return res
        .status(400)
        .json({ message: "This ride is already completed" });
    }

    // 4. Fetch the target Route configuration to get the exact slot timestamps
    const Route = require("../models/Route");
    const route = await Route.findById(group.routeId);
    if (!route) {
      return res
        .status(404)
        .json({ message: "Associated travel route details not found" });
    }

    // Find the specific time slot matching this group's execution run
    const activeSlot = route.timeSlots.find(
      (slot) => slot._id.toString() === group.slotId.toString(),
    );

    if (!activeSlot) {
      return res
        .status(400)
        .json({ message: "Invalid time slot configuration" });
    }

    // 5. Enforce Time Window Restrictions (Current time must be between start and end time)
    const now = Date.now();
    const slotStart = new Date(activeSlot.startTime).getTime();
    const slotEnd = new Date(activeSlot.endTime).getTime();

    if (now < slotStart) {
      return res.status(400).json({
        message: `Premature execution window. You can only start this ride after ${new Date(slotStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      });
    }

    if (now > slotEnd) {
      return res.status(400).json({
        message:
          "This operational window has expired. You cannot start a past route run.",
      });
    }

    // 6. Update Group parameters state globally for all linked users
    group.status = "STARTED";
    group.rideTime = new Date(); // Updates backend reference for the 5-min report window tracker
    await group.save();

    res.json({
      message: "Ride successfully initialized across pipelines.",
      group,
    });
  } catch (err) {
    next(err);
  }
};

exports.leaveGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group)
      return res.status(404).json({
        message: "Group not found",
      });

    // Remove leaving user
    const remainingMembers = group.members.filter(
      (m) => m.toString() !== req.userId,
    );

    // Delete old group completely
    await Group.findByIdAndDelete(groupId);

    // Put remaining members back in queue
    if (remainingMembers.length > 0) {
      const queueEntries = remainingMembers.map((memberId) => ({
        routeId: group.routeId,
        slotId: group.slotId,
        userId: memberId,
        femaleOnly: false,
      }));

      await Queue.insertMany(queueEntries);

      // Re-run matching
      await formGroupsForRoute(group.routeId, group.slotId);
    }

    res.json({
      message: "Left group successfully",
    });
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

    const swapCount = await Swap.countDocuments({
      routeId: group.routeId,
      userId: req.userId,
    });
    if (swapCount >= 1)
      return res
        .status(400)
        .json({ message: "Only one swap allowed per route" });

    const swap = await Swap.create({
      routeId: group.routeId,
      userId: req.userId,
      avoidUserId,
    });

    // Remove from group
    group.members = group.members.filter((m) => m.toString() !== req.userId);
    await group.save();

    // Add back to queue
    await Queue.create({
      routeId: group.routeId,
      slotId: group.slotId,
      userId: req.userId,
      femaleOnly: false, // Defaulting to false, user can leave and rejoin if they want it
    });

    // Try matching if the group is empty (if group < batchSize maybe tryMatch, but wait, group size is now less)
    // Actually we should try to match the queue again in case there are people waiting
    await formGroupsForRoute(group.routeId, group.slotId);

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

    // Prevent duplicate reports by the same user for the same group + user
    const existing = await NoShowReport.findOne({
      reporterId: req.userId,
      reportedUserId,
      groupId,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "You already reported this user" });

    const report = await NoShowReport.create({
      reporterId: req.userId,
      reportedUserId,
      groupId,
      reason,
    });

    // Deduct reputation penalty
    const User = require("../models/User");
    const reported = await User.findById(reportedUserId);
    if (reported) {
      reported.reputationScore -= 10;
      await reported.save();
    }

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
