const express = require('express');
const router = express.Router();
const { Interview,Slots } = require('../models');
const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (email,instruction,companyname,time) => {
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
        subject: 'Enter View Schedule',
        text: `Your interview has been scheduled with ${companyname} at ${time}!\n\nInterview Instructions: ${instruction}\n\nPlease make sure to attend the interview on time and prepare accordingly.`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

router.post('/', async (req, res) => {
    try{
      const Interviewdata = req.body;
      await Interview.create(Interviewdata);
      sendConfirmationEmail(req.body.email,req.body.instruction,req.body.companyname,req.body.slottime);
      res.json({ message: 'Student added successfully' });
    }
   
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add student' });
    }

   

});

router.get('/', async (req, res) => {
    const Interviewdata = await Interview.findAll({
      include: {
        model: Slots,
        as: 'Slots', 
        attributes: ['timeslot'], 
      },
    });
  
    res.json(Interviewdata);

});

router.get('/slots', async (req, res) => {
    const slots = await Slots.findAll();
  
    res.json(slots);

});

module.exports = router;