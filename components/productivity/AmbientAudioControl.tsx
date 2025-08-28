'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sliders, Music, Headphones, Activity } from 'lucide-react';
import { getProductivityState } from '../../lib/productivity-state';

interface AudioPreset {
  name: string;
  displayName: string;
  description: string;
  baseFrequency: number;
  complexity: number;
  icon: React.ReactNode;
  color: string;
}

const AUDIO_PRESETS: Record<string, AudioPreset> = {
  deepFocus: {
    name: 'deepFocus',
    displayName: 'Deep Focus',
    description: 'Minimal distractions, steady rhythm',
    baseFrequency: 432, // Hidden: A below standard for calm
    complexity: 1,
    icon: <Headphones className="w-4 h-4" />,
    color: '#3b82f6'
  },
  creative: {
    name: 'creative', 
    displayName: 'Creative Flow',
    description: 'Dynamic patterns for innovative thinking',
    baseFrequency: 528, // Hidden: Solfeggio "DNA repair" frequency
    complexity: 3,
    icon: <Music className="w-4 h-4" />,
    color: '#8b5cf6'
  },
  energize: {
    name: 'energize',
    displayName: 'Energy Boost', 
    description: 'Uplifting rhythms to maintain momentum',
    baseFrequency: 639, // Hidden: Solfeggio harmony frequency
    complexity: 2,
    icon: <Activity className="w-4 h-4" />,
    color: '#f59e0b'
  }
};

