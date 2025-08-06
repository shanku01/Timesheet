import Task from '../models/Task.js';

// Add a new task
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating task', error: err.message });
  }
};

// Get all tasks (manager view)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo assignedBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
};

// Get tasks assigned to a specific user
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user tasks' });
  }
};

// Update task status or time
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating task' });
  }
};
