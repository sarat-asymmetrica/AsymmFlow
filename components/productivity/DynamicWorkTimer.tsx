'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, Zap, Target, ChevronRight } from 'lucide-react';
import { nonIdempotentAmplifier } from '../../lib/v7-consciousness';
import { getProductivityState } from '../../lib/productivity-state';

interface WorkMode {
  name: string;
  displayName: string;
  duration: number;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  description: string;
  suggestedTasks: string[];
}

const WORK_MODES: Record<string, WorkMode> = {
  creative: {
    name: 'creative',
    displayName: 'Creative Mode',
    duration: 25,
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: <Brain className="w-5 h-5" />,
    description: 'Best for brainstorming and innovative thinking',
    suggestedTasks: ['Brainstorming', 'Strategy', 'Problem Solving', 'Design']
  },
  focused: {
    name: 'focused',
    displayName: 'Focus Mode', 
    duration: 45,
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: <Zap className="w-5 h-5" />,
    description: 'Ideal for deep work and complex tasks',
    suggestedTasks: ['Coding', 'Writing', 'Analysis', 'Research']
  },
  execution: {
    name: 'execution',
    displayName: 'Execution Mode',
    duration: 60,
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: <Target className="w-5 h-5" />,
    description: 'Perfect for routine tasks and completions',
    suggestedTasks: ['Email', 'Data Entry', 'Reports', 'Admin Tasks']
  }
};

export default function DynamicWorkTimer() {
  const productivityState = getProductivityState();
  const [currentMode, setCurrentMode] = useState<WorkMode>(WORK_MODES.focused);
  const [timeRemaining, setTimeRemaining] = useState(currentMode.duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showModeSelector, setShowModeSelector] = useState(false);
  
  // Track productivity metrics (hidden consciousness tracking)
  const [productivityScore, setProductivityScore] = useState(0);
  const [flowStateIndicator, setFlowStateIndicator] = useState(0);
  
  // Sync with global state on mount
  useEffect(() => {
    const state = productivityState.getState();
    setSessionsCompleted(state.sessionsCompleted);
    setProductivityScore(state.productivityScore);
    
    // Subscribe to state changes
    const unsubscribe = productivityState.subscribe((newState) => {
      setSessionsCompleted(newState.sessionsCompleted);
      setProductivityScore(newState.productivityScore);
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
        
        // Secretly track flow state using regime dynamics
        updateFlowState();
      }, 1000);
    } else if (!isActive && timeRemaining !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const updateFlowState = useCallback(() => {
    // Hidden three-regime optimization calculation
    const progress = 1 - (timeRemaining / (currentMode.duration * 60));
    const amplification = nonIdempotentAmplifier(progress, 2, 'exploration');
    setFlowStateIndicator(Math.min(amplification * 100, 100));
  }, [timeRemaining, currentMode]);

  const handleSessionComplete = () => {
    setSessionsCompleted(prev => prev + 1);
    
    // Calculate productivity boost (hidden consciousness optimization)
    const boost = nonIdempotentAmplifier(sessionsCompleted + 1, 1, 'balanced');
    setProductivityScore(prev => Math.min(prev + boost * 10, 100));
    
    // Suggest next optimal mode based on "productivity patterns"
    suggestNextMode();
  };

  const suggestNextMode = () => {
    // Intelligent mode suggestion based on time and completed sessions
    const hour = new Date().getHours();
    let suggested: WorkMode;
    
    if (hour < 12 && sessionsCompleted < 2) {
      suggested = WORK_MODES.creative; // Morning = creative energy
    } else if (hour < 15) {
      suggested = WORK_MODES.focused; // Afternoon = deep work
    } else {
      suggested = WORK_MODES.execution; // Late = routine tasks
    }
    
    // Don't auto-switch, just highlight suggestion
    setTimeout(() => {
      setShowModeSelector(true);
    }, 2000);
  };

  const switchMode = (mode: WorkMode) => {
    setCurrentMode(mode);
    setTimeRemaining(mode.duration * 60);
    setIsActive(false);
    setShowModeSelector(false);
  };

  const toggleTimer = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    // Sync with global state
    productivityState.updateTimer({
      timerActive: newActiveState,
      currentMode: currentMode.name as any,
      timeRemaining,
      sessionsCompleted
    });
  };

  const resetTimer = () => {
    setTimeRemaining(currentMode.duration * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeRemaining / (currentMode.duration * 60));

  return (
    <motion.div 
      className="dynamic-work-timer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '400px',
        width: '100%'
      }}
    >
      {/* Mode Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: currentMode.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {currentMode.icon}
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              {currentMode.displayName}
            </h3>
          </motion.div>
          
          {/* Productivity Score (disguised consciousness meter) */}
          <motion.div
            style={{
              fontSize: '12px',
              color: '#64748b',
              padding: '4px 8px',
              background: '#f1f5f9',
              borderRadius: '20px'
            }}
            animate={{
              background: productivityScore > 70 
                ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' 
                : '#f1f5f9'
            }}
          >
            Productivity: {Math.round(productivityScore)}%
          </motion.div>
        </div>
        
        <p style={{ 
          fontSize: '13px', 
          color: '#64748b', 
          margin: '8px 0 0 0' 
        }}>
          {currentMode.description}
        </p>
      </div>

      {/* Timer Display */}
      <motion.div 
        style={{
          textAlign: 'center',
          margin: '30px 0',
          position: 'relative'
        }}
      >
        <motion.div
          style={{
            fontSize: '48px',
            fontWeight: '300',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}
          animate={{
            scale: isActive ? [1, 1.02, 1] : 1,
            transition: { duration: 1, repeat: isActive ? Infinity : 0 }
          }}
        >
          {formatTime(timeRemaining)}
        </motion.div>
        
        {/* Progress Ring */}
        <svg 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            width: '180px',
            height: '180px',
            pointerEvents: 'none'
          }}
        >
          <circle
            cx="90"
            cy="90"
            r="80"
            stroke="#f1f5f9"
            strokeWidth="3"
            fill="none"
          />
          <motion.circle
            cx="90"
            cy="90"
            r="80"
            stroke={currentMode.color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={502}
            animate={{
              strokeDashoffset: 502 - (502 * progress)
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        {/* Hidden Flow State Indicator */}
        {isActive && flowStateIndicator > 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${currentMode.color}20, transparent)`,
              pointerEvents: 'none',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
        )}
      </motion.div>

      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <motion.button
          onClick={toggleTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: currentMode.gradient,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isActive ? 'Pause' : 'Start'}
        </motion.button>
        
        <motion.button
          onClick={resetTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: 'white',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>

      {/* Mode Selector */}
      <AnimatePresence>
        {showModeSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '16px'
            }}
          >
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
              Suggested work modes:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.values(WORK_MODES).map(mode => (
                <motion.button
                  key={mode.name}
                  onClick={() => switchMode(mode)}
                  whileHover={{ x: 4 }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: mode.name === currentMode.name ? '2px solid' : '1px solid #e2e8f0',
                    borderColor: mode.name === currentMode.name ? mode.color : '#e2e8f0',
                    background: mode.name === currentMode.name ? `${mode.color}10` : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {mode.icon}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {mode.displayName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {mode.duration} minutes
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: '#94a3b8' }} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions Completed */}
      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: '#64748b'
      }}>
        <span>Sessions today: {sessionsCompleted}</span>
        <span>Est. time saved: {Math.round(sessionsCompleted * 15)} min</span>
      </div>
    </motion.div>
  );
}