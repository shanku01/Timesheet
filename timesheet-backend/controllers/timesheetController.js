import Timesheet from '../models/Timesheet.js';
import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

import { updateTask } from './taskController.js';

const submitTimesheet = asyncHandler(async (req, res) => {
  const { taskId, actualHours, date } = req.body;
  if (!taskId || !actualHours || !date) {
    res.status(400);
    throw new Error('Please provide taskId, actualHours, and date');
  }

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const timesheet = await Timesheet.create({
    user: task.assignedTo,
    estimatedHours: task.timeSpent,
    task: taskId,
    actualHours,
    date,
  });

  req.params.id = taskId;
  req.body = { status: 'completed' };
  await updateTask(req, res);
});

const getMyTimesheets = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, no user found');
  }
  const timesheets = await Timesheet.find({ user: req.user.userId })
    .populate('task', 'title estimatedHours');

  res.json(timesheets);
});

const getAllTimesheets = asyncHandler(async (req, res) => {
  const timesheets = await Timesheet.find({})
    .populate('user', 'name email')
    .populate('task', 'title estimatedHours');

  res.json(timesheets);
});

const getTimesheetSummary = asyncHandler(async (req, res) => {
  const timesheets = await Timesheet.find({})
    .populate('user', 'name')
    .populate('task', 'title estimatedHours');

  const summary = timesheets.map(t => ({
    associate: t.user.name,
    task: t.task.title,
    estimatedHours: t.estimatedHours,
    actualHours: t.actualHours,
    date: t.date
  }));
  res.json(summary);
});

export {
  submitTimesheet,
  getMyTimesheets,
  getAllTimesheets,
  getTimesheetSummary
};
