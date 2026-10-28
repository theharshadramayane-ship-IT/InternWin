import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/TrainerDashboard.css';

const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBatchId, setActiveBatchId] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [detailSection, setDetailSection] = useState('meetings');
  const [meetingLink, setMeetingLink] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState('Text');
  const [attachmentLink, setAttachmentLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('trainerUser');
    if (!storedUser) {
      alert('Please login first.');
      navigate('/');
      return;
    }

    const parsedTrainer = JSON.parse(storedUser);
    setTrainer(parsedTrainer);

    const fetchMyBatches = async () => {
      try {
        const trainerIdentifier = parsedTrainer.userId || parsedTrainer.trainerName || parsedTrainer.id;
        const res = await fetch(`http://localhost:5000/api/trainers/my-batches/${encodeURIComponent(trainerIdentifier)}`);
        const data = await res.json();
        if (data.success) {
          const list = data.data || [];
          setBatches(list);
          if (list[0]?._id) setActiveBatchId(list[0]._id);
        } else {
          setError(data.error || 'Batches could not be loaded.');
        }
      } catch (err) {
        setError('Backend server is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBatches();
  }, [navigate]);

  const activeBatch = batches.find((batch) => batch._id === activeBatchId) || batches[0] || null;

  useEffect(() => {
    if (activeBatch) {
      setMeetingLink(activeBatch.meetingLink || '');
    }
  }, [activeBatch]);

  const replaceBatchInState = (updatedProgram) => {
    if (!updatedProgram) return;
    setBatches((prev) => prev.map((batch) => (batch._id === updatedProgram._id ? updatedProgram : batch)));
  };

  const updateBatchActivity = async (endpoint, method, body) => {
    if (!activeBatch?._id) return null;
    try {
      const res = await fetch(`http://localhost:5000/api/programs/${activeBatch._id}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        replaceBatchInState(data.program);
        return data.program;
      }
      setError(data.message || 'Unable to update batch content.');
      return null;
    } catch (err) {
      console.error(err);
      setError('Backend server is unavailable.');
      return null;
    }
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });

  const handleSaveMeeting = async () => {
    await updateBatchActivity('/meeting-link', 'PUT', { meetingLink });
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline('');
    setEditingTaskId(null);
  };

  const handleTaskSubmit = async () => {
    if (!taskTitle.trim()) return;
    if (editingTaskId) {
      await updateBatchActivity(`/tasks/${editingTaskId}`, 'PUT', {
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline
      });
    } else {
      await updateBatchActivity('/tasks', 'POST', {
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline
      });
    }
    resetTaskForm();
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setTaskTitle(task.title || '');
    setTaskDescription(task.description || '');
    setTaskDeadline(task.deadline || '');
  };

  const handleDeleteTask = async (taskId) => {
    await updateBatchActivity(`/tasks/${taskId}`, 'DELETE');
  };

  const resetNoteForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteType('Text');
    setAttachmentLink('');
    setSelectedFile(null);
    setEditingNoteId(null);
  };

  const handleNoteSubmit = async () => {
    if (!noteTitle.trim()) return;

    let uploadedAttachmentLink = attachmentLink;
    let uploadedFileName = attachmentLink.split('/').pop() || noteTitle;

    if (selectedFile) {
      uploadedAttachmentLink = await readFileAsDataUrl(selectedFile);
      uploadedFileName = selectedFile.name;
    }

    const payload = {
      title: noteTitle,
      content: noteContent,
      type: noteType,
      attachmentLink: uploadedAttachmentLink,
      fileName: uploadedFileName
    };

    if (editingNoteId) {
      await updateBatchActivity(`/notes/${editingNoteId}`, 'PUT', payload);
    } else {
      await updateBatchActivity('/notes', 'POST', payload);
    }
    resetNoteForm();
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setNoteTitle(note.title || '');
    setNoteContent(note.content || '');
    setNoteType(note.type || 'Text');
    setAttachmentLink(note.attachmentLink || '');
    setSelectedFile(null);
  };

  const handleDeleteNote = async (noteId) => {
    await updateBatchActivity(`/notes/${noteId}`, 'DELETE');
  };

  const resetAnnouncementForm = () => {
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setEditingAnnouncementId(null);
  };

  const handleAnnouncementSubmit = async () => {
    if (!announcementTitle.trim()) return;
    if (editingAnnouncementId) {
      await updateBatchActivity(`/announcements/${editingAnnouncementId}`, 'PUT', {
        title: announcementTitle,
        message: announcementMessage
      });
    } else {
      await updateBatchActivity('/announcements', 'POST', {
        title: announcementTitle,
        message: announcementMessage
      });
    }
    resetAnnouncementForm();
  };

  const handleEditAnnouncement = (item) => {
    setEditingAnnouncementId(item._id);
    setAnnouncementTitle(item.title || '');
    setAnnouncementMessage(item.message || '');
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    await updateBatchActivity(`/announcements/${announcementId}`, 'DELETE');
  };

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    localStorage.removeItem('trainerUser');
    localStorage.removeItem('trainerName');
    navigate('/', { replace: true });
    window.location.reload();
  };

  const taskCount = activeBatch?.tasks?.length || 0;
  const noteCount = activeBatch?.notes?.length || 0;
  const noticeCount = activeBatch?.announcements?.length || 0;

  if (loading) return <div className="loading-state">Loading trainer dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>Sumago</h2>
          <p>Trainer Portal</p>
        </div>
        <div className="sidebar-userbox">
          <span>Signed in as</span>
          <strong>{trainer?.trainerName || 'Trainer'}</strong>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>Dashboard</button>
          <button className={`nav-link ${activeSection === 'programs' ? 'active' : ''}`} onClick={() => setActiveSection('programs')}>Training Program</button>
          <button className={`nav-link ${activeSection === 'logout' ? 'active' : ''}`} onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header-card">
          <div>
            <p className="eyebrow">trainer workspace</p>
            <h1 className="section-title">Manage your batches and learner resources</h1>
            <p className="muted-copy">Assign, update, and publish content for every batch you lead.</p>
          </div>
          <div className="header-chip">{batches.length} batch{batches.length === 1 ? '' : 'es'}</div>
        </div>

        {activeSection === 'dashboard' && (
          <div className="stats-grid">
            <section className="dashboard-card">
              <h3 className="sub-title">Dashboard</h3>
              <div className="metric-grid">
                <div className="metric-card"><span>Batches</span><strong>{batches.length}</strong></div>
                <div className="metric-card"><span>Tasks</span><strong>{taskCount}</strong></div>
                <div className="metric-card"><span>Notes</span><strong>{noteCount}</strong></div>
                <div className="metric-card"><span>Notices</span><strong>{noticeCount}</strong></div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'programs' && (
          <section className="dashboard-card">
            <div className="card-heading-row">
              <h2 className="section-title">Training Programs</h2>
              <span className="status-chip">Assigned to you</span>
            </div>
            <div className="program-grid">
              {batches.map((batch) => (
                <button key={batch._id} className={`program-card ${activeBatch?._id === batch._id ? 'active' : ''}`} onClick={() => { setActiveBatchId(batch._id); setDetailSection('meetings'); }}>
                  <strong>{batch.batchName}</strong>
                  <span>Timing: {batch.timing || 'Not set'}</span>
                </button>
              ))}
            </div>

            {activeBatch && (
              <div className="program-detail-card">
                <div className="card-heading-row">
                  <div>
                    <h3>{activeBatch.batchName}</h3>
                    <p className="muted-copy">{activeBatch.timing || 'Timing not set'}</p>
                  </div>
                </div>

                <div className="program-summary-grid">
                  <div className="summary-pill">Students: {(activeBatch.studentsEnrolled || []).length}</div>
                  <div className="summary-pill">Tasks: {activeBatch.tasks?.length || 0}</div>
                  <div className="summary-pill">Notes: {activeBatch.notes?.length || 0}</div>
                  <div className="summary-pill">Notices: {activeBatch.announcements?.length || 0}</div>
                </div>

                <div className="resource-card-grid">
                  <section className="resource-card">
                    <h4>Meeting Link</h4>
                    <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="Paste meeting join link" />
                    <button className="action-btn" onClick={handleSaveMeeting}>Upload Link</button>
                    {activeBatch?.meetingLink && <p><a href={activeBatch.meetingLink} target="_blank" rel="noreferrer">Open saved link</a></p>}
                  </section>

                  <section className="resource-card">
                    <h4>Tasks</h4>
                    <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" />
                    <input value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task description" />
                    <input value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} placeholder="Deadline" />
                    <button className="action-btn" onClick={handleTaskSubmit}>{editingTaskId ? 'Update Task' : 'Upload Task'}</button>
                    {editingTaskId && <button className="action-btn secondary" onClick={resetTaskForm}>Cancel</button>}
                    <table className="resource-table">
                      <thead>
                        <tr><th>Title</th><th>Description</th><th>Deadline</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {(activeBatch?.tasks || []).length ? (
                          (activeBatch?.tasks || []).map((task) => (
                            <tr key={task._id || task.title}>
                              <td>{task.title}</td>
                              <td>{task.description}</td>
                              <td>{task.deadline || '—'}</td>
                              <td>
                                <button className="text-btn" onClick={() => handleEditTask(task)}>Edit</button>
                                <button className="text-btn danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="empty-state">No tasks uploaded yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </section>

                  <section className="resource-card">
                    <h4>Notes</h4>
                    <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note title" />
                    <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Note content" />
                    <select value={noteType} onChange={(e) => setNoteType(e.target.value)}>
                      <option value="Text">Text</option>
                      <option value="PDF">PDF</option>
                      <option value="TXT">TXT</option>
                      <option value="Image">Image</option>
                    </select>
                    <input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    <input value={attachmentLink} onChange={(e) => setAttachmentLink(e.target.value)} placeholder="Attachment URL (optional)" />
                    <button className="action-btn" onClick={handleNoteSubmit}>{editingNoteId ? 'Update Note' : 'Upload Note'}</button>
                    {editingNoteId && <button className="action-btn secondary" onClick={resetNoteForm}>Cancel</button>}
                    <table className="resource-table">
                      <thead>
                        <tr><th>Title</th><th>Type</th><th>Attachment</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {(activeBatch?.notes || []).length ? (
                          (activeBatch?.notes || []).map((note) => (
                            <tr key={note._id || note.title}>
                              <td>{note.title}</td>
                              <td>{note.type || 'Text'}</td>
                              <td>{note.attachmentLink ? <a href={note.attachmentLink} target="_blank" rel="noreferrer">Open</a> : '—'}</td>
                              <td>
                                <button className="text-btn" onClick={() => handleEditNote(note)}>Edit</button>
                                <button className="text-btn danger" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="empty-state">No notes uploaded yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </section>

                  <section className="resource-card">
                    <h4>Notices</h4>
                    <input value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} placeholder="Notice title" />
                    <textarea value={announcementMessage} onChange={(e) => setAnnouncementMessage(e.target.value)} placeholder="Notice message" />
                    <button className="action-btn" onClick={handleAnnouncementSubmit}>{editingAnnouncementId ? 'Update Notice' : 'Upload Notice'}</button>
                    {editingAnnouncementId && <button className="action-btn secondary" onClick={resetAnnouncementForm}>Cancel</button>}
                    <table className="resource-table">
                      <thead>
                        <tr><th>Title</th><th>Message</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {(activeBatch?.announcements || []).length ? (
                          (activeBatch?.announcements || []).map((item) => (
                            <tr key={item._id || item.title}>
                              <td>{item.title}</td>
                              <td>{item.message}</td>
                              <td>
                                <button className="text-btn" onClick={() => handleEditAnnouncement(item)}>Edit</button>
                                <button className="text-btn danger" onClick={() => handleDeleteAnnouncement(item._id)}>Delete</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="3" className="empty-state">No notices uploaded yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </section>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default TrainerDashboard;