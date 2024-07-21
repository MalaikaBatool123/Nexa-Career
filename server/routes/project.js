const express = require('express');
const router = express.Router();
const { University, Projects } = require('../models');

router.get('/', async (req, res) => {
    const Projectsdata = await Projects.findAll({
      include: {
        model: University,
        as: 'university', 
        attributes: ['name'], 
      },
    });
  
    res.json(Projectsdata);

});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
      const existingProject = await Projects.findByPk(id);
      await existingProject.destroy();
      res.json({ success: true, message: 'Project deleted successfully' });
  
  });


  router.post('/', async (req, res) => {
    try {
      const { name, description,domain, universityId } = req.body;
  
      // Check if the university exists
      const university = await University.findByPk(universityId);
      if (!university) {
        return res.status(400).json({ error: 'University not found' });
      }
  
      // Create a new project
      const newProject = await Projects.create({
        name,
        description,
        domain,
        university_id: universityId,
      });
  
      // Respond with the created project
      res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const projectdata = await Projects.findByPk(id);
    res.json(projectdata);
  });

  
  router.put('/:id', async (req, res) => {
    try {
  
      const { id } = req.params;
    
      const updatedData = req.body;
    
      const existingprojects = await Projects.findByPk(id);
      await existingprojects.update(updatedData);
      return res.json({ message: 'Project updated successfully' });
    } catch (error) {
      console.error('Error updating Project:', error);
      return res.status(500).json({ message: 'Failed to update Project' });
    }
  });
  
module.exports = router;
