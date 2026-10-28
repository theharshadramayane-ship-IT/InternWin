import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BatchCard from '../components/BatchCard';
import api from '../utils/api';
import '../assets/BatchDetail.css';

const TrainingProgram = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get('/api/batches/my-batches');
        setBatches(response.data.batches || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load batches.');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="training-page">
      <h1 className="training-page-title">Training Program</h1>
      <p className="training-page-subtitle">Select a batch to upload meetings, notes, notices, and tasks.</p>

      {error && <div className="training-page-error">{error}</div>}
      {loading && <div className="training-page-empty">Loading batches...</div>}

      {!loading && !error && batches.length === 0 && (
        <div className="training-page-empty">No batches assigned yet.</div>
      )}

      {!loading && batches.length > 0 && (
        <div className="batch-card-grid">
          {batches.map((batch) => (
            <BatchCard
              key={batch._id}
              batch={batch}
              onClick={() => navigate(`/trainer/batch/${batch._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingProgram;
