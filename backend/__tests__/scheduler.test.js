const { setup, teardown } = require('./setup');
const Task = require('../models/Task');
const User = require('../models/User');
const { startAgingScheduler } = require('../services/scheduler');
const cron = require('node-cron');

jest.mock('node-cron', () => {
    return {
      schedule: jest.fn(),
    };
});

const io = {
    emit: jest.fn(),
};

describe('Aging Scheduler', () => {
    let user;
  
    beforeAll(async () => {
      await setup();
      user = new User({ name: 'Test User', email: 'test@example.com', password: 'password' });
      await user.save();
    });

    beforeEach(() => {
        startAgingScheduler(io);
    });
  
    afterAll(async () => {
      await teardown();
    });

    afterEach(async () => {
        await Task.deleteMany({});
        jest.clearAllMocks();
    });
  
    it('should increase the priority of a task that has not been updated recently', async () => {
      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 2 days ago
      const task = new Task({ 
          title: 'Old Task', 
          user: user._id, 
          priority: 50, 
          lastProgressUpdate: oldDate 
        });
      await task.save();
  
      // Manually trigger the scheduled function
      const scheduledFunction = cron.schedule.mock.calls[0][1];
      await scheduledFunction();

      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.priority).toBe(51); // 50 + AGING_PRIORITY_BUMP (1)
      expect(io.emit).toHaveBeenCalledWith('tasksAged', expect.any(Array));
    });

    it('should not age a pinned task', async () => {
        const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 2 days ago
        const task = new Task({ 
            title: 'Pinned Task', 
            user: user._id, 
            priority: 50, 
            lastProgressUpdate: oldDate,
            pinned: true
          });
        await task.save();
    
        const scheduledFunction = cron.schedule.mock.calls[0][1];
        await scheduledFunction();
  
        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.priority).toBe(50);
        expect(io.emit).not.toHaveBeenCalled();
    });

    it('should not age a task with priority 100', async () => {
        const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 2 days ago
        const task = new Task({ 
            title: 'Max Priority Task', 
            user: user._id, 
            priority: 100, 
            lastProgressUpdate: oldDate,
          });
        await task.save();
    
        const scheduledFunction = cron.schedule.mock.calls[0][1];
        await scheduledFunction();
  
        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.priority).toBe(100);
        expect(io.emit).not.toHaveBeenCalled();
    });
});
