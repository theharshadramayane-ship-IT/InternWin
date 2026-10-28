import express from 'express';
import JobPosting from '../models/JobPosting.js';
import { authenticate, authorizeRoles, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/jobs/active — Student Job Board view: only active postings, requires login (any role)
router.get('/active', authenticate, async (_req, res) => {
  try {
    const jobs = await JobPosting.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/jobs/:id/apply — student applies (increments applied count)
router.post('/:id/apply', authenticate, authorizeRoles('student'), async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndUpdate(req.params.id, { $inc: { applied: 1 } }, { new: true });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job posting not found.' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/jobs — list all postings (admin)
router.get('/', authenticateAdmin, async (_req, res) => {
  try {
    const jobs = await JobPosting.find().sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/jobs — create a posting (admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, department, openings, deadline } = req.body;
    if (!title?.trim() || !department?.trim() || !openings || !deadline) {
      return res.status(400).json({ success: false, error: 'Title, department, openings and deadline are required.' });
    }

    const job = await JobPosting.create({
      title: title.trim(),
      department: department.trim(),
      openings: Number(openings),
      deadline
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/jobs/:id/close — mark a posting as closed (admin)
router.patch('/:id/close', authenticateAdmin, async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndUpdate(req.params.id, { status: 'Closed' }, { new: true });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job posting not found.' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/jobs/:id — remove a posting (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job posting not found.' });
    }
    res.json({ success: true, message: 'Job posting deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
