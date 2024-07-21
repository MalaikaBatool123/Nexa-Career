const express = require('express');
const router = express.Router();
const { University, Student } = require('../models');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Route handler to delete PDF files from the "cvs" folder
router.post('/cvdelete', async (req, res) => {
  try {
    // Path to the "cvs" folder
    const cvsFolderPath = 'F:\\FYP\\FYP-N\\FYP\\FYP-N\\frontend\\public\\cvs';

    // Delete all PDF files from the "cvs" folder
    fs.readdir(cvsFolderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        res.status(500).json({ message: 'Failed to delete PDF files' });
        return;
      }

      files.forEach(file => {
        if (file.endsWith('.pdf')) {
          fs.unlink(path.join(cvsFolderPath, file), err => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('Deleted file:', file);
            }
          });
        }
      });

      res.json({ message: 'PDF files deleted successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to delete PDF files' });
  }
});

router.get('/cvlist', async (req, res) => {
  try {
    const cvsFolderPath = 'F:\\FYP\\FYP-N\\FYP\\FYP-N\\frontend\\public\\cvs'; // Path to the "cvs" folder
    const pdfFiles = [];

    // Read the files in the "cvs" folder
    fs.readdir(cvsFolderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return res.status(500).json({ message: 'Failed to read PDF files' });
      }

      // Filter PDF files
      files.forEach((file) => {
        if (file.toLowerCase().endsWith('.pdf')) {
          pdfFiles.push({ pdfName: file, pdfFilename: file });
        }
      });

      res.json(pdfFiles); // Send the list of PDF files
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch PDF files' });
  }
});

module.exports = router;
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

const generateRandomPassword = () => {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=<>,.?/][{}";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
const sendConfirmationEmail = async (email, password) => {
  try {
    // Set up a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malikfaizkhan1@gmail.com',
        pass: 'ptuhdyielprlnjpx',
      },
    });

    // Create an email with the user's email and password
    const mailOptions = {
      from: 'malikfaizkhan1@gmail.com',
      to: email,
      subject: 'Confirmation Email',
      text: `You are sucessfully registered as a Student in Nexa Career Platform!\n\nYour email: ${email}\nYour password: ${password}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
router.get('/', async (req, res) => {
    const studentData = await Student.findAll({
      include: {
        model: University,
        as: 'university', 
        attributes: ['name'], 
      },
    });
  
    res.json(studentData);
  });


router.post('/', async (req, res) => {
        try{
          const studentData = req.body;
          const password = generateRandomPassword();
          studentData.password = password;
          await Student.create(studentData);
          sendConfirmationEmail(req.body.email, req.body.password);
          res.json({ message: 'Student added successfully' });
        }
       
        catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to add student' });
        }

       
    
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
      const existingStudent = await Student.findByPk(id);
      await existingStudent.destroy();
      res.json({ success: true, message: 'Student deleted successfully' });
    
  });

router.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const stddata = await Student.findByPk(id);
    res.json(stddata);
  });

  router.put('/:id', async (req, res) => {
    try {
  
      const { id } = req.params;
    
      const updatedData = req.body;
    
      const existingStudent = await Student.findByPk(id);
      await existingStudent.update(updatedData);
      return res.json({ message: 'Student updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ message: 'Failed to update student' });
    }
  });
module.exports = router;
