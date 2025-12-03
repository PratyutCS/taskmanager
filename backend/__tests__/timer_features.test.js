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

describe('Timer Features', () => {
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

    it('should allow updating workingStartTime (Reset Timer)', async () => {
        const task = new Task({ title: 'Timer Task', user: user._id, status: 'working', workingStartTime: new Date(Date.now() - 10000) });
        await task.save();

        const newStartTime = new Date();
        const res = await request(app)
            .put(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ workingStartTime: newStartTime });

        expect(res.status).toBe(200);
        const updatedTask = await Task.findById(task._id);
        // Allow for small time difference due to execution time
        expect(new Date(updatedTask.workingStartTime).getTime()).toBeCloseTo(newStartTime.getTime(), -2);
    });

    it('should allow updating totalTimeSpent (Edit Total Time)', async () => {
        const task = new Task({ title: 'Time Task', user: user._id, totalTimeSpent: 10 });
        await task.save();

        const newTotalTime = 25;
        const res = await request(app)
            .put(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ totalTimeSpent: newTotalTime });

        expect(res.status).toBe(200);
        expect(res.body.totalTimeSpent).toBe(newTotalTime);

        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.totalTimeSpent).toBe(newTotalTime);
    });
});
