const express = require('express');
const router = express.Router();
const { University } = require("../models");
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const saltRounds = 10;
router.use(cookieParser());

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
router.get("/",async (req,res)=>{
    const unidata = await University.findAll();
    res.json(unidata);
});
router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const unidata = await University.findByPk(id);
  res.json(unidata);
});
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    let logoPath = null;

    // Check if a file was uploaded
    if (req.file) {
      logoPath = req.file.path; // Access the uploaded file path
    } else {
      // If no file was uploaded, use the previous logo path or a default path
      const existinguni = await University.findByPk(id);
      logoPath = existinguni.logo; // Assuming 'logo' is the field name in the database
      // If 'logo' is not stored in the database, you can assign a default logo path here
    }

    const updatedData = { ...req.body, logo: logoPath };

    // Update the company data in the database
    const existinguni = await University.findByPk(id);
    await existinguni.update(updatedData);
    return res.json({ message: 'University updated successfully' });
  } catch (error) {
    console.error('Error updating University:', error);
    return res.status(500).json({ message: 'Failed to update University' });
  }
});

router.post("/", upload.single('logo'), async (req, res) => {
  
  try {
    
    // Access the uploaded file using req.file
    const logo = req.file.path;
  // Generate a random password
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
    // Save the file path to the database
    const uni = req.body;
    uni.logo = logo;
    uni.password = hashedPassword;
    await University.create(uni);
    sendConfirmationEmail(req.body.email+req.body.domain, password);
    res.json({ message: 'University created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

const sendConfirmationEmail = async (email, password) => {
  try {
    // Set up a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malaikabatool03@gmail.com',
        pass: 'wzpfecgmbjvjljbi',
      },
    });

    // Create an email with the user's email and password
    const mailOptions = {
      from: 'malaikabatool03@gmail.com',
      to: email,
      subject: 'Confirmation Email',
      text: `You are sucessfully registered in Nexa Career Platform!\n\nYour email: ${email}\nYour password: ${password}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

router.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  try {
      const [email, domai] = mail.split('@');
      const domain='@'+domai;
      // Find user by username and domain
      const user = await University.findOne({
        where: { email, domain }
      });

      const passwordMatch = await bcrypt.compare(password.toString(), user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
      const universityId = user.id;
    // Generate a JWT token with the user's ID and role
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', {
      expiresIn: '1h', // Set the expiration time for the token
    });

    // Set the token as a cookie in the response
    res.cookie('token', token, { httpOnly: true });

    // You can also send the token and role in the response payload if needed
    // Send the university ID along with the success message
    res.status(200).json({ message: "Login successful", token,universityId });
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
      const existingUniversity = await University.findByPk(id);
      await existingUniversity.destroy();
      res.json({ success: true, message: 'University deleted successfully' });
    
    
  });

  router.put("/password", async (req, res) => {
    const universityId = universityid;
    const { newPassword } = req.body;
  
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      // Update the university's password in the database
      const university = await University.findById(universityId);
      if (!university) {
        return res.status(404).json({ message: 'University not found' });
      }
      
      university.password = hashedPassword;
      await university.save();
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update password' });
    }
  });
module.exports = router;