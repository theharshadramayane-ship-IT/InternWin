import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, default: '' },
  lastName: { type: String, required: true },
  enquiryDate: { type: Date, default: Date.now },
  admissionDate: { type: Date },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  college: { type: String, default: '' },
  university: { type: String, default: '' },
  qualification: { type: String, default: '' },
  address: { type: String, default: '' },
  reference: { type: String, default: 'Relative' },
  candidateType: { type: String, default: 'Fresher' },
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
  userId: { type: String, default: '' },
  passwordDisplay: { type: String, default: '' },
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);
