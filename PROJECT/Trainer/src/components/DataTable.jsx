import React from 'react';
import '../assets/BatchDetail.css';

const DataTable = ({ section, items, onEdit, onDelete }) => {
  const renderHeader = () => {
    switch (section) {
      case 'meetings': return ['Title', 'Meeting Link', 'Date', 'Actions'];
      case 'notes': return ['Title', 'Content', 'Attachment', 'Actions'];
      case 'notices': return ['Title', 'Message', 'Actions'];
      case 'tasks': return ['Title', 'Description', 'Deadline', 'Actions'];
      default: return [];
    }
  };

  const renderActions = (item) => (
    <td className="data-table-actions">
      <button type="button" className="data-table-btn edit" onClick={() => onEdit(item)}>Edit</button>
      <button type="button" className="data-table-btn delete" onClick={() => onDelete(item._id)}>Delete</button>
    </td>
  );

  const renderRow = (item) => {
    switch (section) {
      case 'meetings':
        return (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td><a className="data-table-link" href={item.meetingLink} target="_blank" rel="noreferrer">Join Meeting</a></td>
            <td>{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : '—'}</td>
            {renderActions(item)}
          </tr>
        );
      case 'notes':
        return (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td>{item.content || '—'}</td>
            <td>{item.attachmentLink ? <a className="data-table-link" href={item.attachmentLink} target="_blank" rel="noreferrer">View</a> : '—'}</td>
            {renderActions(item)}
          </tr>
        );
      case 'notices':
        return (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td>{item.message}</td>
            {renderActions(item)}
          </tr>
        );
      case 'tasks':
        return (
          <tr key={item._id}>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{item.deadline || '—'}</td>
            {renderActions(item)}
          </tr>
        );
      default:
        return null;
    }
  };

  if (!items?.length) {
    return <div className="data-table-empty">No {section} available yet.</div>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {renderHeader().map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{items.map(renderRow)}</tbody>
      </table>
    </div>
  );
};

export default DataTable;
