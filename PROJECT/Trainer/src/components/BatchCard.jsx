import React from 'react';
import '../assets/BatchCard.css';

const BatchCard = ({ batch, onClick }) => {
  const meetingStatus = batch.meetingStatus || 'Not Set';
  const statusClass = meetingStatus === 'Scheduled' ? 'scheduled' : 'not-set';

  return (
    <button type="button" className="batch-card" onClick={onClick}>
      <h2 className="batch-card-title">{batch.name}</h2>
      <p className="batch-card-domain">Domain: {batch.domain}</p>
      <div className="batch-card-meta">
        <span className="batch-card-count">{batch.studentCount || batch.studentIds?.length || 0} Students</span>
        <span className={`batch-card-meeting-status ${statusClass}`}>{meetingStatus}</span>
      </div>
      {batch.description && <p className="batch-card-description">{batch.description}</p>}
    </button>
  );
};

export default BatchCard;
