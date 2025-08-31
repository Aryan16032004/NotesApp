

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignupLogin from './pages/SignupLogin';
import Welcome from './pages/Welcome';
import Notes from './pages/Notes';
import './App.css';

const Navbar: React.FC = () => (
  <nav style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: 10, background: '#f5f5f5' }}>
    <Link to="/auth">Signup/Login</Link>
    <Link to="/welcome">Welcome</Link>
    <Link to="/notes">Notes</Link>
  </nav>
);

const Home: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: 40 }}>
    <h1>Notes App</h1>
    <p>Welcome! Please <Link to="/auth">Signup/Login</Link> to get started.</p>
    <img src="/vite.svg" alt="logo" style={{ width: 80, margin: 20 }} />
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<SignupLogin />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/notes" element={<Notes />} />
    </Routes>
  </BrowserRouter>
);

export default App;

