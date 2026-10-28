import express from 'express';
import Student from '../models/Student.js';
import { authenticateAdmin, authenticate, authorizeRoles } from '../middleware/auth.js';
import { hashPassword, comparePassword } from '../utils/password.js';

const router = express.Router();

const generateUserId = async () => {
  let userId;
  let exists = true;
  while (exists) {
    userId = String(Math.floor(10000000 + Math.random() * 90000000));
    // eslint-disable-next-line no-await-in-loop
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

const sanitize = (student) => {
  const plain = student.toObject ? student.toObject() : student;
  delete plain.password;
  return plain;
};

// ─── Self-service routes (logged-in student, own record only) ─────────────
const requireStudent = [authenticate, authorizeRoles('student')];

// PATCH /api/students/me/password — change own password
// (Profile field updates live at PATCH /api/auth/student/me)
router.patch('/me/password', ...requireStudent, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Current password and a new password (min 8 chars) are required.' });
    }
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found.' });
    }
    const isMatch = await comparePassword(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }
    student.password = await hashPassword(newPassword);
    await student.save();
    res.json({ success: true, message: 'Password updated.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Admin routes ───────────────────────────────────────────────────────────

// GET /api/students — list all interns (admin)
router.get('/', authenticateAdmin, async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, data: students.map(sanitize) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/students — directly onboard a new intern (admin)
// Auto-generates a userId + password so the intern can log in to the Student portal.
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, department, college, startDate, duration } = req.body;
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !department?.trim() || !college?.trim() || !startDate || !duration) {
      return res.status(400).json({ success: false, error: 'Name, email, phone, department, college, start date and duration are required.' });
    }

    const userId = await generateUserId();
    const plainPassword = generatePassword();
    const password = await hashPassword(plainPassword);

    const student = await Student.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      userId,
      password,
      department: department.trim(),
      college: college.trim(),
      startDate,
      duration,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      data: sanitize(student),
      credentials: { userId, password: plainPassword } // shown once so admin can share with the intern
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'A student with this email/userId already exists.' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/students/:id/status — update an intern's status (admin)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Active', 'Under Review', 'Offer Extended', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }
    const student = await Student.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Intern not found.' });
    }
    res.json({ success: true, data: sanitize(student) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/students/:id — remove an intern (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Intern not found.' });
    }
    res.json({ success: true, message: 'Intern removed.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
