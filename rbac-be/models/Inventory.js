const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "Available",
      "Unavailable",
      "Selling Quickly",
      "Only Few Left",
      "Pre-Order",
      "Coming Soon",
      "Discontinued",
      "Reserved",
      "Backordered",
      "Damaged",
    ],
  },
  images: { type: [String] },
  description: { type: String },
});

module.exports = mongoose.model("Inventory", inventorySchema);
