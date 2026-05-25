const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, routeController.createRoute);
router.get("/", routeController.getRoutes);
router.get("/:routeId", routeController.getRouteById);
router.delete("/:routeId", auth, routeController.deleteRoute);
router.post("/:routeId/join", auth, routeController.joinRoute);
router.post("/:routeId/leave", auth, routeController.leaveRoute);
router.get("/:routeId/queue", routeController.getQueue);

module.exports = router;
