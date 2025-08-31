import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SignupLogin: React.FC = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [step, setStep] = useState<'signup' | 'otp' | 'login'>('signup');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError('');
    try {
      await axios.post(`${API}/auth/signup`, { name: form.name, email: form.email, password: form.password });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, { ...form });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/welcome';
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post(`${API}/auth/login`, { email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/welcome';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {step === 'signup' && (
        <form onSubmit={e => { e.preventDefault(); handleSignup(); }}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" /><br />
          <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" /><br />
          <button type="submit">Send OTP</button>
          <button type="button" onClick={() => setIsSignup(false)}>Switch to Login</button>
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={e => { e.preventDefault(); handleVerifyOtp(); }}>
          <input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} required /><br />
          <button type="submit">Verify OTP</button>
        </form>
      )}
      {(!isSignup || step === 'login') && (
        <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" /><br />
          <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" /><br />
          <button type="submit">Login</button>
          <button type="button" onClick={() => setIsSignup(true)}>Switch to Signup</button>
        </form>
      )}
      <hr />
      <button onClick={handleGoogle}>Login with Google</button>
    </div>
  );
};

export default SignupLogin;
