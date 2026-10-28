import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import batchRoutes from './routes/batches.js';
import submissionRoutes from './routes/submissions.js';
import trainerRoutes from './routes/trainers.js';
import programRoutes from './routes/programRoutes.js';
import jobRoutes from './routes/jobs.js';
import studentRoutes from './routes/students.js';
import personalTaskRoutes from './routes/personalTasks.js';
import mockTestRoutes from './routes/mockTests.js';
import seedDefaultAdmin from './utils/seedAdmin.js';
import seedDefaultMockTest from './utils/seedMockTest.js';

dotenv.config();

process.env.JWT_SECRET ||= 'internwin-dev-secret';
process.env.ADMIN_KEY ||= 'admin-secret-key';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'InternWin API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', personalTaskRoutes);
app.use('/api/mocktests', mockTestRoutes);

mongoose
  .connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internwin')
  .then(async () => {
    console.log('MongoDB connected');
    await seedDefaultAdmin();
    await seedDefaultMockTest();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
