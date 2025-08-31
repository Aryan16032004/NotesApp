
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Welcome: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    // Get token from URL if present
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('token');
    if (token) localStorage.setItem('token', token);

    if (!token) window.location.href = '/auth';
    axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(() => window.location.href = '/auth');
  }, []);
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Welcome</h2>
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <a href="/notes">Go to Notes</a>
    </div>
  );
};

export default Welcome;
