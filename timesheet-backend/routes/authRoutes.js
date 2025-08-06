import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); // <-- This is your register endpoint
router.post('/login', loginUser);

export default router;
