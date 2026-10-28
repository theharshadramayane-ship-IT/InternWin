import express from 'express';
import bcrypt from 'bcryptjs';
import Trainer from '../models/Trainer.js';
import Batch from '../models/Batch.js';
import { signToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/all', async (_req, res) => {
  try {
    const trainers = await Trainer.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { trainerName, email, contact, userId, password, specialization, experience } = req.body;
    if (!trainerName || !email || !contact || !userId || !password) {
      return res.status(400).json({ success: false, error: 'All required trainer fields must be filled.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const trainer = await Trainer.create({
      trainerName,
      email,
      contact,
      userId,
      password: hashed,
      specialization: specialization || '',
      experience: experience || 0
    });

    const { password: _, ...safeTrainer } = trainer.toObject();
    res.status(201).json({ success: true, data: safeTrainer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Trainer email or user ID already exists.' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const trainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found.' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found.' });
    }
    res.json({ success: true, message: 'Trainer deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, error: 'User ID and password are required.' });
    }

    const trainer = await Trainer.findOne({ userId: userId.trim() });
    if (!trainer) {
      return res.status(401).json({ success: false, error: 'Invalid credentials provided.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), trainer.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }

    const token = signToken({ id: trainer._id.toString(), role: 'trainer', userId: trainer.userId });
    res.json({
      success: true,
      trainer: {
        _id: trainer._id,
        trainerName: trainer.trainerName,
        email: trainer.email,
        contact: trainer.contact,
        userId: trainer.userId,
        specialization: trainer.specialization,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/my-batches/:identifier', async (req, res) => {
  try {
    const trainer = await Trainer.findOne({
      $or: [{ userId: req.params.identifier.trim() }, { trainerName: req.params.identifier.trim() }]
    });

    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found.' });
    }

    const batches = await Batch.find({ trainerId: trainer._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
