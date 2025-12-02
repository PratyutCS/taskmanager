const express = require('express');
const router = express.Router();
const {
  createWorkLog,
  getWorkLogsForTask,
} = require('../controllers/workLogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:taskId').post(protect, createWorkLog).get(protect, getWorkLogsForTask);

module.exports = router;
