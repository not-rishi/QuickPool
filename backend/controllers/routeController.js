const Route = require("../models/Route");
const Queue = require("../models/Queue");

exports.createRoute = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const route = await Route.create(data);
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
    const route = await Route.findById(req.params.routeId).populate(
      "createdBy",
      "name usn",
    );
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (err) {
    next(err);
  }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });
    if (route.createdBy.toString() !== req.userId)
      return res.status(403).json({ message: "Forbidden" });
    await route.remove();
    res.json({ message: "Route deleted" });
  } catch (err) {
    next(err);
  }
};

exports.joinRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const existing = await Queue.findOne({ routeId, userId: req.userId });
    if (existing) return res.status(400).json({ message: "Already in queue" });
    const q = await Queue.create({
      routeId,
      userId: req.userId,
      femaleOnly: req.body.femaleOnly || false,
    });
    res.json(q);
  } catch (err) {
    next(err);
  }
};

exports.leaveRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    await Queue.findOneAndDelete({ routeId, userId: req.userId });
    res.json({ message: "Left route queue" });
  } catch (err) {
    next(err);
  }
};

exports.getQueue = async (req, res, next) => {
  try {
    const queue = await Queue.find({ routeId: req.params.routeId })
      .populate("userId", "name usn email")
      .sort({ joinedAt: 1 });
    res.json(queue);
  } catch (err) {
    next(err);
  }
};
