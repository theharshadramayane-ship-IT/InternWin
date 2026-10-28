import express from 'express';
import bcrypt from 'bcryptjs';
import Program from '../models/Program.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

const normalizeStatus = (value) => {
  if (!value) return 'Upcoming';
  const cleaned = String(value).trim().toLowerCase();
  if (cleaned === 'active') return 'Active';
  if (cleaned === 'completed') return 'Completed';
  return 'Upcoming';
};

const sanitizeProgram = (program) => {
  const plain = program.toObject ? program.toObject() : program;
  plain.status = normalizeStatus(plain.status);
  plain.batchName = plain.batchName || plain.name || `${plain.domain || 'Batch'} Batch`;
  plain.trainerName = plain.trainerName || plain.trainer || '';
  plain.trainer = plain.trainerName;
  plain.studentsEnrolled = plain.studentsEnrolled || [];
  return plain;
};

const syncTrainerAssignment = async (trainerName, batchId) => {
  if (!trainerName || !batchId) return;

  const matchingTrainer = await Trainer.findOne({ trainerName: { $regex: new RegExp(`^${String(trainerName).trim()}$`, 'i') } });
  if (!matchingTrainer) return;

  const assignedBatches = Array.isArray(matchingTrainer.batchIds) ? matchingTrainer.batchIds.map((id) => String(id)) : [];
  const batchIdString = String(batchId);
  if (!assignedBatches.includes(batchIdString)) assignedBatches.push(batchIdString);

  matchingTrainer.batchIds = assignedBatches;
  matchingTrainer.status = 'Assigned';
  await matchingTrainer.save();
};

router.get('/admin-all', authenticateAdmin, async (_req, res) => {
  try {
    const programs = await Program.find({}).populate('studentsEnrolled').sort({ createdAt: -1 });
    res.json({ success: true, programs: programs.map(sanitizeProgram) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/add', authenticateAdmin, async (req, res) => {
  try {
    const trainerValue = req.body.trainer || req.body.trainerName;
    if (trainerValue) {
      req.body.trainer = trainerValue;
      req.body.trainerName = trainerValue;
    }

    req.body.status = normalizeStatus(req.body.status);
    req.body.batchName = req.body.batchName || req.body.name || `${req.body.domain || 'Batch'} Batch`;
    const newProgram = new Program(req.body);
    await newProgram.save();

    if (trainerValue) {
      await syncTrainerAssignment(String(trainerValue).trim(), String(newProgram._id));
    }

    res.json({ success: true, message: 'Training Program saved successfully!', program: sanitizeProgram(newProgram) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/upcoming-global', async (_req, res) => {
  try {
    const upcoming = await Program.find({ status: { $regex: /^upcoming$/i } }).sort({ createdAt: 1 });
    res.json({ success: true, programs: upcoming.map(sanitizeProgram) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/my-batches/:userId', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId.trim() });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found.' });
    }

    const batchIds = (student.batchIds && student.batchIds.length > 0) ? student.batchIds : (student.batchId ? [student.batchId] : []);
    const programs = batchIds.length > 0 ? await Program.find({ _id: { $in: batchIds } }).sort({ createdAt: -1 }) : [];
    res.json({ success: true, programs: programs.map(sanitizeProgram) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/meeting-link', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.meetingLink = req.body.meetingLink || '';
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/tasks', authenticate, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.tasks.push({ title: String(title).trim(), description: description || '', deadline: deadline || '' });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/tasks/:taskId', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const task = program.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.set({ title: req.body.title || task.title, description: req.body.description ?? task.description, deadline: req.body.deadline ?? task.deadline });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id/tasks/:taskId', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.tasks.pull({ _id: req.params.taskId });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/notes', authenticate, async (req, res) => {
  try {
    const { title, content, type, attachmentLink, fileName } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Note title is required.' });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.notes.push({ title: String(title).trim(), content: content || '', type: type || 'Text', attachmentLink: attachmentLink || '', fileName: fileName || attachmentLink?.split('/').pop() || String(title).trim() });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/notes/:noteId', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const note = program.notes.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    note.set({ title: req.body.title || note.title, content: req.body.content ?? note.content, type: req.body.type || note.type, attachmentLink: req.body.attachmentLink ?? note.attachmentLink, fileName: req.body.fileName || note.fileName });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id/notes/:noteId', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.notes.pull({ _id: req.params.noteId });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/announcements', authenticate, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Notice title is required.' });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.announcements.push({ title: String(title).trim(), message: message || '' });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/announcements/:announcementId', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const announcement = program.announcements.id(req.params.announcementId);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    announcement.set({ title: req.body.title || announcement.title, message: req.body.message ?? announcement.message });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id/announcements/:announcementId', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    program.announcements.pull({ _id: req.params.announcementId });
    await program.save();
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }
    res.json({ success: true, program: sanitizeProgram(program) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/update-status/:id', authenticateAdmin, async (req, res) => {
  try {
    let { status } = req.body;
    status = normalizeStatus(status);
    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, program: sanitizeProgram(updatedProgram) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/create-and-link-student', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, userId, password, batchId } = req.body;
    if (!name || !email || !userId || !password || !batchId) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const normalizedUserId = userId.trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let student = await Student.findOne({ userId: normalizedUserId });

    if (student) {
      student.name = name;
      student.email = email;
      student.phone = phone;
      student.password = hashedPassword;
      student.batchIds = Array.from(new Set([...(student.batchIds || []), batchId]));
      await student.save();
      await Program.findByIdAndUpdate(batchId, { $addToSet: { studentsEnrolled: student._id } });
      return res.json({ success: true, message: 'Existing student updated and linked to the batch.', student, program: await Program.findById(batchId) });
    }

    const newStudent = new Student({ name, email, phone, userId: normalizedUserId, password: hashedPassword, batchIds: [batchId] });
    await newStudent.save();
    await Program.findByIdAndUpdate(batchId, { $addToSet: { studentsEnrolled: newStudent._id } });
    res.json({ success: true, message: 'Student created and linked to the batch.', student: newStudent, program: await Program.findById(batchId) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/update-student/:studentId', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, userId, password } = req.body;
    if (!name || !email || !phone || !userId) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and student ID are required.' });
    }

    const normalizedUserId = String(userId).trim();
    const existingStudent = await Student.findOne({ userId: normalizedUserId, _id: { $ne: req.params.studentId } });
    if (existingStudent) {
      return res.status(409).json({ success: false, message: 'A student with this ID already exists.' });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    student.name = name;
    student.email = email;
    student.phone = phone;
    student.userId = normalizedUserId;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    await student.save();
    res.json({ success: true, message: 'Student updated successfully.', student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/delete-student/:studentId/:batchId', authenticateAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const batchId = req.params.batchId;
    student.batchIds = (student.batchIds || []).filter((id) => String(id) !== String(batchId));
    await student.save();

    await Program.findByIdAndUpdate(batchId, { $pull: { studentsEnrolled: student._id } });
    res.json({ success: true, message: 'Student removed from the batch.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
  try {
    const removedProgram = await Program.findByIdAndDelete(req.params.id);
    if (!removedProgram) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    res.json({ success: true, message: 'Batch deleted successfully.', program: sanitizeProgram(removedProgram) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;