import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import icon from '../assets/icon.png';
import container from '../assets/container.jpg'

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
      window.location.href = '/';
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
    <div className="min-w-screen min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen lg:min-h-auto relative">
        {/* Dotted border - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block absolute inset-6 xl:inset-8 border-blue-300 rounded-lg"></div>
        
        <div className="w-full max-w-sm relative z-10">
          {/* Header with HD Logo */}
          <div className="mb-6 md:mb-8 relative">
            <div className="flex items-center mb-6">
              <div className="absolute bottom-80 -left-60 flex items-center">
                <img className="w-6 h-6 mr-2" src={icon} alt="icon" />
                <span className='text-shadow-black font-bold text-1xl'>HD</span>
              </div>
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
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 bg-transparent transition-colors duration-200"
                placeholder="Enter your email"
              />
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
                    className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-900 bg-transparent pr-8 transition-colors duration-200"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOTP(!showOTP)}
                    className="absolute right-0 top-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                <a href="/signup" className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200">
                  Create one
                </a>
              </span>
            </div>
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          </div>
        </div>
      </div>

      {/* Right side - Background Image (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img 
          src={container} 
          alt="Background" 
          className="w-full h-full object-cover object-center absolute inset-0"
        />
      </div>
    </div>
  );
}