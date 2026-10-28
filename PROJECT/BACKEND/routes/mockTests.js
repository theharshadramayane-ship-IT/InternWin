import express from 'express';
import MockTest from '../models/MockTest.js';
import MockTestResult from '../models/MockTestResult.js';
import Student from '../models/Student.js';
import { authenticate, authorizeRoles, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

const stripAnswers = (test) => ({
  _id: test._id,
  title: test.title,
  duration: test.duration,
  questions: test.questions.map(q => ({ question: q.question, options: q.options }))
});

// GET /api/mocktests — student view: active tests + my result if already attempted
router.get('/', authenticate, authorizeRoles('student'), async (req, res) => {
  try {
    const tests = await MockTest.find({ isActive: true }).sort({ createdAt: -1 });
    const results = await MockTestResult.find({ studentId: req.user.id });
    const resultMap = new Map(results.map(r => [r.testId.toString(), r.score]));

    const data = tests.map(t => {
      const score = resultMap.get(t._id.toString());
      return score !== undefined
        ? { ...stripAnswers(t), status: 'Completed', score }
        : { ...stripAnswers(t), status: 'Live', score: null };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/mocktests/:id/submit — student submits answers; score computed server-side
router.post('/:id/submit', authenticate, authorizeRoles('student'), async (req, res) => {
  try {
    const { answers } = req.body; // { "0": 1, "1": 2, ... } questionIndex -> selectedOptionIndex
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ success: false, error: 'Test not found.' });
    }

    const existing = await MockTestResult.findOne({ studentId: req.user.id, testId: test._id });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already attempted this test.' });
    }

    let correctCount = 0;
    test.questions.forEach((q, i) => {
      if (answers?.[i] === q.correct) correctCount += 1;
    });
    const score = Math.round((correctCount / test.questions.length) * 100);

    await MockTestResult.create({ studentId: req.user.id, testId: test._id, score });

    // Recompute the student's overall performance score (avg of all test attempts)
    // so the Admin dashboard's Interns/Analytics pages reflect real performance.
    const allResults = await MockTestResult.find({ studentId: req.user.id });
    const avgScore = Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length);
    await Student.findByIdAndUpdate(req.user.id, { score: avgScore });

    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/mocktests — admin creates a new test
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, duration, questions } = req.body;
    if (!title?.trim() || !duration || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'Title, duration and at least one question are required.' });
    }
    const test = await MockTest.create({ title: title.trim(), duration, questions });
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
