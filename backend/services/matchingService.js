const Queue = require("../models/Queue");
const Group = require("../models/Group");
const Swap = require("../models/Swap");
const User = require("../models/User");
const Route = require("../models/Route");

const matchingLocks = new Set();

async function runMatchingLogic(routeId, slotId, isFinalizing = false) {
  const route = await Route.findById(routeId);
  if (!route) return;
  const batchSize = route.batchSize || 3;

  const queued = await Queue.find({ routeId, slotId })
    .populate("userId")
    .sort({ joinedAt: 1 })
    .exec();
  if (queued.length === 0) return;

  const swaps = await Swap.find({ routeId }).exec();

  let available = [...queued];
  const formedGroups = [];

  while (available.length >= batchSize) {
    let currentGroup = [available[0]];
    available.splice(0, 1);

    let isFemaleGroup = currentGroup[0].femaleOnly;
    let requiredGender = isFemaleGroup ? "Female" : null;
    if (
      currentGroup[0].userId.gender === "Female" &&
      currentGroup[0].femaleOnly
    ) {
      requiredGender = "Female";
    }

    for (
      let i = 0;
      i < available.length && currentGroup.length < batchSize;
      i++
    ) {
      let candidate = available[i];
      let canJoin = true;

      if (candidate.femaleOnly && candidate.userId.gender === "Female") {
        if (
          requiredGender === null &&
          currentGroup.some((m) => m.userId.gender !== "Female")
        ) {
          canJoin = false;
        } else if (requiredGender === null) {
          requiredGender = "Female";
          isFemaleGroup = true;
        }
      }

      if (requiredGender === "Female" && candidate.userId.gender !== "Female") {
        canJoin = false;
      }

      if (canJoin && isFemaleGroup && candidate.userId.gender !== "Female")
        canJoin = false;

      if (canJoin) {
        for (let m of currentGroup) {
          const hasSwap = swaps.some(
            (s) =>
              (s.userId.toString() === candidate.userId._id.toString() &&
                s.avoidUserId.toString() === m.userId._id.toString()) ||
              (s.userId.toString() === m.userId._id.toString() &&
                s.avoidUserId.toString() === candidate.userId._id.toString()),
          );
          if (hasSwap) {
            canJoin = false;
            break;
          }
        }
      }

      if (canJoin) {
        currentGroup.push(candidate);
        available.splice(i, 1);
        i--;
      }
    }

    if (currentGroup.length === batchSize) {
      const stillInQueue = await Queue.find({
        _id: { $in: currentGroup.map((c) => c._id) },
      });

      if (stillInQueue.length !== currentGroup.length) {
        continue;
      }
      const members = currentGroup.map((q) => q.userId._id);
      const rideTime =
        route.timeSlots && route.timeSlots.length > 0
          ? route.timeSlots.find((s) => s._id.toString() === slotId.toString())
              ?.startTime || new Date()
          : new Date();

      await Group.create({
        routeId,
        slotId,
        members,
        status: "FORMED",
        rideTime,
      });

      await Queue.deleteMany({ _id: { $in: currentGroup.map((c) => c._id) } });
      formedGroups.push(currentGroup);
    } else {
      available = [...currentGroup.slice(1), ...available];
    }
  }
}

async function formGroupsForRoute(routeId, slotId) {
  const key = `${routeId}-${slotId}`;

  if (matchingLocks.has(key)) {
    console.log("Matching already running:", key);
    return;
  }

  matchingLocks.add(key);

  try {
    await runMatchingLogic(routeId, slotId, false);
  } finally {
    matchingLocks.delete(key);
  }
}

async function generateQuickRoutes() {
  console.log("generateQuickRoutes: called");
}

async function finalizeGroups() {
  return;
}

module.exports = { formGroupsForRoute, generateQuickRoutes, finalizeGroups };
