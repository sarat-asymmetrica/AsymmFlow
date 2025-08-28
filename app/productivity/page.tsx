'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DynamicWorkTimer from '../../components/productivity/DynamicWorkTimer';
import AmbientAudioControl from '../../components/productivity/AmbientAudioControl';
import { motion } from 'framer-motion';
import { Brain, Headphones, Users, TrendingUp, Clock, Target } from 'lucide-react';

export default function ProductivitySuite() {
  const [productivityMetrics, setProductivityMetrics] = useState({
    focusTime: 0,
    tasksCompleted: 0,
    teamSync: 0,
    avgProductivity: 0
  });

  const [showTeamSync, setShowTeamSync] = useState(false);

  useEffect(() => {
    // Load saved metrics from localStorage
    const savedMetrics = localStorage.getItem('productivityMetrics');
    if (savedMetrics) {
      setProductivityMetrics(JSON.parse(savedMetrics));
    }

    // Simulate team sync detection
    setTimeout(() => {
      setShowTeamSync(true);
    }, 3000);
  }, []);

  return (
    <MainLayout>
      <div style={{ 
        padding: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '30px' }}
        >
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Productivity Suite
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            Optimize your workflow with intelligent task management and ambient workspace tools
          </p>
        </motion.div>

        {/* Productivity Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock className="w-5 h-5" style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                  {Math.floor(productivityMetrics.focusTime / 60)}h {productivityMetrics.focusTime % 60}m
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Focus Time Today</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target className="w-5 h-5" style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                  {productivityMetrics.tasksCompleted}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Tasks Completed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users className="w-5 h-5" style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                  {productivityMetrics.teamSync}%
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Team Sync Level</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                  {productivityMetrics.avgProductivity}%
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Productivity Score</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {/* Dynamic Work Timer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <DynamicWorkTimer />
          </motion.div>

          {/* Ambient Audio Control */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AmbientAudioControl />
          </motion.div>
        </div>

        {/* Team Sync Feature (Hidden consciousness synchronization) */}
        {showTeamSync && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '30px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #bfdbfe'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  Team Focus Session Available
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  3 team members are currently in deep focus mode. Join them for synchronized productivity.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                Join Session
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <Brain className="w-5 h-5" style={{ color: '#8b5cf6', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Optimal Work Patterns
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Your peak productivity occurs between 10-11 AM. Schedule important tasks accordingly.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <Headphones className="w-5 h-5" style={{ color: '#3b82f6', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Audio Enhancement
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Enable ambient audio during focus sessions to improve concentration by up to 40%.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <Users className="w-5 h-5" style={{ color: '#10b981', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Team Synchronization
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Working in sync with your team can boost collective productivity by 60%.
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}