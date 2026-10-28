import Meeting from '../models/Meeting.js';

export const formatBatch = (batch) => ({
  _id: batch._id,
  name: batch.name,
  description: batch.description,
  domain: batch.domain,
  status: batch.status,
  trainerId: batch.trainerId?._id || batch.trainerId,
  studentIds: batch.studentIds,
  studentCount: batch.studentIds?.length || 0,
  trainer: batch.trainerId?.trainerName || null,
  meetingLink: batch.meetingLink || '',
  createdAt: batch.createdAt
});

export const attachMeetingStatus = async (batches) => {
  if (!batches.length) {
    return batches;
  }

  const batchIds = batches.map((batch) => batch._id);
  const meetingCounts = await Meeting.aggregate([
    { $match: { batchId: { $in: batchIds } } },
    { $group: { _id: '$batchId', count: { $sum: 1 } } }
  ]);

  const countMap = Object.fromEntries(
    meetingCounts.map((entry) => [entry._id.toString(), entry.count])
  );

  return batches.map((batch) => ({
    ...batch,
    meetingStatus: countMap[batch._id.toString()] > 0 ? 'Scheduled' : 'Not Set'
  }));
};
