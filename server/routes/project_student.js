const express = require('express');
const router = express.Router();
const { Projects, Student, Project_student } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { studentId, projectId} = req.body;

    // Check if the project exists
    const project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ error: 'Project not found' });
    }

    // Check if the student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    // Create a new project student
    const newProjectStudent = await Project_student.create({
      student_id: studentId,
      project_id: projectId,
    });

    // Respond with the created project student
    res.status(201).json(newProjectStudent);
  } catch (error) {
    console.error('Error creating project student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', async (req, res) => {
  const Projectsdata = await Project_student.findAll({
    include: [
      
      {
        model: Student,
        as: 'student', 
        attributes: ['firstname','lastname','regno','domain','gender','email','university_id'], 
      },
      {
        model: Projects,
        as: 'project', 
        attributes: ['name','description','domain','university_id'], 
      },
    ],
  });

  res.json(Projectsdata);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
    const existingProject = await Project_student.findByPk(id);
    await existingProject.destroy();
    res.json({ success: true, message: 'Student deleted successfully' });

});

router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const projectdata = await Project_student.findByPk(id);
  res.json(projectdata);
});

module.exports = router;
