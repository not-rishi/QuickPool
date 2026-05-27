const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");

router.get("/users", auth, adminController.getUsers);
router.get("/routes", auth, adminController.getRoutes);
router.get("/panic-reports", auth, adminController.getPanicReports);
router.patch(
  "/users/:userId/reputation",
  auth,
  adminController.updateReputation,
);

router.delete(
  "/panic-reports/:reportId",
  auth,
  adminController.dismissPanicReport,
);

module.exports = router;
