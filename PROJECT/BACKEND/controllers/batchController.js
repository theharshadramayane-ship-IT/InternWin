import Batch from '../models/Batch.js';
import Student from '../models/Student.js';
import { attachMeetingStatus, formatBatch } from '../utils/batchFormat.js';
import {
  addStudentToBatch,
  assignTrainerToBatch,
  cleanupBatchRelations,
  removeStudentFromBatch,
  syncStudentsForBatch
} from '../utils/batchSync.js';

const ALLOWED_STATUSES = ['Upcoming', 'Active', 'Completed'];

export { formatBatch };

const populateBatch = (query) =>
  query
    .populate('trainerId', 'trainerName email userId')
    .populate('studentIds', 'name email userId');

export const listAllStudents = async (_req, res) => {
  try {
    const students = await Student.find()
      .select('name email userId phone domain')
      .sort({ name: 1 });

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listBatches = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'trainer') {
      query = { trainerId: req.user.id };
    } else if (req.user.role === 'student') {
      query = { studentIds: req.user.id };
    } else {
      return res.status(403).json({ success: false, error: 'Invalid role for this endpoint.' });
    }

    const batches = await populateBatch(Batch.find(query)).sort({ createdAt: -1 });
    const formatted = batches.map(formatBatch);
    const enriched = req.user.role === 'trainer'
      ? await attachMeetingStatus(formatted)
      : formatted;

    res.json({ success: true, batches: enriched });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createBatch = async (req, res) => {
  try {
    const {
      name,
      description = '',
      domain,
      trainerId,
      studentIds = [],
      status = 'Upcoming',
      meetingLink = ''
    } = req.body;

    if (!name?.trim() || !domain?.trim() || !trainerId) {
      return res.status(400).json({ success: false, error: 'Batch name, domain, and trainer are required.' });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid batch status.' });
    }

    const batch = await Batch.create({
      name: name.trim(),
      description: description.trim(),
      domain: domain.trim(),
      trainerId,
      studentIds: [],
      status,
      meetingLink: meetingLink.trim(),
      createdBy: 'admin'
    });

    await assignTrainerToBatch(batch._id, trainerId);
    await syncStudentsForBatch(batch._id, studentIds);

    if (studentIds.length > 0) {
      batch.studentIds = studentIds;
      await batch.save();
    }

    const populated = await populateBatch(Batch.findById(batch._id));
    res.status(201).json({ success: true, batch: formatBatch(populated) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found.' });
    }

    const updates = {};
    const { name, description, domain, trainerId, status, meetingLink, studentIds } = req.body;

    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (domain !== undefined) updates.domain = domain.trim();
    if (meetingLink !== undefined) updates.meetingLink = meetingLink.trim();

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid batch status.' });
      }
      updates.status = status;
    }

    if (trainerId !== undefined) {
      await assignTrainerToBatch(batch._id, trainerId, batch.trainerId);
      updates.trainerId = trainerId;
    }

    Object.assign(batch, updates);
    await batch.save();

    if (studentIds !== undefined) {
      const incomingIds = [...new Set(studentIds.map((id) => id.toString()))];
      const currentIds = batch.studentIds.map((id) => id.toString());

      const toAdd = incomingIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !incomingIds.includes(id));

      await Promise.all(toAdd.map((studentId) => addStudentToBatch(batch._id, studentId)));
      await Promise.all(toRemove.map((studentId) => removeStudentFromBatch(batch._id, studentId)));

      batch.studentIds = incomingIds;
      await batch.save();
    }

    const populated = await populateBatch(Batch.findById(batch._id));
    res.json({ success: true, batch: formatBatch(populated) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found.' });
    }

    await cleanupBatchRelations(batch);
    await Batch.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Batch deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, error: 'Student ID is required.' });
    }

    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found.' });
    }

    await addStudentToBatch(batch._id, studentId);

    const populated = await populateBatch(Batch.findById(batch._id));
    res.json({ success: true, studentIds: populated.studentIds, batch: formatBatch(populated) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeStudent = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found.' });
    }

    await removeStudentFromBatch(batch._id, req.params.studentId);

    const populated = await populateBatch(Batch.findById(batch._id));
    res.json({
      success: true,
      message: 'Student removed from batch.',
      studentIds: populated.studentIds,
      batch: formatBatch(populated)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
