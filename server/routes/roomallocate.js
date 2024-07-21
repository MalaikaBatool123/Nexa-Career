const express = require('express');
const router = express.Router();
const { Roomallocation,Eventregister,UniEvent,University,Eventroom,Usher } = require("../models");

router.post('/', async (req, res) => {
    try{
      const eventroom = req.body;
      if (eventroom.usher_id === null || eventroom.usher_id === undefined || eventroom.usher_id === 0) {
        eventroom.usher_id = null;
    }
      await Roomallocation.create(eventroom);
    //   sendConfirmationEmail(req.body.email, req.body.password);
      res.json({ message: 'Student added successfully' });
    }
   
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add student' });
    }
});

router.get('/', async (req, res) => {
  const roomallocateusher = await Roomallocation.findAll({
    include: [
      {
        model: Eventregister,
        as: 'Eventregister',
        include: [
          {
            model: UniEvent,
            as: 'UniEvent',
            include: {
              model: University,
              as: 'university',
              attributes: ['name', 'address', 'city', 'logo'],
            },
            attributes: ['date'],
          },
        ],
        attributes: ['company_id'], // Include the company_id column from Eventregister
      },
      {
        model: Eventroom,
        as: 'Eventroom',
        attributes: ['roomno'],
      },
      {
        model: Usher,
        as: 'Usher',
        attributes: ['firstname','lastname','regno','email','contact'],
      }
    ]
    
  });

  res.json(roomallocateusher);
});

module.exports = router;