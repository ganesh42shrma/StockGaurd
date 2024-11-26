const bcrypt = require("bcrypt");

// Hardcoded password
const password = "password123";

// Function to hash the hardcoded password
const hashPassword = async () => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Logging the hashed password
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Exporting the hashPassword function to use in other files
module.exports = {
  hashPassword,
};
