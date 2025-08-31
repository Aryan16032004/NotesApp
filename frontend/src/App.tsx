

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import SignInForm from './pages/SignInForm';
import Dashboard from './pages/Dashboard';
import './App.css';



const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;

