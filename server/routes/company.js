const express = require('express');
const router = express.Router();
const { Company } = require("../models");
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
    const comdata = await Company.findAll();
    res.json(comdata);
});
router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const comdata = await Company.findByPk(id);
  res.json(comdata);
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
      const existingcom = await Company.findByPk(id);
      logoPath = existingcom.logo; // Assuming 'logo' is the field name in the database
      // If 'logo' is not stored in the database, you can assign a default logo path here
    }

    const updatedData = { ...req.body, logo: logoPath };
    // Update the company data in the database
    const existingCompany = await Company.findByPk(id);
    await existingCompany.update(updatedData);
    return res.json({ message: 'Company updated successfully' });
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({ message: 'Failed to update company' });
  }
});

router.post("/", upload.single('logo'), async (req, res) => {
  try {
    
    // Access the uploaded file using req.file
    const logo = req.file.path;
  // Generate a random password
    const password = generateRandomPassword();
    console.log(password)
    const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
    // Save the file path to the database
    const com = req.body;
    com.logo = logo;
    com.password = hashedPassword;
    await Company.create(com);
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
        user: 'malikfaizkhan1@gmail.com',
        pass: 'ptuhdyielprlnjpx',
      },
    });

    // Create an email with the user's email and password
    const mailOptions = {
      from: 'malikfaizkhan1@gmail.com',
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
      const user = await Company.findOne({
        where: { email, domain }
      });

      const passwordMatch = await bcrypt.compare(password.toString(), user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const companyId = user.id;
    // Generate a JWT token with the user's ID and role
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', {
      expiresIn: '1h', // Set the expiration time for the token
    });

    // Set the token as a cookie in the response
    res.cookie('token', token, { httpOnly: true });

    // You can also send the token and role in the response payload if needed
    // Send the university ID along with the success message
    res.status(200).json({ message: "Login successful", token,companyId });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
      const existingCompany = await Company.findByPk(id);
      await existingCompany.destroy();
      res.json({ success: true, message: 'Company deleted successfully' });
    
    
  });

  
module.exports = router;