const Route = require("../models/Route");
const Queue = require("../models/Queue");
const mongoose = require("mongoose");

exports.createRoute = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;

    // Force USER_ROUTE for routes created by users and set default expiry
    data.routeType = "USER_ROUTE";
    data.expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const route = await Route.create(data);
    res.status(201).json(route);
  } catch (err) {
    next(err);
  }
};

exports.createQuickRoute = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (body.timeSlots && Array.isArray(body.timeSlots)) {
      body.timeSlots = body.timeSlots.map((slot) => ({
        startTime: slot.startTime || slot.start,
        endTime: slot.endTime || slot.end,
      }));
    }

    console.log(
      "createQuickRoute called, typeof next:",
      typeof next,
      "next=",
      next,
    );

    const route = await Route.create({
      ...body,
      routeType: "QUICK_ROUTE",
      createdBy: null,
      expiresAt: null,
    });

    res.status(201).json(route);
  } catch (err) {
    next(err);
  }
};

exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find({ active: true }).populate(
      "createdBy",
      "name usn",
    );
    res.json(routes);
  } catch (err) {
    next(err);
  }
};

exports.getRouteById = async (req, res, next) => {
  try {
    const { routeId } = req.params;

    console.log("routeId:", routeId);

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({
        message: "Invalid route ID",
      });
    }

    const route = await Route.findById(routeId);

    const alreadyJoined = await Queue.findOne({
      userId: req.userId,
    });

    res.json({
      ...route.toObject(),
      alreadyJoined: !!alreadyJoined,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });

    // ⚡ Allow deletion if it's the admin panel bypassing auth,
    // otherwise enforce strict creator ownership rules.
    const isAdminBypass = req.headers["x-admin-bypass"] === "true";

    if (!isAdminBypass) {
      if (!route.createdBy || route.createdBy.toString() !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    // Use deleteOne since remove() is deprecated in newer Mongoose versions
    await Route.deleteOne({ _id: routeId });
    await Queue.deleteMany({ routeId: routeId });

    res.json({ message: "Route and associated queues deleted successfully" });
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
      return res.status(403).json({ message: "Forbidden: You are not a member of this group" });
    }

    // 3. Guard: Prevent redundant updates if someone else already started it
    if (group.status === "STARTED") {
      return res.status(400).json({ message: "Ride has already been started by another member" });
    }
    if (group.status === "COMPLETED") {
      return res.status(400).json({ message: "This ride is already completed" });
    }

    // 4. Fetch the target Route configuration to get the exact slot timestamps
    const Route = require("../models/Route");
    const route = await Route.findById(group.routeId);
    if (!route) {
      return res.status(404).json({ message: "Associated travel route details not found" });
    }

    // Find the specific time slot matching this group's execution run
    const activeSlot = route.timeSlots.find(
      (slot) => slot._id.toString() === group.slotId.toString()
    );

    if (!activeSlot) {
      return res.status(400).json({ message: "Invalid time slot configuration" });
    }

    // 5. Enforce Time Window Restrictions (Current time must be between start and end time)
    const now = Date.now();
    const slotStart = new Date(activeSlot.startTime).getTime();
    const slotEnd = new Date(activeSlot.endTime).getTime();

    if (now < slotStart) {
      return res.status(400).json({ 
        message: `Premature execution window. You can only start this ride after ${new Date(slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
      });
    }

    if (now > slotEnd) {
      return res.status(400).json({ 
        message: "This operational window has expired. You cannot start a past route run." 
      });
    }

    // 6. Update Group parameters state globally for all linked users
    group.status = "STARTED";
    group.rideTime = new Date(); // Updates backend reference for the 5-min report window tracker
    await group.save();

    res.json({ message: "Ride successfully initialized across pipelines.", group });
  } catch (err) {
    next(err);
  }
};

exports.joinRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const { slotId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    // Check if user is already in a queue for ANY route
    // Check if user is already in a queue for ANY route
    const queueEntry = await Queue.findOne({ userId: req.userId });

    if (queueEntry) {
      // Fetch the route tied to this queue entry
      const existingRoute = await Route.findById(queueEntry.routeId);

      // Determine if the route has expired based on its time slots
      let isExpired = false;
      if (
        existingRoute &&
        existingRoute.timeSlots &&
        existingRoute.timeSlots.length > 0
      ) {
        const latestEndTime = Math.max(
          ...existingRoute.timeSlots.map((slot) =>
            new Date(slot.endTime || slot.end).getTime(),
          ),
        );
        if (latestEndTime <= Date.now()) {
          isExpired = true;
        }
      }

      // If the route was deleted, or the time slot passed, clean up the orphan queue
      if (!existingRoute || isExpired) {
        await Queue.deleteOne({ _id: queueEntry._id });
        console.log(`Cleaned up orphaned queue entry for user ${req.userId}`);
      } else {
        // Route is still valid and active, block them
        return res.status(400).json({
          message:
            "You are already in a queue for another active route. Leave that queue first.",
        });
      }
    }

    // Check if user is already in a group
    const Group = require("../models/Group");
    const userGroup = await Group.findOne({
      members: req.userId,
      status: { $in: ["FORMED", "STARTED"] },
    });
    if (userGroup) {
      return res.status(400).json({
        message: "You are already in a group. Leave your group first.",
      });
    }

    const route = await Route.findById(routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });

    const slotExists =
      route.timeSlots &&
      route.timeSlots.some((slot) => slot._id.toString() === slotId);

    if (!slotExists) {
      return res.status(400).json({
        message: "Invalid slot",
      });
    }

    const q = await Queue.create({
      routeId,
      slotId,
      userId: req.userId,
      femaleOnly: req.body.femaleOnly || false,
    });

    // Try to trigger auto grouping immediately when someone joins
    const { formGroupsForRoute } = require("../services/matchingService");
    await formGroupsForRoute(routeId, slotId);

    res.json(q);
  } catch (err) {
    next(err);
  }
};

exports.leaveRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    await Queue.findOneAndDelete({ routeId, userId: req.userId });
    res.json({ message: "Left route queue" });
  } catch (err) {
    next(err);
  }
};

exports.getQueue = async (req, res, next) => {
  try {
    const { routeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const filter = { routeId };
    if (req.query.slotId) filter.slotId = req.query.slotId;

    const queue = await Queue.find(filter)
      .populate("userId", "name usn email")
      .sort({ joinedAt: 1 });
    res.json(queue);
  } catch (err) {
    next(err);
  }
};
