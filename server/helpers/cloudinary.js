// File: utils/cloudinary.js

const cloudinary = require("cloudinary").v2;
const fs = require('fs');

// Configure with your .env data
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary.
 * If the file is a PDF, it's made public for previewing.
 * Other files (like videos) remain private by default.
 * @param {string} filePath - The local path to the file.
 * @param {string} fileMimetype - The MIME type of the file (e.g., 'application/pdf', 'video/mp4').
 */
const uploadMediaToCloudinary = async (filePath, fileMimetype) => {
  try {
    // Default options for all uploads
    let options = {
      resource_type: "auto",
    };

    // If the uploaded file is a PDF, we change the options
    // to make it public so that Google Viewer can access it.
    if (fileMimetype === 'application/pdf') {
      options = {
        resource_type: "image", // Cloudinary handles PDFs well under 'image' type for public access
        access_mode: "public",
      };
    }

    // Now, upload with the determined options
    const result = await cloudinary.uploader.upload(filePath, options);

    // After a successful upload, delete the temporary file from the server
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // If an error occurs, still try to delete the temporary file
    if (filePath) {
      fs.unlinkSync(filePath);
    }
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} publicId - The public_id of the file to delete.
 * @param {string} resourceType - The type of resource ('image', 'video', 'raw').
 */
const deleteMediaFromCloudinary = async (publicId, resourceType = 'auto') => {
  try {
    // resource_type must be specified for deletion of non-image files
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete asset from Cloudinary");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };