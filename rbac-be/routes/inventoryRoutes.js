const express = require("express");
const {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multer"); // Import your multer memoryStorage config

const router = express.Router();

// Routes
router.get("/get", protect, getInventory);
router.post("/add", protect, upload.array("images", 3), addInventory); // Allow up to 3 images
router.put("/update/:id", protect, upload.array("images", 3), updateInventory);
router.delete("/delete/:id", protect, deleteInventory);

module.exports = router;
