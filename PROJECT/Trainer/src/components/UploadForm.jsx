import React, { useEffect, useState } from 'react';
import '../assets/BatchDetail.css';

const UploadForm = ({ section, onUpload, editingItem, onCancelEdit }) => {
  const [values, setValues] = useState({
    title: '',
    message: '',
    content: '',
    meetingLink: '',
    deadline: '',
    attachmentLink: ''
  });

  useEffect(() => {
    if (!editingItem) {
      setValues({ title: '', message: '', content: '', meetingLink: '', deadline: '', attachmentLink: '' });
      return;
    }

    setValues({
      title: editingItem.title || '',
      message: editingItem.message || '',
      content: editingItem.content || editingItem.description || '',
      meetingLink: editingItem.meetingLink || '',
      deadline: editingItem.deadline || '',
      attachmentLink: editingItem.attachmentLink || ''
    });
  }, [editingItem, section]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let payload = { title: values.title };

    if (section === 'meetings') {
      payload = { title: values.title, meetingLink: values.meetingLink };
    } else if (section === 'notes') {
      payload = { title: values.title, content: values.content, attachmentLink: values.attachmentLink };
    } else if (section === 'notices') {
      payload = { title: values.title, message: values.message };
    } else if (section === 'tasks') {
      payload = { title: values.title, description: values.content, deadline: values.deadline };
    }

    onUpload(payload, editingItem?._id || null);
    if (!editingItem) {
      setValues({ title: '', message: '', content: '', meetingLink: '', deadline: '', attachmentLink: '' });
    }
  };

  const uploadLabel = section.slice(0, -1);

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="upload-form-row">
        <div className="upload-form-field">
          <label htmlFor="upload-title">Title</label>
          <input id="upload-title" name="title" value={values.title} onChange={handleChange} required />
        </div>
        {section === 'meetings' && (
          <div className="upload-form-field">
            <label htmlFor="upload-meeting-link">Meeting Link</label>
            <input id="upload-meeting-link" name="meetingLink" value={values.meetingLink} onChange={handleChange} required />
          </div>
        )}
        {section === 'tasks' && (
          <div className="upload-form-field">
            <label htmlFor="upload-deadline">Deadline</label>
            <input id="upload-deadline" name="deadline" value={values.deadline} onChange={handleChange} />
          </div>
        )}
      </div>

      {section === 'notes' && (
        <>
          <div className="upload-form-field">
            <label htmlFor="upload-content">Content</label>
            <textarea id="upload-content" name="content" value={values.content} onChange={handleChange} required />
          </div>
          <div className="upload-form-field">
            <label htmlFor="upload-attachment">Document / PDF Link</label>
            <input id="upload-attachment" name="attachmentLink" value={values.attachmentLink} onChange={handleChange} placeholder="Paste document or PDF URL" />
          </div>
        </>
      )}

      {section === 'notices' && (
        <div className="upload-form-field">
          <label htmlFor="upload-message">Message</label>
          <textarea id="upload-message" name="message" value={values.message} onChange={handleChange} required />
        </div>
      )}

      {section === 'tasks' && (
        <div className="upload-form-field">
          <label htmlFor="upload-description">Description</label>
          <textarea id="upload-description" name="content" value={values.content} onChange={handleChange} required />
        </div>
      )}

      <div className="upload-form-actions">
        <button type="submit" className="upload-form-button">
          {editingItem ? `Update ${uploadLabel.charAt(0).toUpperCase() + uploadLabel.slice(1)}` : `Upload ${uploadLabel.charAt(0).toUpperCase() + uploadLabel.slice(1)}`}
        </button>
        {editingItem && (
          <button type="button" className="upload-form-cancel" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default UploadForm;
