import express from 'express';
import {
  submitTimesheet,
  getMyTimesheets,
  getAllTimesheets,
  getTimesheetSummary
} from '../controllers/timesheetController.js';

import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitTimesheet);               // POST /api/timesheets
router.get('/my', protect, getMyTimesheets);              // GET /api/timesheets/my
router.get('/', protect, managerOnly, getAllTimesheets);  // GET /api/timesheets
router.get('/reports/summary', protect, managerOnly, getTimesheetSummary); // GET /api/timesheets/reports/summary

export default router;
