// category.js (Controller)

const Category = require("../models/Category");
const Role = require("../models/Role");

const addCategory = async (req, res) => {
  console.log("addCategory called be");
  try {
    const { name, description, roleIds } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Validate that the provided role IDs exist in the Role model
    const roles = await Role.find({ _id: { $in: roleIds } });
    if (roles.length !== roleIds.length) {
      return res.status(400).json({ message: "Some roles do not exist" });
    }

    // Create the new category with roles
    const newCategory = new Category({ name, description, roles: roleIds });
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { name, description, roleIds } = req.body;

    // Validate that the provided role IDs exist in the Role model
    const roles = await Role.find({ _id: { $in: roleIds } });
    if (roles.length !== roleIds.length) {
      return res.status(400).json({ message: "Some roles do not exist" });
    }

    // Update category with new name, description, and roles
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, roles: roleIds },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // Retrieve all categories and populate their associated roles
    const categories = await Category.find().populate("roles");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error getting categories", error });
  }
};

//get categories for that role
const getCategoriesForUser = async (req, res) => {
  try {
    const userRole = req.user.role.name; // assuming user role is stored in the `role.name` field

    // Find the role of the user
    const userRoleData = await Role.findOne({ name: userRole });
    if (!userRoleData) {
      return res.status(403).json({ message: "Role not found" });
    }

    // Fetch all categories where the user's role is included in the roles array
    const categories = await Category.find({
      roles: { $in: [userRoleData._id] }, // Check if user's role ID exists in the category's roles array
    }).populate("roles"); // Optionally populate role data

    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No categories available for your role" });
    }

    res.status(200).json(categories); // Send categories that are allowed for the user's role
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

module.exports = {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoriesForUser,
};
