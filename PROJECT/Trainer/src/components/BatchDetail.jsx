import React, { useMemo, useState } from 'react';
import UploadForm from './UploadForm';
import DataTable from './DataTable';

const BatchDetail = ({ batch, data, role, onUpload }) => {
  const [section, setSection] = useState('meetings');

  const currentData = useMemo(() => {
    if (!data) return [];
    switch (section) {
      case 'meetings': return data.meetings || [];
      case 'notes': return data.notes || [];
      case 'notices': return data.notices || [];
      case 'tasks': return data.tasks || [];
      default: return [];
    }
  }, [data, section]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{batch.batchName}</h2>
          <p className="mt-1 text-slate-500">{batch.batchCode} • {batch.description || 'No description'}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">Students: {batch.students?.length || 0}</span>
          <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">Trainers: {batch.trainers?.length || 0}</span>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {['meetings', 'notes', 'notices', 'tasks'].map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${section === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            type="button"
            onClick={() => setSection(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {role === 'trainer' && (
        <div className="mb-6">
          <UploadForm section={section} onUpload={(payload) => onUpload(section.slice(0, -1), payload)} />
        </div>
      )}
      <DataTable section={section} items={currentData} />
    </div>
  );
};

export default BatchDetail;
