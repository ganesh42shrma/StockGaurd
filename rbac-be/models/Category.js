const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }], // Reference to the Role model
});

module.exports = mongoose.model("Category", categorySchema);
