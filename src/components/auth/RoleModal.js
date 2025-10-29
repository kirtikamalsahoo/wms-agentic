'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import QRAuthModal from './QRAuthModal';

const RoleModal = ({ isOpen, onClose, role, onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQRAuth, setShowQRAuth] = useState(false);
  const [userAuthData, setUserAuthData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const canvasRef = useRef(null);

  // Generate QR code for user role when modal opens
  useEffect(() => {
    if (isOpen && role === 'user') {
      generateQRCode();
    } else if (!isOpen) {
      // Reset states when modal closes
      setShowQRAuth(false);
      setUserAuthData(null);
      setFormData({ username: '', password: '' });
      setError('');
      setQrCodeUrl('');
    }
  }, [isOpen, role]);

  const generateQRCode = async () => {
    try {
      const userData = { username: 'user', role: 'user' };
      const deployedUrl = 'https://wms-frontend-gbasfpandrfdcecz.canadacentral-01.azurewebsites.net/';
      const loginParams = new URLSearchParams({
        username: userData.username,
        role: userData.role,
        timestamp: Date.now(),
        sessionId: Math.random().toString(36).substring(2, 15),
        mobile: 'true'
      });
      
      const qrData = `${deployedUrl}?${loginParams.toString()}`;
      
      // Create a data URL for the image
      const url = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937', 
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };



  const roleConfig = {
    user: {
      title: 'User Login',
      subtitle: 'Login with credentials OR scan QR code with mobile device',
      icon: '🛍️',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-400/50',
      credentials: 'user / user'
    },
    manager: {
      title: 'Manager Login',
      subtitle: 'Manage inventory and view analytics',
      icon: '👨‍💼',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-600/20 to-emerald-600/20',
      borderColor: 'border-green-400/50',
      credentials: 'manager / manager'
    },
    admin: {
      title: 'Admin Login',
      subtitle: 'Full system access and user management',
      icon: '👑',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-400/50',
      credentials: 'admin / admin'
    }
  };

  const config = roleConfig[role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { username, password } = formData;
    
    // Trim whitespace and handle case sensitivity
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    let isValidCredentials = false;
    let actualUsername = username.trim();
    
    if (role === 'user' && cleanUsername === 'user' && cleanPassword === 'user') {
      isValidCredentials = true;
    } else if (role === 'admin' && cleanUsername === 'admin' && cleanPassword === 'admin') {
      isValidCredentials = true;
    } else if (role === 'manager') {
      if ((cleanUsername === 'manager' && cleanPassword === 'manager') || 
          (cleanUsername === 'chinmay' && cleanPassword === 'chinmay123')) {
        isValidCredentials = true;
      }
    }
    
    if (isValidCredentials) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      
      // Pass the actual username for proper display name mapping
      onLogin(role, actualUsername);
      onClose();
    } else {
      setError(`Invalid credentials for ${role} role`);
      setIsLoading(false);
    }
  };

  const handleQRClose = () => {
    setShowQRAuth(false);
    setUserAuthData(null);
  };

  const handleQRComplete = () => {
    setShowQRAuth(false);
    onLogin('user', 'user');
    onClose();
  };

  const handleQRLogin = () => {
    setUserAuthData({ username: 'user', role: 'user' });
    setShowQRAuth(true);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`backdrop-blur-xl bg-gradient-to-br ${config.bgColor} rounded-2xl border ${config.borderColor} p-8 shadow-2xl max-w-md w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${config.color} rounded-full mx-auto mb-4 flex items-center justify-center text-2xl`}>
              {config.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>
            <p className="text-gray-300 text-sm">{config.subtitle}</p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                placeholder={`Enter ${role} username`}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                placeholder={`Enter ${role} password`}
                required
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r ${config.color} text-white font-semibold rounded-xl 
                         hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                         transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                         ${role === 'user' ? 'relative overflow-hidden' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{`Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}</span>
                  {role === 'user' && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-lg"
                    >
                      🔑
                    </motion.span>
                  )}
                </div>
              )}
              
              {/* Shimmer effect for user role */}
              {role === 'user' && !isLoading && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              )}
            </motion.button>
          </form>

          {/* OR Divider for User Role */}
          {role === 'user' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center my-6"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="px-4 text-sm text-gray-400 bg-gray-800/50 rounded-full">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </motion.div>
          )}

          {/* QR Code Display for User Role */}
          {role === 'user' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">QR Code Login</h3>
                
                {/* QR Code */}
                <div className="bg-white rounded-lg p-3 inline-block mb-3">
                  {qrCodeUrl ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={qrCodeUrl}
                      alt="QR Code for Login"
                      className="w-48 h-48 mx-auto"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                
                {/* Instructions */}
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    Scan with your mobile device to login
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-4 border-t border-white/10 text-center"
          >
            <p className="text-gray-400 text-xs mb-2">Demo Credentials:</p>
            <div className="bg-white/5 rounded-lg p-2">
              <span className="text-gray-300 text-sm font-mono">{config.credentials}</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
        )}
      </AnimatePresence>

      {/* QR Authentication Modal for users */}
      <QRAuthModal 
        isOpen={showQRAuth}
        onClose={handleQRClose}
        onComplete={handleQRComplete}
        userData={userAuthData}
      />
    </>
  );
};

export default RoleModal;
