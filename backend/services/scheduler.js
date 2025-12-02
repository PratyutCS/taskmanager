const cron = require('node-cron');
const Task = require('../models/Task');

// Default configuration (can be overridden by environment variables)
const AGING_THRESHOLD_HOURS = process.env.AGING_THRESHOLD_HOURS || 24;
const AGING_PRIORITY_BUMP = process.env.AGING_PRIORITY_BUMP || 1;

const startAgingScheduler = (io) => {
  // Schedule a job to run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running aging scheduler...');
    try {
      const threshold = new Date(Date.now() - AGING_THRESHOLD_HOURS * 60 * 60 * 1000);

      const tasksToAge = await Task.find({
        status: { $in: ['idle', 'working'] },
        pinned: false,
        priority: { $lt: 100 },
        lastProgressUpdate: { $lt: threshold },
      });

      if (tasksToAge.length > 0) {
        console.log(`Aging ${tasksToAge.length} tasks...`);

        const bulkOps = tasksToAge.map(task => {
          const newPriority = Math.min(100, task.priority + parseInt(AGING_PRIORITY_BUMP));
          return {
            updateOne: {
              filter: { _id: task._id },
              update: { 
                $set: { 
                  priority: newPriority,
                  lastProgressUpdate: Date.now() // Reset the timer after bumping priority
                } 
              },
            },
          };
        });

        await Task.bulkWrite(bulkOps);

        // Fetch updated tasks to broadcast
        const updatedTaskIds = tasksToAge.map(t => t._id);
        const updatedTasks = await Task.find({ _id: { $in: updatedTaskIds } });
        
        // It's better to emit a single event with all updated tasks
        io.emit('tasksAged', updatedTasks);
      } else {
        console.log('No tasks to age.');
      }
    } catch (error) {
      console.error('Error in aging scheduler:', error);
    }
  });
};

module.exports = { startAgingScheduler };
