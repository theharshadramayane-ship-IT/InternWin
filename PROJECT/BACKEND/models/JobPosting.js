import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  openings: { type: Number, required: true, min: 1 },
  applied: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  applicants: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    appliedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: String, default: 'admin' }
}, { timestamps: true });

export default mongoose.models.JobPosting || mongoose.model('JobPosting', jobPostingSchema);
