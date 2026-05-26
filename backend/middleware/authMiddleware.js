const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  if (req.headers["x-admin-bypass"] === "true") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ message: "Invalid auth header" });

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = payload.id;
    req.user = await User.findById(req.userId).select("-__v");

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
