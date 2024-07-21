const express = require('express');
const router = express.Router();
const { University, Usher } = require('../models');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

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
      text: `You are sucessfully registered as a Usher in Nexa Career Platform!\n\nYour email: ${email}\nYour password: ${password}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
router.get('/', async (req, res) => {
    const UsherData = await Usher.findAll({
      include: {
        model: University,
        as: 'university', 
        attributes: ['name'], 
      },
    });
  
    res.json(UsherData);
  });


router.post('/', async (req, res) => {
        try{
          const UsherData = req.body;
          const password = generateRandomPassword();
          UsherData.password = password;
          await Usher.create(UsherData);
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
      const existingUsher = await Usher.findByPk(id);
      await existingUsher.destroy();
      res.json({ success: true, message: 'Usher deleted successfully' });
    
    
  });

  router.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const usherdata = await Usher.findByPk(id);
    res.json(usherdata);
  });

  router.put('/:id', async (req, res) => {
    try {
  
      const { id } = req.params;
    
      const updatedData = req.body;
    
      const existingUsher = await Usher.findByPk(id);
      await existingUsher.update(updatedData);
      return res.json({ message: 'Usher updated successfully' });
    } catch (error) {
      console.error('Error updating Usher:', error);
      return res.status(500).json({ message: 'Failed to update Usher' });
    }
  });
module.exports = router;
