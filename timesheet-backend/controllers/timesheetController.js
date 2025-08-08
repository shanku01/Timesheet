import Timesheet from '../models/Timesheet.js';
import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

import { updateTask } from './taskController.js';

// POST /api/timesheets - Submit timesheet (Associate)
const submitTimesheet = asyncHandler(async (req, res) => {
  const { taskId, actualHours, date } = req.body[0]; // Assuming array input

  if (!taskId || !actualHours || !date) {
    res.status(400);
    throw new Error('Please provide taskId, actualHours, and date');
  }

  // Find the task
  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Authorization: only assigned associate or admin can submit
  if (
    req.user.role === 'associate' &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to submit timesheet for this task');
  }

  // Create timesheet entry
  const timesheet = await Timesheet.create({
    user: task.assignedTo,
    task: taskId,
    actualHours,
    date,
  });

  // Call updateTask controller to change status
  req.params.id = taskId; // so updateTask can use it
  req.body = { status: 'completed' }; // set completed status
  await updateTask(req, res); // This will send a response, so we stop execution here
});

// GET /api/timesheets/my - Get my timesheets
const getMyTimesheets = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, no user found');
  }
  const timesheets = await Timesheet.find({ user: req.user.userId })
    .populate('task', 'title estimatedHours');

  res.json(timesheets);
});

// GET /api/timesheets - Manager-only: Get all timesheets
const getAllTimesheets = asyncHandler(async (req, res) => {
  const timesheets = await Timesheet.find({})
    .populate('user', 'name email')
    .populate('task', 'title estimatedHours');

  res.json(timesheets);
});

// GET /api/reports/summary - Report: planned vs actual
const getTimesheetSummary = asyncHandler(async (req, res) => {
  const timesheets = await Timesheet.find({})
    .populate('user', 'name')
    .populate('task', 'title estimatedHours');

  const summary = timesheets.map(t => ({
    associate: t.user.name,
    task: t.task.title,
    estimatedHours: t.task.estimatedHours,
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
