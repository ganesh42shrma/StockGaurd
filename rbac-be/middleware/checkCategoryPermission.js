const Role = require("../models/Role");

const checkCategoryPermission = async (req, res, next) => {
  console.log("hitting checkCategoryPermission middleware");
  const { category } = req.body;
  console.log(req.body);
  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  try {
    // Get the user's role from the request (set by the `protect` middleware)
    const userRole = req.user.role;
    console.log("in req.user.role", req.user.role.name);
    // Check if the category is allowed for the user's role
    if (userRole.name === "Admin") {
      // Admin can add inventory to any category
      return next();
    }

    if (userRole.permissions.categories.includes(category)) {
      // The user's role has permission to manage the category
      return next();
    }

    // If the user doesn't have permission, return a 403 error
    return res.status(403).json({
      message: `Forbidden: You do not have permission to add inventory to the '${category}' category`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error checking category permissions", error });
  }
};

module.exports = { checkCategoryPermission };
