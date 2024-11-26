const express = require("express");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/create", protect, isAdmin, createUser); // Only authenticated users can create other users
router.get("/get", protect, getUsers); // Fetch all users with roles
router.put("/update/:userId", protect, isAdmin, updateUser);
router.put("/delete/:userId", protect, isAdmin, deleteUser);

module.exports = router;
