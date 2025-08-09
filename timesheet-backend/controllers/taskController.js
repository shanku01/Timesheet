import Task from '../models/Task.js';


export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating task', error: err.message });
  }
};


export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo assignedBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
};


export const getUserTasks = async (req, res) => {
  try {
    const { status, date } = req.query;

    const query = {
      assignedTo: req.user.userId
    };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching user tasks', err);
    res.status(500).json({ msg: 'Error fetching user tasks' });
  }
};



export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const allowedFields = ['title', 'description', 'status'];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error updating task' });
  }
};

