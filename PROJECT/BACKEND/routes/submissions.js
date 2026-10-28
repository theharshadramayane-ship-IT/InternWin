import express from 'express';
import Submission from '../models/Submission.js';
import Student from '../models/Student.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { hashPassword } from '../utils/password.js';

const router = express.Router();

const generateUserId = async () => {
  let userId;
  let exists = true;
  while (exists) {
    userId = String(Math.floor(10000000 + Math.random() * 90000000));
    exists = await Student.findOne({ userId });
  }
  return userId;
};

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i += 1) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

router.post('/submit', async (req, res) => {
  try {
    const submission = await Submission.create(req.body);
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/all', authenticateAdmin, async (_req, res) => {
  try {
    const data = await Submission.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/update/:id', authenticateAdmin, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    Object.assign(submission, req.body);
    await submission.save();

    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/approve/:id', authenticateAdmin, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, error: 'Application not found.' });
    if (submission.status === 'Approved') return res.status(400).json({ success: false, error: 'Application already approved.' });

    const plainPassword = generatePassword();
    const userId = await generateUserId();
    const hashedPassword = await hashPassword(plainPassword);
    const fullName = [submission.firstName, submission.middleName, submission.lastName].filter(Boolean).join(' ').trim();

    const student = await Student.create({
      name: fullName,
      email: submission.email,
      phone: submission.contact,
      userId,
      password: hashedPassword,
      domain: submission.domain || '',
      college: submission.college || '',
      university: submission.university || '',
      qualification: submission.qualification || '',
      address: submission.address || '',
      reference: submission.reference || '',
      candidateType: submission.candidateType || ''
    });

    submission.status = 'Approved';
    submission.userId = userId;
    submission.passwordDisplay = plainPassword;
    submission.userRef = student._id;
    await submission.save();

    res.json({
      success: true,
      message: 'Student approved and credentials generated.',
      userId,
      password: plainPassword,
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
        userId: student.userId
      },
      submission
    });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, error: 'A user with this email already exists.' });
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ success: false, error: 'Application not found.' });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;