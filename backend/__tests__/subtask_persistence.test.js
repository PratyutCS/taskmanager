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

describe('Subtask Persistence', () => {
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

    it('should create a task with subtasks', async () => {
        const subtasks = [
            { title: 'Subtask 1', completed: false },
            { title: 'Subtask 2', completed: true }
        ];

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Task with Subtasks',
                subtasks
            });

        expect(res.status).toBe(200);
        expect(res.body.subtasks).toHaveLength(2);
        expect(res.body.subtasks[0].title).toBe('Subtask 1');
        expect(res.body.subtasks[1].completed).toBe(true);

        const savedTask = await Task.findById(res.body._id);
        expect(savedTask.subtasks).toHaveLength(2);
    });

    it('should update a task with new subtasks', async () => {
        const task = new Task({ title: 'Original Task', user: user._id });
        await task.save();

        const subtasks = [
            { title: 'New Subtask', completed: false }
        ];

        const res = await request(app)
            .put(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Task',
                subtasks
            });

        expect(res.status).toBe(200);
        expect(res.body.subtasks).toHaveLength(1);
        expect(res.body.subtasks[0].title).toBe('New Subtask');

        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.subtasks).toHaveLength(1);
        expect(updatedTask.subtasks[0].title).toBe('New Subtask');
    });
});
