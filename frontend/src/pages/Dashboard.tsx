import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Menu, Bell, Wifi, Battery, Signal } from 'lucide-react';
import axios from 'axios';

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
      {/* Mobile Status Bar - Only visible on mobile */}
      <div className="md:hidden bg-white px-4 py-2 flex justify-between items-center text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={14} />
        </div>
      </div>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">*</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">Dashboard</h1>
            </div>
            <button onClick={handleSignOut} className="text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors">Sign Out</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome, {user?.name || ''}!</h2>
          <p className="text-gray-600 text-sm">Email: {user?.email || ''}</p>
        </div>
        <div className="mb-6 flex gap-2 flex-col sm:flex-row">
          <input value={noteContent} onChange={e => setNoteContent(e.target.value)} className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" placeholder="Enter note content" />
          <button onClick={handleCreateNote} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2">
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
      <div className="hidden lg:block fixed top-0 left-0 w-64 h-full bg-white shadow-lg border-r border-gray-200 z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">*</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">HD</span>
          </div>
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-4 py-2 text-blue-500 bg-blue-50 rounded-lg font-medium">Dashboard</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Notes</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Settings</a>
          </nav>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 1024px) {
          main { margin-left: 16rem; }
          header { margin-left: 16rem; }
        }
      `}</style>
    </div>
  );
}
