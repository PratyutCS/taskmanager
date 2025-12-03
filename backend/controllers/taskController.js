const Task = require('../models/Task');
const User = require('../models/User');
const WorkLog = require('../models/WorkLog');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ order: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const {
    title,
    description,
    dueDate,
    estimatedTime,
    priority,
    subtasks,
  } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      estimatedTime,
      priority,
      subtasks,
      user: req.user.id,
    });

    const task = await newTask.save();

    // Emit socket event for real-time update
    req.io.emit('taskCreated', task);

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const {
    title,
    description,
    dueDate,
    estimatedTime,
    progress,
    priority,
    status,
    pinned,
    subtasks,
    workingStartTime,
    totalTimeSpent,
  } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatePayload = {
      title,
      description,
      dueDate,
      estimatedTime,
      progress,
      priority,
      status,
      pinned,
      subtasks,
    };

    if (workingStartTime !== undefined) updatePayload.workingStartTime = workingStartTime;
    if (totalTimeSpent !== undefined) updatePayload.totalTimeSpent = totalTimeSpent;

    // Finished task logic
    if (progress === 100) {
      updatePayload.status = 'finished';
    }

    // Update progress timestamp
    if (progress && task.progress !== progress) {
      updatePayload.lastProgressUpdate = Date.now();
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true }
    );

    req.io.emit('taskUpdated', task);
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    req.io.emit('taskDeleted', req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Update task order
// @route   PUT /api/tasks/order
// @access  Private
const updateTaskOrder = async (req, res) => {
  const { orderedTasks } = req.body; // Expecting an array of { _id, order }

  try {
    const bulkOps = orderedTasks.map(task => ({
      updateOne: {
        filter: { _id: task._id, user: req.user.id },
        update: { $set: { order: task.order } },
      },
    }));

    const result = await Task.bulkWrite(bulkOps);

    req.io.emit('taskOrderUpdated', { orderedTasks });

    res.json({ msg: 'Task order updated successfully', modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
};