'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

const QRAuthModal = ({ isOpen, onClose, onComplete, userData }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef(null);

  const generateQRCode = useCallback(async () => {
    try {
      // Create a direct URL to the deployed WMS application with user login
      const deployedUrl = 'https://wms-agentic-frontend-a2dvdjgwfybre2g8.canadacentral-01.azurewebsites.net/';
      const loginParams = new URLSearchParams({
        username: userData.username,
        role: userData.role,
        timestamp: Date.now(),
        sessionId: Math.random().toString(36).substring(2, 15),
        mobile: 'true'
      });
      
      const qrData = `${deployedUrl}?${loginParams.toString()}`;
      
      // Generate QR code with custom styling
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, qrData, {
          width: 280,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });
      }
      
      // Also create a data URL for the image
      const url = await QRCode.toDataURL(qrData, {
        width: 280,
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
  }, [userData]);

  const startTimer = useCallback(() => {
    setTimeLeft(10);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (isOpen && userData) {
      generateQRCode();
      startTimer();
    }
  }, [isOpen, userData, generateQRCode, startTimer]);

  const handleComplete = () => {
    setIsScanning(true);
    setTimeout(() => {
      onComplete();
      setIsScanning(false);
    }, 1000);
  };

  const handleScanSuccess = () => {
    setIsScanning(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl max-w-lg w-full relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 relative z-10"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30"
            >
              📱
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">Mobile Login</h2>
            <p className="text-blue-200 text-lg">Scan QR code with your mobile device</p>
          </motion.div>

          {/* QR Code Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative">
              {/* QR Code Background with glow effect */}
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(59, 130, 246, 0.5)",
                    "0 0 50px rgba(34, 211, 238, 0.7)",
                    "0 0 30px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white p-6 rounded-3xl shadow-2xl"
              >
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{ imageRendering: 'pixelated' }}
                />
              </motion.div>

              {/* Scanning overlay effect */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-6xl text-green-400"
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
            </div>

            {/* Timer and Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity 
                  }}
                  className="w-4 h-4 bg-blue-400 rounded-full"
                ></motion.div>
                <span className="text-2xl font-bold text-white">
                  {timeLeft}s
                </span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                    delay: 0.5
                  }}
                  className="w-4 h-4 bg-cyan-400 rounded-full"
                ></motion.div>
              </div>
              
              <div className="space-y-2 text-blue-200">
                <p className="font-medium">📲 Open your camera app</p>
                <p className="font-medium">🎯 Point at the QR code</p>
                <p className="font-medium">🚀 Instant access to WMS!</p>
              </div>
            </motion.div>

            {/* Manual Login Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={handleScanSuccess}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:border-white/40 transition-all duration-300"
            >
              ✓ Simulate Scan Success
            </motion.button>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 relative z-10"
          >
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRAuthModal;
