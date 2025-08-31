import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) window.location.href = '/';
    axios.get(`${API}/notes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotes(res.data.notes))
      .catch(() => setError('Failed to fetch notes'));
  }, []);

  const handleCreate = async () => {
    setError('');
    try {
      const res = await axios.post(`${API}/notes`, { content }, { headers: { Authorization: `Bearer ${token}` } });
      setNotes([...notes, res.data.note]);
      setContent('');
    } catch {
      setError('Failed to create note');
    }
  };

  const handleDelete = async (id: string) => {
    setError('');
    try {
      await axios.delete(`${API}/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(notes.filter(n => n._id !== id));
    } catch {
      setError('Failed to delete note');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Your Notes</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="New note" required />
        <button type="submit">Add Note</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            {note.content}
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Notes;
