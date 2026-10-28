import React, { useState } from 'react';
import './assets/Login.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password: password.trim() })
      });

      const data = await response.json();

          if (data.success) {
        alert(`Login Successful! Welcome ${data.student.name} 🚀`);

        localStorage.setItem('studentName', data.student.name);
        localStorage.setItem('studentData', JSON.stringify(data.student));
        localStorage.setItem('token', data.token || '');

        const encodedStudent = encodeURIComponent(JSON.stringify(data.student));
        const encodedToken = encodeURIComponent(data.token || '');
        window.open(`http://localhost:5175/?student=${encodedStudent}&token=${encodedToken}`, '_blank', 'noopener,noreferrer');

        setUserId('');
        setPassword('');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-Form">
      <h2 className="Login-Form-Heading">InternWin</h2>
      
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form className="Login-Form-Main" onSubmit={handleSubmit}>
        <label className="Login-Form-Label">Enter your UserID</label>
        <input
          className="Login-Form-Input"
          type="text"
          placeholder="Enter your 8-digit system User ID"
          maxLength="8"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        /><br />

        <label className="Login-Form-Label">Password : </label>
        <input
          className="Login-Form-Input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />

        <button className="Login-Form-Button" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Student Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;