import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Menu, Bell, Wifi, Battery, Signal } from 'lucide-react';
import axios from 'axios';
import icon from '../assets/icon.png';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get token from URL if present
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const token = urlToken || localStorage.getItem('token');
    if (urlToken) localStorage.setItem('token', urlToken);
    if (!token) window.location.href = '/signin';
    axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(() => window.location.href = '/signin');
    axios.get(`${API}/notes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotes(res.data.notes))
      .catch(() => setError('Failed to fetch notes'));
  }, []);

  const handleDeleteNote = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API}/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(notes.filter(note => note._id !== id));
    } catch {
      setError('Failed to delete note');
    }
  };

  const handleCreateNote = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API}/notes`, { content: noteContent }, { headers: { Authorization: `Bearer ${token}` } });
      setNotes([...notes, res.data.note]);
      setNoteContent('');
    } catch {
      setError('Failed to create note');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="ml-6 mr-6  md:mb-8 p-5 relative ml flex justify-between">
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <img className="w-6 h-6 mr-2" src={icon} alt="icon" />
              <span className='text-shadow-black font-bold text-xl'>HD</span>
            </div>
          </div>
          <div>
            <button onClick={handleSignOut} className="text-blue-500 hover:text-blue-600 hover:cursor-pointer font-medium text-2xl transition-colors">Sign Out</button>
          </div>
        </div>
       

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome, {user?.name || ''}!</h2>
          <p className="text-gray-600 text-sm">Email: {user?.email || ''}</p>
        </div>
        <div className="mb-6 flex gap-2 flex-col sm:flex-row">
          <input value={noteContent} onChange={e => setNoteContent(e.target.value)} className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" placeholder="Enter note content" />
          <button onClick={handleCreateNote} className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2">
            <Plus size={20} />
            <span>Create Note</span>
          </button>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
          {notes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                  <span className="text-gray-900 font-medium">{note.content}</span>
                  <button onClick={() => handleDeleteNote(note._id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label={`Delete note`}><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:hidden mt-12 flex justify-center">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </main>
      
    </div>
  );
}
