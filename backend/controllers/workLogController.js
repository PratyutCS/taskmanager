const WorkLog = require('../models/WorkLog');
const Task = require('../models/Task');

// @desc    Create a work log for a task
// @route   POST /api/worklog/:taskId
// @access  Private
const createWorkLog = async (req, res) => {
  const { taskId } = req.params;
  const { startTime, endTime, timeSpent, notes } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const newWorkLog = new WorkLog({
      task: taskId,
      user: req.user.id,
      startTime,
      endTime,
      timeSpent,
      notes,
    });

    const workLog = await newWorkLog.save();
    
    // Potentially update task progress or other fields here
    // For now, we'll just log the work

    req.io.emit('workLogCreated', workLog);

    res.json(workLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get work logs for a task
// @route   GET /api/worklog/:taskId
// @access  Private
const getWorkLogsForTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    
    // Check user
    if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
    }

    const workLogs = await WorkLog.find({ task: taskId }).sort({ createdDate: -1 });
    res.json(workLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createWorkLog,
  getWorkLogsForTask,
};
