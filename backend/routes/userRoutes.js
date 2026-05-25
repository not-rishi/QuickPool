const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/me", auth, userController.getMe);
router.put("/me", auth, userController.updateMe);
router.get("/me/history", auth, userController.getHistory);
router.post("/", userController.createUser);


module.exports = router;
