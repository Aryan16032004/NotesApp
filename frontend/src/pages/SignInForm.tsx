import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async () => {
    setError('');
    setIsLoading(true);
    try {
      await axios.post(`${API}/auth/signup`, { email: formData.email });
      setOtpSent(true);
      setError('OTP sent to your email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, { email: formData.email, otp: formData.otp });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed');
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
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-8 relative">
        {/* Dotted border - hidden on mobile, visible on desktop */}
        <div className="hidden md:block absolute inset-4 border-2 border-dashed border-blue-300 rounded-lg"></div>
        <div className="w-full max-w-sm relative z-10">
          {/* Header with HD Logo */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-sm font-bold">*</span>
              </div>
              <span className="text-blue-500 font-semibold text-lg">HD</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500 text-sm">Please login to continue to your account.</p>
          </div>

          {/* Form */}
          <div className="space-y-4 md:space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-xs text-blue-500 mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 bg-transparent"
                placeholder="Enter your email"
              />
              {/* Profile Avatar */}
              <div className="absolute right-0 top-6 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">R</span>
              </div>
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                onClick={handleSendOTP}
                disabled={isLoading || !formData.email}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            )}

            {/* OTP Field */}
            {otpSent && (
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type={showOTP ? "text" : "password"}
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 bg-transparent pr-8"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOTP(!showOTP)}
                    className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
                  >
                    {showOTP ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FcGoogle size={20} /> Sign in with Google
            </button>

            {/* Sign In Button */}
            {otpSent && (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            )}

            {/* Create Account Link */}
            <div className="text-center">
              <span className="text-sm text-gray-500">
                Need an account?{' '}
                <a href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                  Create one
                </a>
              </span>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
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
          <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center max-w-md">Sign in to access your notes and personalized features.</p>
        </div>
        
        {/* Mobile-only message */}
        <div className="md:hidden absolute bottom-4 left-0 right-0 text-center text-white z-10 px-4">
          <p>Sign in to access your notes.</p>
        </div>
      </div>
    </div>
  );
}