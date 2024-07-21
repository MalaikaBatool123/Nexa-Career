const express = require('express');
const router = express.Router();
const { University, Eventroom,UniEvent } = require('../models');

router.get('/', async (req, res) => {
    const eventroom = await Eventroom.findAll({
      include: {
        model: UniEvent,
        as: 'unievent', 
        attributes: ['university_id'], 
      },
    });
  
    res.json(eventroom);

});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
      const eventroom = await Eventroom.findByPk(id);
      await eventroom.destroy();
      res.json({ success: true, message: 'Room deleted successfully' });
  
  });

  router.post('/', async (req, res) => {
    try {
      const { roomno, accessories, space,event_id } = req.body;
  
      // Create a new project
      const eventroom = await Eventroom.create({
        roomno,
        accessories,
        space,
        event_id,
        spaceleft:space,
      });
  
      // Respond with the created project
      res.status(201).json(eventroom);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const eventroomdata = await Eventroom.findByPk(id);
    res.json(eventroomdata);
  });

  router.put('/:id', async (req, res) => {
    try {
  
      const { id } = req.params;
    
      const eventroomdata = req.body;
    
      const existingRoom = await Eventroom.findByPk(id);
      await existingRoom.update(eventroomdata);
      return res.json({ message: 'Student updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ message: 'Failed to update student' });
    }
  });
module.exports = router;
