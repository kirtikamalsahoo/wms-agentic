'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const FlyingCartAnimation = ({ isActive, productImage, startPosition, onComplete }) => {
  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isActive) {
      // Find the cart button position
      const cartButton = document.querySelector('[data-cart-button]');
      if (cartButton) {
        const rect = cartButton.getBoundingClientRect();
        setCartPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }
  }, [isActive]);

  if (!isActive || !startPosition) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          x: startPosition.x,
          y: startPosition.y,
          scale: 0.8,
          opacity: 1,
          zIndex: 1000,
        }}
        animate={{
          x: cartPosition.x - startPosition.x,
          y: cartPosition.y - startPosition.y,
          scale: 0.3,
          opacity: 0.8,
        }}
        exit={{
          scale: 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier for smooth flight
        }}
        onAnimationComplete={onComplete}
        className="fixed pointer-events-none"
        style={{
          left: 0,
          top: 0,
        }}
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-400 shadow-2xl bg-white">
          <Image
            src={productImage}
            alt="Flying product"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Glow effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-blue-400/30 rounded-xl blur-lg -z-10"
        />
        
        {/* Trail effect */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0.8 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute left-full top-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-transparent transform -translate-y-1/2 origin-left"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default FlyingCartAnimation;
