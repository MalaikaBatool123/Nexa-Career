const express = require('express');
const router = express.Router();
const { UniEvent,Company,University } = require("../models");
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

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

  router.post("/", upload.single('logo'), async (req, res) => {
    try {
      
      const logo = req.file.path;
      const unievent = req.body;
      unievent.logo = logo;
      await UniEvent.create(unievent);
      const emailsFromDB = await Company.findAll({
        attributes: ['email', 'domain'], // Assuming email and domain are stored in these fields
      });
      const emails = emailsFromDB.map(data => data.email + data.domain);
      await sendConfirmationEmail(emails,req.body.date, req.body.starttime, req.body.endtime,req.body.description);
      res.json({ message: 'Event created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });

  const sendConfirmationEmail = async (email, date, starttime, endtime, description) => {
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
        text: `Hello!\n\nWe are inviting you to an open house at our University\n\nDate:${date}\n\nStarting Time:${starttime}\n\nEnd Time:${endtime}\n\nDescription:${description}`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  router.get('/', async (req, res) => {
    const eventdata = await UniEvent.findAll({
      include: {
        model: University,
        as: 'university', 
        attributes: ['name','address','city','logo'], 
      },
    });
  
    res.json(eventdata);

});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
    const event = await UniEvent.findByPk(id);
    await event.destroy();
    res.json({ success: true, message: 'Project deleted successfully' });

});

router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const eventdata = await UniEvent.findByPk(id);
  res.json(eventdata);
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
      const existingevent = await UniEvent.findByPk(id);
      logoPath = existingevent.logo; // Assuming 'logo' is the field name in the database
      // If 'logo' is not stored in the database, you can assign a default logo path here
    }

    const updatedData = { ...req.body, logo: logoPath };

    // Update the company data in the database
    const existingevent = await UniEvent.findByPk(id);
    await existingevent.update(updatedData);
    const emailsFromDB = await Company.findAll({
      attributes: ['email', 'domain'], // Assuming email and domain are stored in these fields
    });
    const emails = emailsFromDB.map(data => data.email + data.domain);
    await sendConfirmationEmailUpdate(emails,req.body.date, req.body.starttime, req.body.endtime,req.body.description);
    return res.json({ message: 'University updated successfully' });
  } catch (error) {
    console.error('Error updating University:', error);
    return res.status(500).json({ message: 'Failed to update University' });
  }
});

const sendConfirmationEmailUpdate = async (email, date, starttime, endtime, description) => {
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
      text: `Hello!\n\nWe are inviting you to an open house at our University(Updated Schedule)\n\nDate:${date}\n\nStarting Time:${starttime}\n\nEnd Time:${endtime}\n\nDescription:${description}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

const refreshDatabase = async () => {
  // Implement your logic to refresh the database (e.g., update specific data, delete old entries)
  console.log('Database refreshed');
};

router.get('/latest', async (req, res) => {
  try {
    await refreshDatabase();
    const latestEvent = await UniEvent.findOne({
      order: [['createdAt', 'DESC']], // Get the latest event based on creation time
      attributes: ['id'], // Select only the id field
    });

    res.json({ latestEventId: latestEvent.id });
  } catch (error) {
    console.error('Error fetching latest event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  module.exports = router;