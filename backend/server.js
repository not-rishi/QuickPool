require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
