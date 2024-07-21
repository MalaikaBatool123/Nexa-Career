const express = require('express');
const multer = require('multer');
const path = require('path');
const { File, Projects } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const logo = req.file.path;
  
      // Save the file path to the database
      const newFile = await File.create({
        image: logo,
        // Other relevant fields in your model
      });
  
      res.status(200).json({ message: 'File uploaded successfully', fileId: newFile.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
