import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  attachmentLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Note', noteSchema);
