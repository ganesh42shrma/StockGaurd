const User = require("../models/User");
const Role = require("../models/Role");

// Create a new user and assign a role
const createUser = async (req, res) => {
  const { name, email, password, roleId } = req.body;

  try {
    // Check if the roleId exists in the Role collection
    const role = await Role.findById(roleId);
    if (!role) {
      return res
        .status(400)
        .json({ message: "Invalid roleId, role does not exist" });
    }

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create a new user with the validated roleId
    const user = new User({ name, email, password, role: roleId });
    await user.save();

    // Return the user data along with the role name
    res.status(201).json({
      message: "User created successfully",
      user: {
        ...user.toObject(),
        roleName: role.name, // Add role name to the response
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get all users with their roles
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update/Edit a user
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, roleId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If roleId is provided, check if the role exists
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res
          .status(400)
          .json({ message: "Invalid roleId, role does not exist" });
      }
      user.role = roleId;
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;

    // Save the updated user
    await user.save();

    // Return updated user with role name
    const updatedUser = await User.findById(userId).populate("role");
    res.json({
      message: "User updated successfully",
      user: {
        ...updatedUser.toObject(),
        roleName: updatedUser.role.name, // Add role name to the response
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