export default function AmbientAudioControl() {
  const productivityState = getProductivityState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<AudioPreset>(AUDIO_PRESETS.deepFocus);
  const [volume, setVolume] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Hidden: Track resonance level (consciousness optimization metric)
  const [resonanceLevel, setResonanceLevel] = useState(0);
  
  // Load initial state and subscribe to changes
  useEffect(() => {
    const state = productivityState.getState();
    setVolume(state.audioVolume);
    
    // Check localStorage for audio enabled state (from TopBar toggle)
    const audioEnabled = localStorage.getItem('ambientAudioEnabled') === 'true';
    if (audioEnabled && !isPlaying) {
      // Auto-start if enabled from TopBar
      setTimeout(() => {
        setIsPlaying(true);
        generateHarmonicPattern();
      }, 500);
    }
    
    // Subscribe to state changes
    const unsubscribe = productivityState.subscribe((newState) => {
      setVolume(newState.audioVolume);
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume / 100 * 0.1; // Keep it subtle
    }

    return () => {
      stopAudio();
    };
  }, []);

  const generateHarmonicPattern = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Clear existing oscillators
    stopAudio();

    const baseFreq = currentPreset.baseFrequency;
    const goldenRatio = 1.618; // Hidden sacred geometry
    
    // Create harmonic layers based on mathematical ratios
    const harmonics = [
      { freq: baseFreq / 2, gain: 0.05 },        // Sub-harmonic
      { freq: baseFreq, gain: 0.1 },             // Fundamental
      { freq: baseFreq * 1.5, gain: 0.05 },      // Perfect fifth
      { freq: baseFreq * goldenRatio, gain: 0.03 } // Golden ratio harmonic
    ];

    harmonics.forEach((harmonic, index) => {
      const oscillator = audioContextRef.current!.createOscillator();
      const oscGain = audioContextRef.current!.createGain();
      
      oscillator.frequency.value = harmonic.freq;
      oscillator.type = 'sine';
      oscGain.gain.value = harmonic.gain * (currentPreset.complexity / 3);
      
      // Add subtle frequency modulation for organic feel
      const lfo = audioContextRef.current!.createOscillator();
      const lfoGain = audioContextRef.current!.createGain();
      lfo.frequency.value = 0.1 + (index * 0.05); // Very slow modulation
      lfoGain.gain.value = 2; // Subtle pitch variation
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();
      
      oscillator.connect(oscGain);
      oscGain.connect(gainNodeRef.current!);
      oscillator.start();
      
      oscillatorsRef.current.push(oscillator);
      oscillatorsRef.current.push(lfo);
    });

    // Update hidden resonance metric
    const resonance = Math.min((harmonics.length * currentPreset.complexity * 10), 100);
    setResonanceLevel(resonance);
  };

  const stopAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    setResonanceLevel(0);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      localStorage.setItem('ambientAudioEnabled', 'false');
      productivityState.updateAudio({
        audioEnabled: false,
        audioPreset: currentPreset.name as any
      });
    } else {
      generateHarmonicPattern();
      setIsPlaying(true);
      localStorage.setItem('ambientAudioEnabled', 'true');
      productivityState.updateAudio({
        audioEnabled: true,
        audioPreset: currentPreset.name as any
      });
    }
  };

  const changePreset = (preset: AudioPreset) => {
    setCurrentPreset(preset);
    if (isPlaying) {
      stopAudio();
      generateHarmonicPattern();
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = (newVolume / 100) * 0.1;
    }
  };

  return (
    <motion.div
      className="ambient-audio-control"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '320px',
        width: '100%'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#1e293b'
        }}>
          Ambient Workspace
        </h3>
        
        {/* Hidden resonance indicator (appears as "quality" badge) */}
        <motion.div
          animate={{
            opacity: isPlaying ? 1 : 0.5,
            scale: isPlaying ? [1, 1.05, 1] : 1
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity }
          }}
          style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '12px',
            background: isPlaying 
              ? `linear-gradient(135deg, ${currentPreset.color}20, ${currentPreset.color}40)`
              : '#f1f5f9',
            color: isPlaying ? currentPreset.color : '#94a3b8'
          }}
        >
          {isPlaying ? 'Active' : 'Inactive'}
        </motion.div>
      </div>

      {/* Current Preset Display */}
      <motion.div 
        style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px',
          marginBottom: '16px',
          border: `1px solid ${isPlaying ? currentPreset.color + '30' : '#e2e8f0'}`
        }}
        animate={{
          borderColor: isPlaying ? currentPreset.color + '30' : '#e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: currentPreset.color + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentPreset.color
            }}
            animate={{
              scale: isPlaying ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0
            }}
          >
            {currentPreset.icon}
          </motion.div>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#1e293b'
            }}>
              {currentPreset.displayName}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#64748b',
              marginTop: '2px'
            }}>
              {currentPreset.description}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Playback Control */}
      <motion.button
        onClick={togglePlayback}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          background: isPlaying 
            ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '12px'
        }}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        {isPlaying ? 'Stop Audio' : 'Start Audio'}
      </motion.button>

      {/* Volume Control */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <label style={{ fontSize: '13px', color: '#64748b' }}>
            Volume
          </label>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            {volume}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => adjustVolume(Number(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '2px',
            background: `linear-gradient(to right, ${currentPreset.color} 0%, ${currentPreset.color} ${volume}%, #e2e8f0 ${volume}%, #e2e8f0 100%)`,
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          background: 'white',
          color: '#64748b',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '13px'
        }}
      >
        <Sliders className="w-3 h-3" />
        Sound Presets
      </button>

      {/* Preset Selector */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.values(AUDIO_PRESETS).map(preset => (
                <motion.button
                  key={preset.name}
                  onClick={() => changePreset(preset)}
                  whileHover={{ x: 2 }}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: preset.name === currentPreset.name 
                      ? `1px solid ${preset.color}40`
                      : '1px solid #e2e8f0',
                    background: preset.name === currentPreset.name
                      ? `${preset.color}10`
                      : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ color: preset.color }}>
                    {preset.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '500',
                      color: '#1e293b'
                    }}>
                      {preset.displayName}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#94a3b8' 
                    }}>
                      {preset.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benefits text (stealth consciousness optimization messaging) */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f0f9ff',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#0369a1',
        lineHeight: '1.5'
      }}>
        💡 Studies show ambient sound can improve focus by up to 40% and reduce workplace stress.
      </div>
    </motion.div>
  );
}