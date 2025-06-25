const Project = require('../models/project');

class ProjectController {
  static async getAllProjects(req, res) {
    try {
      const projects = await Project.getAll();
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving projects', error: error.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const projectId = parseInt(req.params.id, 10);
      if (isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid project ID' });
      }

      const project = await Project.getById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.status(200).json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving project', error: error.message });
    }
  }

  static async createProject(req, res) {
    try {
      const data = req.body;
      const createdProject = await Project.create(data);
      res.status(201).json({ success: true, data: createdProject });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating project', error: error.message });
    }
  }

  static async updateProject(req, res) {
    try {
      const projectId = parseInt(req.params.id, 10);
      if (isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid project ID' });
      }

      const updated = await Project.update(projectId, req.body);

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Project not found or no changes made' });
      }

      res.status(200).json({ success: true, message: 'Project updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
    }
  }

  static async deleteProject(req, res) {
    try {
      const projectId = parseInt(req.params.id, 10);
      if (isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid project ID' });
      }

      const deleted = await Project.delete(projectId);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
    }
  }
}

module.exports = ProjectController;
