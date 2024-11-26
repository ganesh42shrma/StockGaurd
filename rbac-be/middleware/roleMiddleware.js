const Role = require("../models/Role");

const checkPermission = (action, category, price) => async (req, res, next) => {
  const role = await Role.findById(req.user.role);
  if (
    role.permissions.categories.includes(category) &&
    (!price || role.permissions.maxPrice >= price)
  ) {
    return next();
  }
  return res.status(403).json({ message: "Permission denied" });
};

module.exports = { checkPermission };
