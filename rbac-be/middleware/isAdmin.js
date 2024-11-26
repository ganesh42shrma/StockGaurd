const isAdmin = (req, res, next) => {
  const userRole = req.user.role.name;
  if (userRole !== "Admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can access this route" });
  }
  next(); // Proceed to the next middleware/route handler if the user is an admin
};

module.exports = { isAdmin };
