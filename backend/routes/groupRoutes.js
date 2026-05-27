const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const auth = require("../middleware/authMiddleware");

router.get("/current", auth, groupController.getCurrentGroup);
router.get("/:groupId", auth, groupController.getGroupById);
router.post("/:groupId/leave", auth, groupController.leaveGroup);
router.post("/:groupId/swap", auth, groupController.swap);
router.post("/:groupId/report", auth, groupController.reportNoShow);
router.get("/:groupId/report-status", auth, groupController.getReportStatus);

router.patch("/:groupId/start", auth, groupController.startGroupRide);

module.exports = router;
