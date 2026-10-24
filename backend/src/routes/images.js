const express = require('express');
const multer = require('multer');
const path = require('path');

const { Image } = require('../models/Image');

const router = express.Router();

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    console.log(`GET IMAGES: ${res.json(images[0])}`);
    if (images) {
      return res.status(200).json({ images });
    } else {
      res.status(200).json({ message: 'No images found.' });
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ message: '❌ Failed to fetch images' });
  }
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const newImage = new Image({
      name: req.file.originalname,
      path: req.file.filename,
    });
    console.log(`IMAGES UPLOAD: new image=${newImage}`);
    await newImage.save();

    res.status(201).json({
      message: '✅ Image uploaded successfully!',
      image: newImage,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: '❌ Server error during upload' });
  }
});

router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
