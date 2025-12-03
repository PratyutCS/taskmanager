const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  estimatedTime: {
    type: Number, // in minutes
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['idle', 'working', 'finished'],
    default: 'idle',
  },
  order: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastProgressUpdate: {
    type: Date,
    default: Date.now,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  workingStartTime: {
    type: Date,
    default: null
  },
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  totalTimeSpent: {
    type: Number,
    default: 0
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;