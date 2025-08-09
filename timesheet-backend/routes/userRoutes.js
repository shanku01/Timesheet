import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, managerOnly, getAllUsers);
router.get('/:id', protect, managerOnly, getUserById);

export default router;
