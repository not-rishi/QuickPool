const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");

// Note: In a real app you'd check for admin privileges in middleware.
router.get("/users", auth, adminController.getUsers);
router.get("/routes", auth, adminController.getRoutes);
router.get("/panic-reports", auth, adminController.getPanicReports);
router.patch(
  "/users/:userId/reputation",
  auth,
  adminController.updateReputation,
);
// Add this to your admin routes file
router.delete("/panic-reports/:reportId", auth, adminController.dismissPanicReport);


module.exports = router;
