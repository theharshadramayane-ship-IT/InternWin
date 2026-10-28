import mongoose from 'mongoose';

const mockTestResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true, index: true },
  score: { type: Number, required: true }, // percentage, computed server-side
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

mockTestResultSchema.index({ studentId: 1, testId: 1 }, { unique: true });

export default mongoose.models.MockTestResult || mongoose.model('MockTestResult', mockTestResultSchema);
