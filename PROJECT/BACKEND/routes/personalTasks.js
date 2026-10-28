import express from 'express';
import PersonalTask from '../models/PersonalTask.js';
import Student from '../models/Student.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate, authorizeRoles('student'));

// GET /api/tasks — list my tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await PersonalTask.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/tasks — create a task
router.post('/', async (req, res) => {
  try {
    const { title, dueDate, priority, note } = req.body;
    if (!title?.trim() || !dueDate) {
      return res.status(400).json({ success: false, error: 'Title and due date are required.' });
    }
    const task = await PersonalTask.create({
      studentId: req.user.id,
      title: title.trim(),
      dueDate,
      priority: priority || 'Medium',
      note: note || ''
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/tasks/:id — update status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'In Progress', 'Done'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }
    const task = await PersonalTask.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.id },
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    // Keep the intern's tasksCompleted count in sync for the Admin dashboard
    const completedCount = await PersonalTask.countDocuments({ studentId: req.user.id, status: 'Done' });
    await Student.findByIdAndUpdate(req.user.id, { tasksCompleted: completedCount });

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/tasks/:id — remove a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await PersonalTask.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
