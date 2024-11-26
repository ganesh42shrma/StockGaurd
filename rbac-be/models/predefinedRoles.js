const Role = require("./Role");

const initializeRoles = async () => {
  try {
    const predefinedRoles = [
      {
        name: "Admin",
        permissions: {
          maxPrice: 999999, // Admin role can set any maxPrice
        },
      },
      {
        name: "Category Manager",
        permissions: {
          maxPrice: 999999, // Category Manager role can set any maxPrice
        },
      },
      {
        name: "Price-Limited Manager",
        permissions: {
          maxPrice: 100000, // Price-Limited Manager role can only set maxPrice of 1000
        },
      },
      {
        name: "Viewer",
        permissions: {
          maxPrice: 0, // Viewer role, no price setting permission
        },
      },
    ];

    for (const role of predefinedRoles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create(role);
        console.log(`Role '${role.name}' created`);
      }
    }
  } catch (error) {
    console.log("Error initializing roles:", error);
  }
};

module.exports = { initializeRoles };
