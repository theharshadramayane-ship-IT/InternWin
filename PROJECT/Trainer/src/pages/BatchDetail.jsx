import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import UploadForm from '../components/UploadForm';
import api from '../utils/api';
import '../assets/BatchDetail.css';

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [section, setSection] = useState('meetings');
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const endpointMap = {
    meetings: 'meeting',
    notes: 'note',
    notices: 'notice',
    tasks: 'task'
  };

  const fetchBatchData = async () => {
    try {
      const response = await api.get(`/api/batches/${id}/data`);
      setBatch(response.data.batch);
      setBatchData(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load batch details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchData();
  }, [id]);

  useEffect(() => {
    setEditingItem(null);
  }, [section]);

  const currentItems = useMemo(() => {
    if (!batchData) return [];
    return batchData[section] || [];
  }, [batchData, section]);

  const handleUpload = async (payload, itemId = null) => {
    const endpoint = endpointMap[section];

    try {
      if (itemId) {
        await api.put(`/api/batches/${id}/${endpoint}/${itemId}`, payload);
      } else {
        await api.post(`/api/batches/${id}/${endpoint}`, payload);
      }
      setEditingItem(null);
      await fetchBatchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const endpoint = endpointMap[section];
    try {
      await api.delete(`/api/batches/${id}/${endpoint}/${itemId}`);
      if (editingItem?._id === itemId) {
        setEditingItem(null);
      }
      await fetchBatchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed.');
    }
  };

  if (loading) {
    return <div className="batch-detail-page">Loading batch details...</div>;
  }

  return (
    <div className="batch-detail-page">
      <div className="batch-detail-header">
        <div>
          <h1 className="batch-detail-title">{batch?.name || 'Batch Details'}</h1>
          <p className="batch-detail-subtitle">{batch?.domain} • {batch?.description || 'No description'}</p>
        </div>
        <button type="button" className="batch-detail-back" onClick={() => navigate('/trainer/training')}>
          Back to Batches
        </button>
      </div>

      {error && <div className="batch-detail-error">{error}</div>}

      <div className="batch-detail-tabs">
        {['meetings', 'notes', 'notices', 'tasks'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`batch-detail-tab ${section === tab ? 'active' : ''}`}
            onClick={() => setSection(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="batch-detail-panel">
        <UploadForm
          section={section}
          onUpload={handleUpload}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />
        <DataTable
          section={section}
          items={currentItems}
          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default BatchDetail;
