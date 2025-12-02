const mongoose = require('mongoose');

const workLogSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  timeSpent: {
    type: Number, // in minutes
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const WorkLog = mongoose.model('WorkLog', workLogSchema);

module.exports = WorkLog;
