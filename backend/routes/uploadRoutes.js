const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/uploadMiddleware');
const { uploadImagenGenerica } = require('../app/controllers/uploadController');

// POST /upload/:tipo/:id
router.post('/:tipo/:id', upload.single('imagen'), uploadImagenGenerica);

module.exports = router;
