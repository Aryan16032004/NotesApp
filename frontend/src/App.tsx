import { BrowserRouter, Routes, Route } from 'react-router-dom';


import React from 'react';
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

