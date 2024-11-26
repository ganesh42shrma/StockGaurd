const Inventory = require("../models/Inventory");
const Category = require("../models/Category");
const Role = require("../models/Role");
const { uploadToS3 } = require("../middleware/uploadtToS3");

const addInventory = async (req, res) => {
  const { name, category, price, stock, status } = req.body;
  const userRole = req.user.role.name;

  try {
    const categoryData = await Category.findById(category);
    if (!categoryData) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const userRoleData = await Role.findOne({ name: userRole });
    if (!userRoleData) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!categoryData.roles.includes(userRoleData._id)) {
      return res.status(403).json({
        message: `Role '${userRoleData.name}' does not have access to category '${categoryData.name}'`,
      });
    }

    if (
      userRoleData.permissions.maxPrice &&
      price > userRoleData.permissions.maxPrice
    ) {
      return res
        .status(403)
        .json({ message: `Price exceeds the maximum allowed for your role` });
    }

    // Upload images to S3
    const imageUrls = [];
    for (const file of req.files) {
      const imageUrl = await uploadToS3(file);
      imageUrls.push(imageUrl);
    }

    const newItem = new Inventory({
      name,
      category: categoryData._id,
      price,
      stock,
      status,
      images: imageUrls,
    });
    await newItem.save();

    res
      .status(201)
      .json({ message: "Inventory item created successfully", newItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating inventory item", error });
  }
};

const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, status, description } = req.body;

  try {
    const inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Upload new images to S3
    const newImages = [];
    if (req.files) {
      for (const file of req.files) {
        const imageUrl = await uploadToS3(file);
        newImages.push(imageUrl);
      }
    }

    inventoryItem.name = name || inventoryItem.name;
    inventoryItem.category = category || inventoryItem.category;
    inventoryItem.price = price || inventoryItem.price;
    inventoryItem.stock = stock || inventoryItem.stock;
    inventoryItem.status = status || inventoryItem.status;
    inventoryItem.images = [...inventoryItem.images, ...newImages];
    inventoryItem.description = description || inventoryItem.description;

    await inventoryItem.save();

    res
      .status(200)
      .json({ message: "Inventory item updated successfully", inventoryItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory item", error });
  }
};

const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    const inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // TODO: Optionally implement S3 image deletion if required

    await Inventory.findByIdAndDelete(id);

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory item", error });
  }
};

const getInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || ""; // e.g., 'name', '-price'

    const skip = (page - 1) * limit;

    const filter = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive search by name
      : {};

    const sortOption = sort
      ? { [sort.replace("-", "")]: sort.startsWith("-") ? -1 : 1 }
      : {};

    const inventory = await Inventory.find(filter)
      .populate("category", "name description")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalCount = await Inventory.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      totalCount,
      totalPages,
      currentPage: page,
      inventory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
};

module.exports = {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
};
