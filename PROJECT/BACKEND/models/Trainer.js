import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  trainerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Trainer', trainerSchema);
