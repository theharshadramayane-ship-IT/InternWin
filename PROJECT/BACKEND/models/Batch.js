import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  domain: { type: String, required: true },
  
  // 🎯 NEW: Batch lifecycle manage karne ke liye status
  status: { 
    type: String, 
    enum: ['Upcoming', 'Active', 'Completed'], 
    default: 'Upcoming' 
  },
  
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  
  // 🎯 FIX: ref ko 'User' se badal kar 'Student' kiya
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], 

  // 🎯 NEW: Interactive Features (Card Click hone par jo dikhega)
  meetingLink: { type: String, default: '' },
  
  notices: [{
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  
  notes: [{
    title: { type: String, required: true },
    fileUrl: { type: String, required: true }, // Doc/PDF/Drive link save karne ke liye
    createdAt: { type: Date, default: Date.now }
  }],
  
  tasks: [{
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    createdAt: { type: Date, default: Date.now }
  }],

  createdBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Batch', batchSchema);