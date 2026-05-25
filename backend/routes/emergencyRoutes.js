const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergencyController");
const auth = require("../middleware/authMiddleware");

router.post("/:groupId/panic", auth, emergencyController.panic);

module.exports = router;
