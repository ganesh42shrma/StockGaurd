const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

//configure dotenv
dotenv.config();

// Configure S3 Client
const s3Client = new S3Client({
  region: "eu-north-1", // Replace with your bucket's region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS Access Key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS Secret Key
  },
});

module.exports = s3Client;
