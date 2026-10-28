import Meeting from '../models/Meeting.js';
import Note from '../models/Note.js';
import Notice from '../models/Notice.js';
import Task from '../models/Task.js';
import { formatBatch } from '../utils/batchFormat.js';

export const getBatchData = async (req, res) => {
  try {
    const batchId = req.batch._id;

    const [meetings, notes, notices, tasks] = await Promise.all([
      Meeting.find({ batchId }).sort({ createdAt: -1 }),
      Note.find({ batchId }).sort({ createdAt: -1 }),
      Notice.find({ batchId }).sort({ createdAt: -1 }),
      Task.find({ batchId }).sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      batch: formatBatch(req.batch),
      data: { meetings, notes, notices, tasks }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createMeeting = async (req, res) => {
  try {
    const { title, meetingLink } = req.body;
    if (!title?.trim() || !meetingLink?.trim()) {
      return res.status(400).json({ success: false, error: 'Title and meeting link are required.' });
    }

    const meeting = await Meeting.create({
      batchId: req.batch._id,
      title: title.trim(),
      meetingLink: meetingLink.trim()
    });

    res.status(201).json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.meetingId, batchId: req.batch._id });
    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found.' });
    }

    if (req.body.title !== undefined) meeting.title = req.body.title.trim();
    if (req.body.meetingLink !== undefined) meeting.meetingLink = req.body.meetingLink.trim();
    if (req.body.scheduledAt !== undefined) meeting.scheduledAt = req.body.scheduledAt;

    await meeting.save();
    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.meetingId, batchId: req.batch._id });
    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found.' });
    }
    res.json({ success: true, message: 'Meeting deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, attachmentLink } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required.' });
    }

    const note = await Note.create({
      batchId: req.batch._id,
      title: title.trim(),
      content: content || '',
      attachmentLink: attachmentLink || ''
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, batchId: req.batch._id });
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found.' });
    }

    if (req.body.title !== undefined) note.title = req.body.title.trim();
    if (req.body.content !== undefined) note.content = req.body.content;
    if (req.body.attachmentLink !== undefined) note.attachmentLink = req.body.attachmentLink;

    await note.save();
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, batchId: req.batch._id });
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found.' });
    }
    res.json({ success: true, message: 'Note deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, error: 'Title and message are required.' });
    }

    const notice = await Notice.create({
      batchId: req.batch._id,
      title: title.trim(),
      message: message.trim()
    });

    res.status(201).json({ success: true, notice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({ _id: req.params.noticeId, batchId: req.batch._id });
    if (!notice) {
      return res.status(404).json({ success: false, error: 'Notice not found.' });
    }

    if (req.body.title !== undefined) notice.title = req.body.title.trim();
    if (req.body.message !== undefined) notice.message = req.body.message.trim();

    await notice.save();
    res.json({ success: true, notice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findOneAndDelete({ _id: req.params.noticeId, batchId: req.batch._id });
    if (!notice) {
      return res.status(404).json({ success: false, error: 'Notice not found.' });
    }
    res.json({ success: true, message: 'Notice deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required.' });
    }

    const task = await Task.create({
      batchId: req.batch._id,
      title: title.trim(),
      description: description || '',
      deadline: deadline || ''
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, batchId: req.batch._id });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    if (req.body.title !== undefined) task.title = req.body.title.trim();
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.deadline !== undefined) task.deadline = req.body.deadline;

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, batchId: req.batch._id });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
