// controllers/userController.js
import User from '../models/User.js';

// Get all users (excluding managers optionally)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'associate' }).select('-password'); // hide password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error });
  }
};
