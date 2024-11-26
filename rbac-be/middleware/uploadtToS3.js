const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/aws-config");
const path = require("path");

// Region as used in S3Client initialization
const s3Region = "eu-north-1"; // Hardcode your region here

const uploadToS3 = async (file) => {
  const fileName = `${Date.now()}-${path.basename(file.originalname)}`;

  const params = {
    Bucket: "ganesh42inventory-images", // Replace with your S3 bucket name
    Key: fileName, // The file name in the bucket
    Body: file.buffer, // The file content
    ContentType: file.mimetype, // Ensure the file has the correct content type
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command); // Sends the file to S3

    // Construct the file URL using the hardcoded region
    const fileUrl = `https://${params.Bucket}.s3.${s3Region}.amazonaws.com/${params.Key}`;
    console.log("Generated S3 URL:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

module.exports = { uploadToS3 };
