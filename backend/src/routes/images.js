const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

const { Image } = require('../models/Image');

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function fileExists(path) {
  try {
    await fs.access(path);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.log(`fileExists: ${error}`);
    return false;
  }
  return true;
}

router.get('/', async (req, res) => {
  try {
    // console.log(`ENTER GET IMAGES: ${req}`);
    const images = await Image.find().sort({ createdAt: -1 });
    // console.log(`GET IMAGES: ${res}  img: ${images}`);
    if (images) {
      let imgList = [];
      for (const img of images) {
        // console.log(`IMAGE PATHS: img: ${uploadDir}/${img.path}`);
        imgList.push(`${uploadDir}/${img.path}`);
        if (!fileExists(`${uploadDir}/${img.path}`)) {
          var decodedImageData = Buffer.from(img.imageData, 'base64');
          await fs.writeFile(`${uploadDir}/${img.path}`, decodedImageData);
        }
      }
      return res.status(200).json({ imgList });
    } else {
      res.status(200).json({ message: 'No images found.' });
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ message: '❌ Failed to fetch images' });
  }
});

router.get('/uploads/:imgName', async (req, res) => {
  try {
    console.log(`ENTER GET single IMAGES ${req.params.imgName}`);
    const image = await Image.find({ path: req.params.imgName });
    // console.log(`GET IMAGES: ${res}  img: ${image}`);
    if (image) {
      if (!fileExists(`${uploadDir}/${image.path}`)) {
        var decodedImageData = Buffer.from(image.imageData, 'base64');
        await fs.writeFile(`${uploadDir}/${image.path}`, decodedImageData);
      }
      return res.status(200).json({ image });
    } else {
      res.status(200).json({ message: 'Image not found.' });
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ message: '❌ Failed to fetch image' });
  }
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const data = await fs.readFile(path.join(uploadDir, req.file.filename));
    // const imageData = serialize(data);
    const newImage = new Image({
      name: req.file.originalname,
      path: req.file.filename,
      imageData: data,
    });
    console.log(`IMAGES UPLOAD: new image=${newImage.path}`);
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
