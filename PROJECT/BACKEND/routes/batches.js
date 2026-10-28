import express from 'express';
import Batch from '../models/Batch.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';
import {
  loadBatch,
  requireAssignedTrainer,
  requireBatchReadAccess
} from '../middleware/checkTrainerBatch.js';
import {
  addStudent,
  createBatch,
  deleteBatch,
  listAllStudents,
  listBatches,
  removeStudent,
  updateBatch
} from '../controllers/batchController.js';
import {
  createMeeting,
  createNote,
  createNotice,
  createTask,
  deleteMeeting,
  deleteNote,
  deleteNotice,
  deleteTask,
  getBatchData,
  updateMeeting,
  updateNote,
  updateNotice,
  updateTask
} from '../controllers/trainerContentController.js';

const router = express.Router();

const authenticateBatchAccess = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    req.user = { id: 'admin', role: 'admin', userId: 'admin' };
    return next();
  }
  return authenticate(req, res, next);
};

const trainerWrite = [authenticate, loadBatch, requireAssignedTrainer];

router.get('/students/all', authenticateAdmin, listAllStudents);

router.post('/', authenticateAdmin, createBatch);
router.put('/:id', authenticateAdmin, updateBatch);
router.delete('/:id', authenticateAdmin, deleteBatch);
router.post('/:id/add-student', authenticateAdmin, addStudent);
router.delete('/:id/remove-student/:studentId', authenticateAdmin, removeStudent);

router.get('/domain/:domainName', async (req, res) => {
  try {
    const batches = await Batch.find({ domain: req.params.domainName, status: 'Upcoming' })
      .populate('trainerId', 'trainerName specialization');
    res.json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/my-batches', authenticateBatchAccess, listBatches);

router.get('/:id/data', authenticate, loadBatch, requireBatchReadAccess, getBatchData);

router.post('/:id/meeting', ...trainerWrite, createMeeting);
router.put('/:id/meeting/:meetingId', ...trainerWrite, updateMeeting);
router.delete('/:id/meeting/:meetingId', ...trainerWrite, deleteMeeting);

router.post('/:id/note', ...trainerWrite, createNote);
router.put('/:id/note/:noteId', ...trainerWrite, updateNote);
router.delete('/:id/note/:noteId', ...trainerWrite, deleteNote);

router.post('/:id/notice', ...trainerWrite, createNotice);
router.put('/:id/notice/:noticeId', ...trainerWrite, updateNotice);
router.delete('/:id/notice/:noticeId', ...trainerWrite, deleteNotice);

router.post('/:id/task', ...trainerWrite, createTask);
router.put('/:id/task/:taskId', ...trainerWrite, updateTask);
router.delete('/:id/task/:taskId', ...trainerWrite, deleteTask);

export default router;
