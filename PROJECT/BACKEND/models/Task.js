import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  deadline: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);
