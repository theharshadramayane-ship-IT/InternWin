import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  userId: { type: String, unique: true },
  password: { type: String },
  // 🎯 FIX: ref ko 'Program' se badal kar 'Batch' kiya
  batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  domain: { type: String, default: '' },
  college: { type: String, default: '' },
  university: { type: String, default: '' },
  qualification: { type: String, default: '' },
  address: { type: String, default: '' },
  reference: { type: String, default: '' },
  candidateType: { type: String, default: '' },

  // SkillGate Admin dashboard fields (Interns feature)
  department: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Under Review', 'Offer Extended', 'Completed'], default: 'Active' },
  score: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  startDate: { type: Date },
  duration: { type: String, default: '' }
}, { timestamps: true });

// 🎯 FIX: export default use kiya ES Modules ke liye
export default mongoose.models.Student || mongoose.model('Student', studentSchema);