const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("role");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Add user to request object for future use in routes
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = { protect };
