import express from 'express';
import { registerUser, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); // <-- This is your register endpoint
router.post('/login', login);

export default router;
