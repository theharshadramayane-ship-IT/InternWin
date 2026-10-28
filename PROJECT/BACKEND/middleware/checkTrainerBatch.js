import Batch from '../models/Batch.js';

export const loadBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found.' });
    }
    req.batch = batch;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const requireBatchReadAccess = (req, res, next) => {
  const { batch, user } = req;
  const isTrainer = user.role === 'trainer' && batch.trainerId.toString() === user.id;
  const isStudent = user.role === 'student' && batch.studentIds.some(
    (studentId) => studentId.toString() === user.id
  );
  const isAdmin = user.role === 'admin';

  if (!isTrainer && !isStudent && !isAdmin) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  next();
};

export const requireAssignedTrainer = (req, res, next) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ success: false, error: 'Trainer access required.' });
  }

  if (req.batch.trainerId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, error: 'You can only modify your assigned batches.' });
  }

  next();
};
