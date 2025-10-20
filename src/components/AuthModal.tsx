// components/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { X, User, Eye, EyeOff, Zap } from 'lucide-react';
import { authService } from '../services/auth';
import { LoginRequest, SignupRequest } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState<SignupRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetForms = () => {
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateSignup = (): boolean => {
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(loginData);
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        onAuthSuccess();
        handleClose();
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignup()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...userData } = signupData;
      const response = await authService.signup(userData);
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        onAuthSuccess();
        handleClose();
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-black/20 w-full max-w-lg transform transition-all duration-500 scale-100">
        {/* Header */}
        <div className="relative p-8 pb-0">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 hover:bg-white/70 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 border border-white/40 shadow-lg shadow-black/5"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            
            <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            
            <p className="text-gray-600 font-medium">
              {mode === 'login' 
                ? 'Sign in to access your dashboard' 
                : ''
              }
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center px-8 pt-6">
          <div className="relative bg-white/50 backdrop-blur-lg rounded-2xl p-1.5 shadow-lg shadow-black/5 border border-white/40">
            <div className="relative flex">
              <div className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-all duration-500 ease-out ${
                mode === 'login' ? 'left-1 w-[calc(50%-0.25rem)]' : 'left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]'
              }`} />
              
              <button
                onClick={() => setMode('login')}
                className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 z-10 min-w-[120px] justify-center text-sm ${
                  mode === 'login' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4" />
                Login
              </button>
              
              <button
                onClick={() => setMode('signup')}
                className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 z-10 min-w-[120px] justify-center text-sm ${
                  mode === 'signup' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 font-medium text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            {mode === 'signup' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  
                  <input
                    type="text"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-4 pr-6 py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-medium placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={mode === 'login' ? loginData.email : signupData.email}
                  onChange={mode === 'login' ? handleLoginChange : handleSignupChange}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-6 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-medium placeholder-gray-400"
                />
              </div>
            </div>

{mode === 'login' ? (
  /* Login Mode - Single full width password field */
  <div className="mb-6 w-full">
    <label className="block text-sm font-bold text-gray-700 mb-2">
      Password
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={loginData.password}
        onChange={handleLoginChange}
        required
        placeholder="Enter your password"
        minLength={6}
        className="w-full pl-6 pr-6 py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-medium placeholder-gray-400"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
) : (
  /* Signup Mode - Two columns for password and confirm password */
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={signupData.password}
          onChange={handleSignupChange}
          required
          placeholder="Enter password"
          minLength={6}
          className="w-full pl-6 pr-6 py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-medium placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Confirm Password
      </label>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={signupData.confirmPassword}
          onChange={handleSignupChange}
          required
          placeholder="Confirm password"
          minLength={6}
          className="w-full pl-6 pr-6 py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-medium placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  </div>
)}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;