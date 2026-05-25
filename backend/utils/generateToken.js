const jwt = require("jsonwebtoken");

function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "7d" });
  return token;
}

module.exports = generateToken;
