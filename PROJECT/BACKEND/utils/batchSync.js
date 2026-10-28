import Batch from '../models/Batch.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';

export const addStudentToBatch = async (batchId, studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error('Student not found.');
  }

  await Batch.findByIdAndUpdate(batchId, { $addToSet: { studentIds: studentId } });
  await Student.findByIdAndUpdate(studentId, { $addToSet: { batchIds: batchId } });
};

export const removeStudentFromBatch = async (batchId, studentId) => {
  await Batch.findByIdAndUpdate(batchId, { $pull: { studentIds: studentId } });
  await Student.findByIdAndUpdate(studentId, { $pull: { batchIds: batchId } });
};

export const syncStudentsForBatch = async (batchId, studentIds = []) => {
  const uniqueIds = [...new Set(studentIds.map((id) => id.toString()))];

  if (uniqueIds.length === 0) {
    return;
  }

  const existingCount = await Student.countDocuments({ _id: { $in: uniqueIds } });
  if (existingCount !== uniqueIds.length) {
    throw new Error('One or more selected students were not found.');
  }

  await Student.updateMany(
    { _id: { $in: uniqueIds } },
    { $addToSet: { batchIds: batchId } }
  );
};

export const assignTrainerToBatch = async (batchId, trainerId, previousTrainerId = null) => {
  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    throw new Error('Trainer not found.');
  }

  await Trainer.findByIdAndUpdate(trainerId, { $addToSet: { batchIds: batchId } });

  if (previousTrainerId && previousTrainerId.toString() !== trainerId.toString()) {
    await Trainer.findByIdAndUpdate(previousTrainerId, { $pull: { batchIds: batchId } });
  }
};

export const cleanupBatchRelations = async (batch) => {
  if (!batch) {
    return;
  }

  if (batch.studentIds?.length) {
    await Student.updateMany(
      { _id: { $in: batch.studentIds } },
      { $pull: { batchIds: batch._id } }
    );
  }

  if (batch.trainerId) {
    await Trainer.findByIdAndUpdate(batch.trainerId, { $pull: { batchIds: batch._id } });
  }
};
