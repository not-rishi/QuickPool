const Queue = require("../models/Queue");
const Group = require("../models/Group");

async function formGroupsForRoute(routeId, slotId, batchSize = 3) {
  // Simple FIFO grouping within a slot: pull earliest queued users and create groups of batchSize
  const queued = await Queue.find({ routeId, slotId })
    .sort({ joinedAt: 1 })
    .limit(batchSize)
    .exec();
  if (queued.length < batchSize) return null;
  const members = queued.map((q) => q.userId);
  const group = await Group.create({
    routeId,
    slotId,
    members,
    status: "FORMED",
    rideTime: new Date(),
  });
  // remove queued entries
  await Queue.deleteMany({ _id: { $in: queued.map((q) => q._id) } });
  return group;
}

async function generateQuickRoutes() {
  // Placeholder: implement quick route regeneration logic here.
  // Currently a no-op that logs for daily scheduler.
  console.log("generateQuickRoutes: called");
  return;
}

module.exports = { formGroupsForRoute, generateQuickRoutes };
