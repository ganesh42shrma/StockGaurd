const Role = require("../models/Role");

const checkPermission = (action) => {
  return async (req, res, next) => {
    const { userId } = req; // Assume userId is set after authentication
    const userRole = await Role.findOne({ users: userId }); // Find the role of the user

    if (!userRole) {
      return res.status(403).json({ message: "Role not found" });
    }

    // Check permissions for specific actions
    if (action === "manageCategories") {
      if (userRole.name === "Admin") {
        return next(); // Admin can manage all categories
      } else if (
        userRole.permissions.categories.includes("All") ||
        userRole.permissions.categories.some((cat) =>
          req.body.categories.includes(cat)
        )
      ) {
        return next(); // Other roles based on categories they have permission for
      } else {
        return res.status(403).json({
          message: "You don't have permission to manage these categories",
        });
      }
    }

    return res.status(403).json({ message: "Forbidden action" });
  };
};

module.exports = { checkPermission };
