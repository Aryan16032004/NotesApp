import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetOTP = async () => {
    setError('');
    setIsLoading(true);
    try {
      await axios.post(`${API}/auth/signup`, {
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        otp
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">HD</span>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h1>
            <p className="text-gray-500 text-sm">Sign up to enjoy the feature of HD</p>
          </div>

          {/* Form */}
          <div className="space-y-4 md:space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter your name"
              />
            </div>

            {/* Date of Birth Field */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter your email"
              />
            </div>

            {/* Get OTP Button */}
            {!otpSent ? (
              <button
                onClick={handleGetOTP}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    OTP *
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter OTP"
                  />
                </div>
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FcGoogle size={20} /> Sign up with Google
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-sm text-gray-500">
                Already have an account?{' '}
                <a href="/signin" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign In
                </a>
              </span>
            </div>
            {error && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>}
          </div>
        </div>
      </div>

      {/* Right side - Flowing Background */}
      <div className="w-full md:w-1/2 relative overflow-hidden min-h-[300px] md:min-h-auto">
        {/* Animated flowing background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          {/* Flowing wave animation */}
          <div className="absolute inset-0 opacity-20 wave-animation">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-blue-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 via-transparent to-transparent"></div>
        
        {/* Content for the right side (visible on desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center h-full relative z-10 p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Join Us!</h2>
          <p className="text-center max-w-md">Create an account to access all features and personalize your experience.</p>
        </div>
        
        {/* Mobile-only message */}
        <div className="md:hidden absolute bottom-4 left-0 right-0 text-center text-white z-10 px-4">
          <p>Create an account to access all features.</p>
        </div>
      </div>
    </div>
  );
}