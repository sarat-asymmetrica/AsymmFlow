'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f1922 0%, #1a2832 50%, #243442 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle animated background particles */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#4a9b9f',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          textAlign: 'center',
          padding: '40px',
          maxWidth: '600px',
          width: '100%'
        }}
      >
        {/* AsymmFlow Logo Recreation */}
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ marginBottom: '40px' }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 200 200"
            style={{ margin: '0 auto' }}
          >
            {/* Pentagon container */}
            <g transform="translate(100, 100)">
              {/* Outer pentagon layers with transparency */}
              {[80, 70, 60].map((size, i) => (
                <polygon
                  key={i}
                  points={`0,-${size} ${size * 0.95},-${size * 0.31} ${size * 0.59},${size * 0.81} -${size * 0.59},${size * 0.81} -${size * 0.95},-${size * 0.31}`}
                  fill="none"
                  stroke="#4a9b9f"
                  strokeWidth="1"
                  opacity={0.3 - i * 0.08}
                />
              ))}
              
              {/* Golden spiral */}
              <motion.path
                d="M 0,0 Q -20,-20 -20,-40 T -40,-60 Q -30,-70 -10,-70 T 20,-50 Q 30,-30 20,-10 T 0,10 Q -10,15 -15,10 T -20,0 Q -15,-5 -10,-5 T 0,0"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
              </defs>
            </g>
          </svg>
        </motion.div>

        {/* AsymmFlow Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: '48px',
            fontWeight: '300',
            color: '#e8f4f5',
            marginBottom: '20px',
            letterSpacing: '8px',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}
        >
          AsymmFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            color: '#7a9ca0',
            fontSize: '16px',
            marginBottom: '50px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '400'
          }}
        >
          Intelligent Business Platform
        </motion.p>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.a
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '18px 50px',
              fontSize: '15px',
              fontWeight: '500',
              color: '#0f1922',
              background: 'linear-gradient(135deg, #4a9b9f 0%, #6ab5b9 100%)',
              borderRadius: '30px',
              textDecoration: 'none',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(74, 155, 159, 0.3)'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(74, 155, 159, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #6ab5b9 0%, #7ac5c9 100%)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(74, 155, 159, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #4a9b9f 0%, #6ab5b9 100%)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Enter
          </motion.a>
        </motion.div>

        {/* Subtle footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#3a4a52',
            fontSize: '12px',
            letterSpacing: '1px'
          }}
        >
          © 2025 PH Trading WLL
        </motion.p>
      </motion.div>
    </div>
  );
}