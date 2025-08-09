import express from 'express';
import {
  submitTimesheet,
  getMyTimesheets,
  getAllTimesheets,
  getTimesheetSummary
} from '../controllers/timesheetController.js';

import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitTimesheet);               
router.get('/my', protect, getMyTimesheets);              
router.get('/', protect, managerOnly, getAllTimesheets);  
router.get('/reports/summary', protect, managerOnly, getTimesheetSummary);

export default router;
