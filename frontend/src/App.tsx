

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';
import Dashboard from './pages/Dashboard';
import './App.css';

const Navbar: React.FC = () => (
  <nav style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: 10, background: '#f5f5f5' }}>
    <Link to="/signup">Sign Up</Link>
    <Link to="/signin">Sign In</Link>
    <Link to="/dashboard">Dashboard</Link>
  </nav>
);

const Home: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: 40 }}>
    <h1>Notes App</h1>
    <p>Welcome! Please <Link to="/signup">Sign Up</Link> or <Link to="/signin">Sign In</Link> to get started.</p>
    <img src="/vite.svg" alt="logo" style={{ width: 80, margin: 20 }} />
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;

