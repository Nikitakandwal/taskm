// taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require('../controllers/taskController');

router.route('/').get(protect, getTasks).post(protect, createTask);
router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);
 
router.route('/:id/completion').patch(protect, toggleTaskCompletion)

module.exports = router;