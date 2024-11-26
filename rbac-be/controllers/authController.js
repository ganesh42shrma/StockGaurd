const bcrypt = require("bcrypt"); // Import bcrypt for password comparison
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("role");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Successful login response
  res.json({
    message: "Login successful", // Success message
    token, // JWT token
    user, // User details
  });
};

module.exports = { login };
