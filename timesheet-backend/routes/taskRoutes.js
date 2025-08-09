import express from 'express';
import {
  createTask,
  getAllTasks,
  getUserTasks,
  updateTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getAllTasks);
router.get('/my', protect, getUserTasks);
router.put('/:id', protect, updateTask);

export default router;
