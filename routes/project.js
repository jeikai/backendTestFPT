const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');

// GET all projects
router.get('/', ProjectController.getAllProjects);

// GET project by ID
router.get('/:id', ProjectController.getProjectById);

// POST create new project
router.post('/', ProjectController.createProject);

// PUT update project
router.put('/:id', ProjectController.updateProject);

// DELETE project
router.delete('/:id', ProjectController.deleteProject);

module.exports = router;
