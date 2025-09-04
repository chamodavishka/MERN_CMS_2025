// File: routes/mediaRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // Import the multer middleware
const { handleSingleMediaUpload, handleMediaDelete } = require('../controllers/mediaController');

// Route for single file upload
// The name 'file' must match the key used in the frontend FormData
router.post('/upload', upload.single('file'), handleSingleMediaUpload);

// Route for bulk file upload (optional, but good to have)
// router.post('/bulk-upload', upload.array('files', 10), handleBulkMediaUpload);

// Route for deleting a media file
router.delete('/delete', handleMediaDelete);


module.exports = router;