const express = require("express");
const { createRole, getRoles } = require("../controllers/roleController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/create", protect, isAdmin, createRole); // Only authenticated users can create roles
router.get("/get", protect, getRoles); // Fetch all roles

module.exports = router;
