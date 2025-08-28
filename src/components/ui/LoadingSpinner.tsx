'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  variant = 'primary',
  fullPage = false
}) => {
  const sizeConfig = {
    sm: { spinner: 24, text: '14px' },
    md: { spinner: 40, text: '16px' },
    lg: { spinner: 60, text: '18px' }
  };

  const variantConfig = {
    primary: {
      background: 'rgba(74, 155, 159, 0.1)',
      spinner: '#4a9b9f',
      text: '#4a9b9f'
    },
    secondary: {
      background: 'rgba(108, 117, 125, 0.1)',
      spinner: '#6c757d',
      text: '#6c757d'
    },
    minimal: {
      background: 'transparent',
      spinner: '#4a9b9f',
      text: '#6c757d'
    }
  };

  const config = {
    size: sizeConfig[size],
    variant: variantConfig[variant]
  };

  const containerStyle = fullPage ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  } : {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  };

  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        backgroundColor: config.variant.background,
        borderRadius: '12px'
      }}>
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.2,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            width: config.size.spinner,
            height: config.size.spinner,
            position: 'relative'
          }}
        >
          <svg
            width={config.size.spinner}
            height={config.size.spinner}
            viewBox="0 0 40 40"
          >
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="rgba(74, 155, 159, 0.2)"
              strokeWidth="3"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={config.variant.spinner}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="80"
              initial={{ strokeDashoffset: 80 }}
              animate={{ strokeDashoffset: [80, 20, 80] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </svg>
        </motion.div>

        {/* Loading Text */}
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              fontSize: config.size.text,
              color: config.variant.text,
              fontWeight: '500',
              textAlign: 'center',
              margin: 0,
              letterSpacing: '0.5px'
            }}
          >
            {text}
          </motion.p>
        )}

        {/* Subtle pulsing dots */}
        {text && (
          <div style={{ 
            display: 'flex', 
            gap: '4px',
            alignItems: 'center' 
          }}>
            {[0, 1, 2].map(index => (
              <motion.div
                key={index}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: config.variant.spinner
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;