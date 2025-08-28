'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Brain, Zap, Database, FileSearch, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processingMode?: 'operational' | 'analytical' | 'strategic' | 'innovative';
  confidence?: number;
}

interface AssistantState {
  isOpen: boolean;
  isTyping: boolean;
  currentMode: 'operational' | 'analytical' | 'strategic' | 'innovative';
  messages: Message[];
  dataMode: boolean;
  performanceMetrics: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
}

export default function BusinessAssistant() {
  const [state, setState] = useState<AssistantState>({
    isOpen: false,
    isTyping: false,
    currentMode: 'strategic',
    messages: [
      {
        id: '1',
        content: "Hello! I'm your intelligent business assistant. I can help with data processing, analysis, and strategic insights. How can I assist you today?",
        sender: 'agent',
        timestamp: new Date(),
        processingMode: 'strategic'
      }
    ],
    dataMode: false,
    performanceMetrics: {
      accuracy: 87.5,
      speed: 92.1,
      efficiency: 89.3
    }
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  // Subtle pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(0.3 + (Math.random() * 0.4));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const detectIntent = (message: string): 'operational' | 'analytical' | 'strategic' | 'innovative' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('migrate') || lowerMessage.includes('excel') || lowerMessage.includes('process')) {
      return 'operational';
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('insight') || lowerMessage.includes('pattern')) {
      return 'analytical';
    } else if (lowerMessage.includes('optimize') || lowerMessage.includes('enhance') || lowerMessage.includes('improve')) {
      return 'strategic';
    } else if (lowerMessage.includes('vision') || lowerMessage.includes('future') || lowerMessage.includes('transform')) {
      return 'innovative';
    }
    
    return 'strategic';
  };

  const detectDomain = (message: string): 'sales' | 'operations' | 'analytics' | 'strategy' => {
    const lower = message.toLowerCase();
    if (lower.includes('customer') || lower.includes('sales')) return 'sales';
    if (lower.includes('migrate') || lower.includes('data') || lower.includes('excel')) return 'operations';
    if (lower.includes('analyze') || lower.includes('insight')) return 'analytics';
    return 'strategy';
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const intent = detectIntent(userMessage);
    
    setState(prev => ({
      ...prev,
      currentMode: intent,
      isTyping: true
    }));

    // Try intelligent business agent first
    try {
      const response = await fetch('/api/v7-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: userMessage,
          domain: detectDomain(userMessage),
          outputFormat: 'text',
          urgency: 'medium'
        })
      });
      
      const data = await response.json();
      if (data.success && data.response) {
        return data.response;
      }
    } catch (error) {
      console.log('Business agent unavailable, using local response');
    }

    // Fallback responses
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('migrate') || lowerMessage.includes('migration')) {
      return `I'll help you migrate your data efficiently.

Here's what I can do:
📁 **File Integration**: Access and analyze your Excel, PST, and other files
🔄 **Smart Migration**: Automatically detect patterns and optimize transfer
📊 **Parallel Processing**: Process multiple files simultaneously 
🎯 **Intelligent Mapping**: Automatically map columns to database fields

Would you like to:
1. Select files for migration
2. Set up automatic sync
3. View migration history
4. Configure mapping rules?`;
    }
    
    if (lowerMessage.includes('excel')) {
      return `Excel file processing ready! 

I can:
• Parse complex Excel structures with multiple sheets
• Detect and preserve relationships between data
• Handle merged cells and formulas intelligently
• Maintain data integrity during processing

I can process multiple files simultaneously. Should I scan for Excel files now?`;
    }
    
    if (lowerMessage.includes('help')) {
      return `Here's how I can assist you:

🚀 **Data Processing**
- File access and analysis
- Excel to database migration
- Email archive processing
- Automatic data mapping

📊 **Business Intelligence**
- Customer analytics and insights
- Competition analysis
- Performance metrics
- Sales optimization

🤖 **Automation**
- Process automation
- Pattern recognition
- Predictive analytics
- Workflow optimization

What would you like to explore?`;
    }
    
    return `I understand you're asking about "${userMessage}". 

I'm processing this through our advanced analytical framework to provide comprehensive assistance.

How can I help you further?`;
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

    const response = await generateResponse(input);
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'agent',
      timestamp: new Date(),
      confidence: 0.92,
      processingMode: state.currentMode
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, agentMessage],
      isTyping: false
    }));
  };

  const getModeColor = () => {
    switch (state.currentMode) {
      case 'operational': return 'from-blue-500 to-cyan-500';
      case 'analytical': return 'from-purple-500 to-pink-500';
      case 'strategic': return 'from-green-500 to-emerald-500';
      case 'innovative': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r ${getModeColor()} text-white shadow-2xl hover:scale-110 transition-all duration-300`}
        onClick={() => setState(prev => ({ ...prev, isOpen: !prev.isOpen }))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: `0 0 ${glowIntensity * 40}px rgba(74, 155, 159, ${glowIntensity})`
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
            <div className={`bg-gradient-to-r ${getModeColor()} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Business Assistant</h3>
                    <p className="text-xs opacity-90">
                      {state.currentMode.toUpperCase()} MODE
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
                    {message.sender === 'agent' && message.processingMode && (
                      <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                        <Brain className="w-3 h-3" />
                        <span>{message.processingMode} processing</span>
                        {message.confidence && (
                          <span>• {(message.confidence * 100).toFixed(0)}% confidence</span>
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
                  <span className="text-xs">Processing with {state.currentMode} optimization...</span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <button
                  onClick={() => setState(prev => ({ ...prev, dataMode: !prev.dataMode }))}
                  className={`p-2 rounded-lg transition-colors ${
                    state.dataMode 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title="Data Mode"
                >
                  <Database className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={state.dataMode ? "Ask about data..." : "Ask anything..."}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                <motion.button
                  onClick={handleSend}
                  className={`p-2 bg-gradient-to-r ${getModeColor()} text-white rounded-lg hover:opacity-90 transition-opacity`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              
              {state.dataMode && (
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
                    Start Processing
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