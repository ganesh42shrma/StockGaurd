const express = require("express");
const {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoriesForUser,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

// Get all categories (no permission check needed, public endpoint)
router.get("/get", protect, getAllCategories);

router.post("/add", protect, isAdmin, addCategory);

router.put("/update/:id", protect, isAdmin, updateCategory);

router.delete("/delete/:id", protect, isAdmin, deleteCategory);

router.get("/getforuser", protect, getCategoriesForUser);

module.exports = router;
