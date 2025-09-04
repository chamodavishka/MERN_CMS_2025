// File: controllers/mediaController.js

const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../utils/cloudinary");

// Controller for single file upload
const handleSingleMediaUpload = async (req, res) => {
  try {
    // Check if a file was received
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Upload the file to Cloudinary, passing its path and mimetype
    const result = await uploadMediaToCloudinary(req.file.path, req.file.mimetype);

    // Send a success response back to the frontend with the URL and public_id
    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type, // Send this back for easier deletion
      },
    });
  } catch (error) {
    console.error("Media Upload Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error during file upload." });
  }
};

// Controller for deleting a file
const handleMediaDelete = async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;

    if (!public_id) {
      return res.status(400).json({ success: false, message: "Public ID is required." });
    }

    // Call the delete utility
    await deleteMediaFromCloudinary(public_id, resource_type);

    res.status(200).json({ success: true, message: "Asset deleted successfully." });
  } catch (error) {
    console.error("Media Delete Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error during file deletion." });
  }
};


module.exports = { handleSingleMediaUpload, handleMediaDelete };