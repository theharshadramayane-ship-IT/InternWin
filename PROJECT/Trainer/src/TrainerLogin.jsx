import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/TrainerLogin.css'

const TrainerLogin = () => {
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('trainerUser')) {
      navigate('/trainer/training', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // 🎯 FRONTEND VALIDATION CHECKS (API hit hone se pehle)
  if (!credentials.userId.trim() || !credentials.password.trim()) {
    setError('User ID aur Password dono bharna zaroori hai!');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch('http://localhost:5000/api/trainers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('trainerUser', JSON.stringify(data.trainer));
      alert(`Swagat hai, ${data.trainer.trainerName} Sir! 👋`);
      navigate('/trainer/training');
    } else {
      // 🎯 Backend se jo exact unique validation message aayega (like "Incorrect password"), wo yahan dikhega
      setError(data.error || 'Invalid credentials provided.');
    }
  } catch (err) {
    setError('Server network connectivity issues.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="trainer-login-wrapper">
      <div className="trainer-login-card">
        <h2>Trainer Portal</h2>
        <p className="subtitle">Please LogIn</p>
        
        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="login-form-group">
            <label>User ID</label>
            <input type="text" name="userId" value={credentials.userId} onChange={handleChange} placeholder="Enter your Login ID" required />
          </div>
          
          <div className="login-form-group">
            <label>Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          
          <button type="submit" disabled={loading} className="btn-trainer-login">
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerLogin;