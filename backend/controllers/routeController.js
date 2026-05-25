const Route = require("../models/Route");
const Queue = require("../models/Queue");

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
    const { slotId } = req.body;

    const existing = await Queue.findOne({ routeId, userId: req.userId });
    if (existing) return res.status(400).json({ message: "Already in queue" });

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
    const filter = { routeId: req.params.routeId };
    if (req.query.slotId) filter.slotId = req.query.slotId;

    const queue = await Queue.find(filter)
      .populate("userId", "name usn email")
      .sort({ joinedAt: 1 });
    res.json(queue);
  } catch (err) {
    next(err);
  }
};
