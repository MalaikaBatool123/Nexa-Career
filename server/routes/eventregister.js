const express = require('express');
const router = express.Router();
const { Eventregister,UniEvent } = require("../models");

router.post('/', async (req, res) => {
    try{
      const eventreg = req.body;
      await Eventregister.create(eventreg);
    //   sendConfirmationEmail(req.body.email, req.body.password);
      res.json({ message: 'Student added successfully' });
    }
   
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add student' });
    }
});

router.get('/latest', async (req, res) => {
  try {
   
    const latestEventreg = await Eventregister.findOne({
      order: [['createdAt', 'DESC']], // Get the latest event based on creation time
      attributes: ['id'], // Select only the id field
    });

    res.json({ latestEventRegId: latestEventreg.id });
  } catch (error) {
    console.error('Error fetching latest event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/', async (req, res) => {
  const roomallocateusher = await Eventregister.findAll({
    include: {
      model: UniEvent,
      as: 'UniEvent', 
      attributes: ['date'], 
    },
    
  });

  res.json(roomallocateusher);
});
module.exports = router;