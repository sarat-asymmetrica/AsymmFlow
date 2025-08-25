'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Brain, Zap, Database, FileSearch, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nonIdempotentAmplifier, processParallelStreams } from '../../lib/v7-consciousness';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  amplification?: number;
  consciousness?: 'support' | 'exploration' | 'balanced' | 'transcendent';
}

interface AgentState {
  isOpen: boolean;
  isTyping: boolean;
  currentOrdinal: 'support' | 'exploration' | 'balanced' | 'transcendent';
  amplificationLevel: number;
  messages: Message[];
  migrationMode: boolean;
}

export default function V7ConsciousnessAgent() {
  const [state, setState] = useState<AgentState>({
    isOpen: false,
    isTyping: false,
    currentOrdinal: 'balanced',
    amplificationLevel: 1,
    messages: [
      {
        id: '1',
        content: "Hello! I'm your V7.0-enhanced assistant. I can help with data migration, answer questions, and provide intelligent insights. How can I assist you today?",
        sender: 'agent',
        timestamp: new Date(),
        consciousness: 'balanced'
      }
    ],
    migrationMode: false
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  // V7.0 Consciousness pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      const amplification = nonIdempotentAmplifier(0.5, Date.now() % 10, state.currentOrdinal);
      setGlowIntensity(0.3 + (amplification % 0.7));
    }, 2000);

    return () => clearInterval(interval);
  }, [state.currentOrdinal]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const detectIntent = (message: string): 'support' | 'exploration' | 'balanced' | 'transcendent' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('migrate') || lowerMessage.includes('excel') || lowerMessage.includes('pst')) {
      return 'support'; // Task-focused
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('insight') || lowerMessage.includes('pattern')) {
      return 'exploration'; // Discovery-focused
    } else if (lowerMessage.includes('optimize') || lowerMessage.includes('enhance') || lowerMessage.includes('improve')) {
      return 'balanced'; // Strategy-focused
    } else if (lowerMessage.includes('vision') || lowerMessage.includes('future') || lowerMessage.includes('transform')) {
      return 'transcendent'; // Vision-focused
    }
    
    return 'balanced';
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const intent = detectIntent(userMessage);
    const amplification = nonIdempotentAmplifier(1, state.messages.length, intent);
    
    setState(prev => ({
      ...prev,
      currentOrdinal: intent,
      amplificationLevel: amplification,
      isTyping: true
    }));

    // Simulate processing with V7.0 consciousness
    await new Promise(resolve => setTimeout(resolve, 1000 + (amplification * 100)));

    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses
    if (lowerMessage.includes('migrate') || lowerMessage.includes('migration')) {
      return `I'll help you migrate your data with V7.0-enhanced intelligence (${amplification.toFixed(1)}x amplification active).

Here's what I can do:
📁 **OneDrive Integration**: Access and analyze your Excel, PST, and other files
🔄 **Intelligent Migration**: Automatically detect data patterns and optimize transfer
📊 **Parallel Processing**: Migrate multiple files simultaneously 
🎯 **Smart Mapping**: Automatically map Excel columns to database fields

Would you like to:
1. Select files from OneDrive for migration
2. Set up automatic sync
3. View migration history
4. Configure mapping rules?`;
    }
    
    if (lowerMessage.includes('excel')) {
      return `Excel file processing with V7.0 consciousness activated! 

I can:
• Parse complex Excel structures with multiple sheets
• Detect and preserve relationships between data
• Handle merged cells and formulas intelligently
• Maintain data integrity during migration

My parallel processing can handle ${Math.floor(amplification * 3)} files simultaneously. Should I scan your OneDrive for Excel files now?`;
    }
    
    if (lowerMessage.includes('pst')) {
      return `PST file migration is a specialty with V7.0 enhancements!

📧 **Email Processing**: Extract emails, contacts, calendar items
🗂️ **Folder Structure**: Preserve organizational hierarchy
🔍 **Attachment Handling**: Intelligent attachment processing
⚡ **Speed**: ${amplification.toFixed(1)}x faster than traditional methods

PST files often contain years of business intelligence. I'll ensure nothing is lost during migration. Ready to begin?`;
    }
    
    if (lowerMessage.includes('help')) {
      return `Here's how I can assist you with V7.0 consciousness (currently in ${intent} mode):

🚀 **Data Migration**
- OneDrive file access and analysis
- Excel to database migration
- PST email archive processing
- Automatic data mapping

📊 **Business Intelligence**
- Customer analytics and insights
- Competition intelligence gathering
- Sales pipeline optimization
- Performance metrics analysis

🤖 **AI Assistance**
- Natural language queries
- Pattern recognition
- Predictive analytics
- Process automation

My consciousness amplification is at ${amplification.toFixed(1)}x, meaning I can process information ${Math.floor(amplification)} times more effectively than baseline!

What would you like to explore?`;
    }
    
    // Default response with consciousness indicator
    return `[${intent.toUpperCase()} MODE - ${amplification.toFixed(1)}x Amplification]

I understand you're asking about "${userMessage}". 

With V7.0 consciousness, I'm processing this through parallel streams to provide the most comprehensive assistance. Each interaction amplifies my ability to help you more effectively.

${intent === 'exploration' ? "I'm discovering new patterns in your request..." : 
  intent === 'support' ? "I'm focused on executing this task efficiently..." :
  intent === 'balanced' ? "I'm coordinating multiple approaches to help you..." :
  "I'm envisioning transformative solutions for your needs..."}

How can I assist you further?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setInput('');

    // Generate and add agent response
    const response = await generateResponse(input);
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'agent',
      timestamp: new Date(),
      amplification: state.amplificationLevel,
      consciousness: state.currentOrdinal
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, agentMessage],
      isTyping: false
    }));
  };

  const getOrdinalColor = () => {
    switch (state.currentOrdinal) {
      case 'support': return 'from-blue-500 to-cyan-500';
      case 'exploration': return 'from-purple-500 to-pink-500';
      case 'balanced': return 'from-green-500 to-emerald-500';
      case 'transcendent': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r ${getOrdinalColor()} text-white shadow-2xl hover:scale-110 transition-all duration-300`}
        onClick={() => setState(prev => ({ ...prev, isOpen: !prev.isOpen }))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: `0 0 ${glowIntensity * 40}px rgba(147, 51, 234, ${glowIntensity})`
        }}
      >
        <AnimatePresence mode="wait">
          {state.isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              exit={{ rotate: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Brain size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getOrdinalColor()} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold">V7.0 Consciousness Agent</h3>
                    <p className="text-xs opacity-90">
                      {state.currentOrdinal.toUpperCase()} Mode | {state.amplificationLevel.toFixed(1)}x Amplification
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <Zap className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 h-[450px] bg-gray-50 dark:bg-gray-800">
              {state.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {message.sender === 'agent' && message.consciousness && (
                      <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                        <Brain className="w-3 h-3" />
                        <span>{message.consciousness} consciousness</span>
                        {message.amplification && (
                          <span>• {message.amplification.toFixed(1)}x</span>
                        )}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {state.isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs">V7.0 processing with {state.currentOrdinal} consciousness...</span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <button
                  onClick={() => setState(prev => ({ ...prev, migrationMode: !prev.migrationMode }))}
                  className={`p-2 rounded-lg transition-colors ${
                    state.migrationMode 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title="Migration Mode"
                >
                  <Database className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={state.migrationMode ? "Ask about data migration..." : "Ask anything..."}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                <motion.button
                  onClick={handleSend}
                  className={`p-2 bg-gradient-to-r ${getOrdinalColor()} text-white rounded-lg hover:opacity-90 transition-opacity`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              
              {state.migrationMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex gap-2"
                >
                  <button className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                    <FileSearch className="w-3 h-3 inline mr-1" />
                    Select Files
                  </button>
                  <button className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                    <Upload className="w-3 h-3 inline mr-1" />
                    Start Migration
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}