// routes/userRoutes.js
import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Manager-only routes
router.get('/', protect, managerOnly, getAllUsers); // /api/users
router.get('/:id', protect, managerOnly, getUserById); // /api/users/:id

export default router;
