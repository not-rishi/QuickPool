const Queue = require("../models/Queue");
const Group = require("../models/Group");

async function formGroupsForRoute(routeId, batchSize = 3) {
  // Simple FIFO grouping: pull earliest queued users and create groups of batchSize
  const queued = await Queue.find({ routeId })
    .sort({ joinedAt: 1 })
    .limit(batchSize)
    .exec();
  if (queued.length < batchSize) return null;
  const members = queued.map((q) => q.userId);
  const group = await Group.create({
    routeId,
    members,
    status: "FORMED",
    rideTime: new Date(),
  });
  // remove queued entries
  await Queue.deleteMany({ _id: { $in: queued.map((q) => q._id) } });
  return group;
}

module.exports = { formGroupsForRoute };
