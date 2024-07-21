const express = require('express');
const router = express.Router();
const { Signup } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');


// Define a salt round for bcrypt
const saltRounds = 10;
router.use(cookieParser());

router.post('/', async (req, res) => {
  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password.toString(), saltRounds);

    // Create a user object with hashed password
    const user = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
    };

    // Create a new user in the database
    const newUser = await Signup.create(user);

    // Send confirmation email
    sendConfirmationEmail(req.body.email, req.body.password);

    res.json(newUser);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists
    const user = await Signup.findOne({ where: {email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password.toString(), user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Determine the user's role (You need to have a role property in your user model)
    const role = user.role; // Replace 'role' with the actual property name for the user's role

    // Generate a JWT token with the user's ID and role
    const token = jwt.sign({ userId: user.id, role }, 'your_secret_key', {
      expiresIn: '1h', // Set the expiration time for the token
    });

    // Set the token as a cookie in the response
    res.cookie('token', token, { httpOnly: true });

    // You can also send the token and role in the response payload if needed
    res.json({ message: 'Login successful', token, role });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;