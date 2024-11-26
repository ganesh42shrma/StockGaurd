const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: {
    maxPrice: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Role", roleSchema);
