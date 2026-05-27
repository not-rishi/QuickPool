const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, routeController.createRoute);
router.post("/system", auth, routeController.createQuickRoute);

router.get("/", routeController.getRoutes);

router.get("/:routeId/queue", routeController.getQueue);
router.post("/:routeId/join", auth, routeController.joinRoute);
router.post("/:routeId/leave", auth, routeController.leaveRoute);
router.delete("/:routeId", auth, routeController.deleteRoute);
router.get("/:routeId", routeController.getRouteById);

module.exports = router;
