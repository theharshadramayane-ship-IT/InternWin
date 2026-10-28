import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  duration: { type: Number, required: true }, // minutes
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true } // index into options
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, default: 'admin' }
}, { timestamps: true });

export default mongoose.models.MockTest || mongoose.model('MockTest', mockTestSchema);
