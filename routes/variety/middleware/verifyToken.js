const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function secretVerifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("token::", token);

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // ✅ Continue to next route or middleware
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

// ✅ Correct export
module.exports = secretVerifyToken;
