import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin', trim: true },
  role: { type: String, default: 'admin', enum: ['admin'] }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
