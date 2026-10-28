import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
