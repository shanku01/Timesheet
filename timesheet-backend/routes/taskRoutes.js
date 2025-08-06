import express from 'express';
import {
  createTask,
  getAllTasks,
  getUserTasks,
  updateTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask); // Manager assigns task
router.get('/', protect, getAllTasks); // Manager view
router.get('/my', protect, getUserTasks); // Associate view
router.put('/:id', protect, updateTask); // Update by manager or associate

export default router;
