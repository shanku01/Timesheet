import mongoose from 'mongoose';

const timesheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  actualHours: {
    type: Number,
    required: true,
    min: [0, 'Actual hours cannot be negative'],
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: [0, 'Actual hours cannot be negative'],
  },
  date: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);
export default Timesheet;
