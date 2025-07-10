const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const projectRoutes = require('../routes/project');
const Project = require('../models/project');

jest.mock('../models/project');

const app = express();
app.use(bodyParser.json());
app.use('/api/project', projectRoutes);

describe('Project API - /api/project', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/project - should return all projects', async () => {
    const mockProjects = [{ id: 1, name: 'Fun Bug' }];
    Project.getAll.mockResolvedValue(mockProjects);

    const res = await request(app).get('/api/project');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockProjects);
  });

  test('GET /api/project/:id - should return a project by ID', async () => {
    const mockProject = { id: 1, name: 'Fun Bug' };
    Project.getById.mockResolvedValue(mockProject);

    const res = await request(app).get('/api/project/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockProject);
  });

  test('GET /api/project/:id - invalid ID', async () => {
    const res = await request(app).get('/api/project/abc');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid project ID');
  });

  test('POST /api/project - should create a project', async () => {
    const newProject = { name: 'New Project' };
    const createdProject = { id: 2, ...newProject };

    Project.create.mockResolvedValue(createdProject);

    const res = await request(app).post('/api/project').send(newProject);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(createdProject);
  });

  test('PUT /api/project/:id - should update a project', async () => {
    Project.update.mockResolvedValue(true);

    const res = await request(app).put('/api/project/1').send({ name: 'Updated Project' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Project updated successfully');
  });

  test('DELETE /api/project/:id - should delete a project', async () => {
    Project.delete.mockResolvedValue(true);

    const res = await request(app).delete('/api/project/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Project deleted successfully');
  });

  test('DELETE /api/project/:id - not found', async () => {
    Project.delete.mockResolvedValue(false);

    const res = await request(app).delete('/api/project/999');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Project not found');
  });
});
