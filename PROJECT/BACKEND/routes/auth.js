import express from 'express';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import { authenticate, authorizeRoles, signToken } from '../middleware/auth.js';
import { comparePassword } from '../utils/password.js';

const router = express.Router();

const buildStudentResponse = (student) => ({
  _id: student._id,
  name: student.name,
  email: student.email,
  userId: student.userId,
  phone: student.phone,
  college: student.college
});

const buildAdminResponse = (admin) => ({
  _id: admin._id,
  name: admin.name,
  userId: admin.userId,
  role: admin.role
});

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ success: false, error: 'User ID and password are required.' });
    }

    const student = await Student.findOne({ userId: userId.trim() });
    if (!student) {
      return res.status(401).json({ success: false, error: 'Invalid User ID or password.' });
    }

    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid User ID or password.' });
    }

    const token = signToken({
      id: student._id.toString(),
      role: 'student',
      userId: student.userId
    });

    res.json({
      success: true,
      token,
      student: buildStudentResponse(student)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ success: false, error: 'User ID and password are required.' });
    }

    const admin = await Admin.findOne({ userId: userId.trim() });
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const token = signToken({
      id: admin._id.toString(),
      role: 'admin',
      userId: admin.userId
    });

    res.json({
      success: true,
      token,
      admin: buildAdminResponse(admin)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      role: req.user.role,
      userId: req.user.userId
    }
  });
});

router.get('/student/me', authenticate, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student account not found.' });
    }

    res.json({ success: true, student: buildStudentResponse(student) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/student/me', authenticate, authorizeRoles('student'), async (req, res) => {
  try {
    const { name, phone, college } = req.body;
    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (phone?.trim()) updates.phone = phone.trim();
    if (college?.trim()) updates.college = college.trim();

    const student = await Student.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student account not found.' });
    }

    res.json({ success: true, student: buildStudentResponse(student) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/admin/me', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin account not found.' });
    }

    res.json({ success: true, admin: buildAdminResponse(admin) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
