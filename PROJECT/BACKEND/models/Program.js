import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  batchName: { type: String, required: true },
  trainer: { type: String, required: true },
  schedule: { type: String, required: true },
  timing: { type: String },
  duration: { type: String },
  startDate: { type: Date },
  status: { type: String, default: 'Upcoming' },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  meetingLink: { type: String, default: '' },
  tasks: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    deadline: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  notes: [{
    title: { type: String, required: true },
    content: { type: String, default: '' },
    type: { type: String, default: 'Text' },
    attachmentLink: { type: String, default: '' },
    fileName: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  announcements: [{
    title: { type: String, required: true },
    message: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Program || mongoose.model('Program', ProgramSchema);