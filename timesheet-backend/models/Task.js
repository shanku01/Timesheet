import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  timeSpent: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'in-progress'],
    default: 'pending'
  },
  tags: [String],
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);
