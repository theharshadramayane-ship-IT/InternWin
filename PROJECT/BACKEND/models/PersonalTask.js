import mongoose from 'mongoose';

const personalTaskSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  title: { type: String, required: true, trim: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  note: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.PersonalTask || mongoose.model('PersonalTask', personalTaskSchema);
