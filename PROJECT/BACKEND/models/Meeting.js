import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true, index: true },
  title: { type: String, required: true },
  meetingLink: { type: String, required: true },
  scheduledAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Meeting', meetingSchema);
