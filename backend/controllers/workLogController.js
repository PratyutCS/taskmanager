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

    // Create work log
    const workLog = new WorkLog({
      task: taskId,
      user: req.user._id,
      startTime,
      endTime,
      timeSpent,
      notes
    });

    const savedWorkLog = await workLog.save();

    // Update task total time
    task.totalTimeSpent = (task.totalTimeSpent || 0) + timeSpent;
    await task.save();

    // Emit event
    req.io.emit('workLogCreated', savedWorkLog);
    req.io.emit('taskUpdated', task);

    res.status(201).json(savedWorkLog);
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
