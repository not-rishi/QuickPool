require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Scheduler for quick routes
const cron = require("node-cron");
const {
  generateQuickRoutes,
  finalizeGroups,
} = require("./services/matchingService");

// Connect DB
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/quickpool");

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/groups", require("./routes/emergencyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(5000, "0.0.0.0", () => {
  console.log("Server broad-listening on port 5000");
});

// Schedule daily quick route regeneration at midnight
try {
  cron.schedule("0 0 * * *", async () => {
    await generateQuickRoutes();
  });

  // Schedule every minute: finalizes groups
  cron.schedule("* * * * *", async () => {
    await finalizeGroups();
  });
} catch (e) {
  console.error("Failed to schedule cron job:", e.message);
}
