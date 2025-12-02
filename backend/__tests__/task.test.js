const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { setup, teardown } = require('./setup');
const taskRoutes = require('../routes/taskRoutes');
const User = require('../models/User');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

const app = express();
app.use(express.json());

let user;
let token;
const io = {
    emit: jest.fn(),
};

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/tasks', protect, taskRoutes);


describe('Task API', () => {
  beforeAll(async () => {
    await setup();
    user = new User({ name: 'Test User', email: 'test@example.com', password: 'password' });
    await user.save();
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await teardown();
  });

  afterEach(async () => {
    await Task.deleteMany({});
    jest.clearAllMocks();
  });

  describe('PUT /api/tasks/:id', () => {
    it('should set a task to "working"', async () => {
        const task = new Task({ title: 'Task 1', user: user._id, status: 'idle' });
        await task.save();

        await request(app)
            .put(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'working' });

        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.status).toBe('working');
    });

    it('should only allow one task to be in the "working" state at a time', async () => {
      // Create two tasks
      const task1 = new Task({ title: 'Task 1', user: user._id, status: 'working' });
      await task1.save();
      const task2 = new Task({ title: 'Task 2', user: user._id, status: 'idle' });
      await task2.save();

      // Now, set task2 to "working"
      await request(app)
        .put(`/api/tasks/${task2._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'working' });

      // Check that task2 is "working"
      const updatedTask2 = await Task.findById(task2._id);
      expect(updatedTask2.status).toBe('working');

      // Check that task1 has been set back to "idle"
      const updatedTask1 = await Task.findById(task1._id);
      expect(updatedTask1.status).toBe('idle');
    });

    it('should not allow finishing a task without a work log', async () => {
        const task = new Task({ title: 'Task', user: user._id, status: 'working', workingStartTime: new Date() });
        await task.save();

        const response = await request(app)
            .put(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ progress: 100 });
        
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Cannot finish a task without at least one work log entry since it was set to working.');
    });
  });
});
