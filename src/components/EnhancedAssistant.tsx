'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, X, Send, Sparkles, Brain, Zap, 
  Paperclip, File, Image, FileText, Download,
  Maximize2, Minimize2, Settings, Search, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  content?: string;
  textPreview?: string;
  metadata?: any;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  attachments?: Attachment[];
  context?: 'business' | 'technical' | 'creative' | 'general' | 'analytical';
  confidence?: number;
  tools?: string[];
}

interface AssistantState {
  isOpen: boolean;
  isTyping: boolean;
  isExpanded: boolean;
  messages: Message[];
  attachments: Attachment[];
  contextMode: 'auto' | 'business' | 'technical' | 'creative' | 'general';
  showSettings: boolean;
  deepContextMode: boolean;
}

export default function EnhancedAssistant() {
  // Add glow animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glow {
        0% { 
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(147, 51, 234, 0.2), 0 0 60px rgba(6, 182, 212, 0.1); 
        }
        100% { 
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.5), 0 0 90px rgba(6, 182, 212, 0.3); 
        }
      }
      
      @keyframes consciousnessShimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
      }
      
      .consciousness-shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 200px 100%;
        animation: consciousnessShimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Auto-detect if we're in dashboard context for seamless business intelligence
  const isDashboardContext = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/dashboard') || 
     window.location.pathname.includes('/customers') ||
     window.location.pathname.includes('/orders') ||
     window.location.pathname.includes('/quotations') ||
     window.location.pathname.includes('/rfq') ||
     window.location.pathname.includes('/reports'));

  const [state, setState] = useState<AssistantState>({
    isOpen: false,
    isTyping: false,
    isExpanded: false,
    messages: [
      {
        id: '1',
        content: isDashboardContext 
          ? "Welcome to AsymmFlow! I'm Claude with enhanced business intelligence context active. I have comprehensive knowledge of the platform and advanced analytical capabilities. How can I help with your business operations today?"
          : "Welcome to AsymmFlow! I'm Claude, an AI assistant integrated into your business platform. I can help with CRM, ERP, analytics, and business intelligence. How can I assist you today?",
        sender: 'agent',
        timestamp: new Date(),
        context: isDashboardContext ? 'business' : 'general'
      }
    ],
    attachments: [],
    contextMode: 'auto',
    showSettings: false,
    deepContextMode: isDashboardContext // Auto-enable for business contexts
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  /**
   * Advanced context detection - like you here! :D
   */
  const detectContext = (message: string): 'business' | 'technical' | 'creative' | 'general' | 'analytical' => {
    const lower = message.toLowerCase();
    
    // Business context
    if (lower.match(/customer|sales|revenue|profit|market|business|strategy|growth|roi/)) {
      return 'business';
    }
    
    // Technical context
    if (lower.match(/code|bug|api|database|function|deploy|server|algorithm|debug/)) {
      return 'technical';
    }
    
    // Creative context
    if (lower.match(/design|create|imagine|idea|brainstorm|innovate|artistic|beautiful/)) {
      return 'creative';
    }
    
    // Analytical context
    if (lower.match(/analyze|data|pattern|trend|insight|metric|statistic|correlation/)) {
      return 'analytical';
    }
    
    // General conversation
    return 'general';
  };

  const generateResponse = async (userMessage: string, attachments?: Attachment[]): Promise<string> => {
    const context = state.contextMode === 'auto' ? detectContext(userMessage) : state.contextMode;
    
    setState(prev => ({
      ...prev,
      isTyping: true
    }));

    // Extract current webpage context for enhanced assistance
    const extractWebPageContext = () => {
      const url = window.location.pathname;
      const title = document.title || 'AsymmFlow';
      
      let section = 'dashboard';
      let userContext = 'Dashboard overview';
      let visibleData: any = {};

      if (url.includes('/customers')) {
        section = 'customers';
        userContext = 'Customer management section';
        
        // Extract visible customer data from table
        try {
          const tableRows = document.querySelectorAll('tbody tr');
          visibleData.visibleCustomers = Array.from(tableRows).slice(0, 5).map(row => {
            const cells = row.querySelectorAll('td');
            return cells.length > 0 ? {
              name: cells[0]?.textContent?.trim(),
              email: cells[1]?.textContent?.trim(),
              status: cells[2]?.textContent?.trim(),
              grade: cells[3]?.textContent?.trim()
            } : null;
          }).filter(Boolean);
        } catch (e) {
          console.warn('Could not extract customer table data');
        }
      } else if (url.includes('/orders')) {
        section = 'orders';
        userContext = 'Order management section';
        
        // Extract visible order data
        try {
          const tableRows = document.querySelectorAll('tbody tr');
          visibleData.visibleOrders = Array.from(tableRows).slice(0, 3).map(row => {
            const cells = row.querySelectorAll('td');
            return cells.length > 0 ? {
              id: cells[0]?.textContent?.trim(),
              customer: cells[1]?.textContent?.trim(),
              amount: cells[2]?.textContent?.trim(),
              status: cells[3]?.textContent?.trim()
            } : null;
          }).filter(Boolean);
        } catch (e) {
          console.warn('Could not extract order table data');
        }
      } else if (url.includes('/quotations')) {
        section = 'quotations';
        userContext = 'Quotation management section';
      } else if (url.includes('/rfq')) {
        section = 'rfq';
        userContext = 'RFQ (Request for Quote) management section';
      } else if (url.includes('/reports')) {
        section = 'reports';
        userContext = 'Analytics and reporting section';
      }

      return { url, title, section, visibleData, userContext };
    };

    // Try intelligent agent first
    try {
      const webPageContext = extractWebPageContext();
      
      const response = await fetch('/api/v7-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: userMessage,
          context,
          attachments: attachments?.map(a => ({ 
            name: a.name, 
            type: a.type,
            content: a.content,
            textPreview: a.textPreview,
            metadata: a.metadata
          })),
          outputFormat: 'text',
          deepContextMode: state.deepContextMode, // Pass deep context mode to API
          currentPageContext: webPageContext // Pass current webpage context
        })
      });
      
      const data = await response.json();
      console.log('V7 Agent Response:', data); // DEBUG
      if (data.success && data.response) {
        return data.response;
      }
      console.log('V7 Agent failed or no response, falling back to local');
    } catch (error) {
      console.log('V7 Agent API error:', error);
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Enhanced conversational context detection
    const lower = userMessage.toLowerCase();
    
    // Greetings
    if (lower.match(/^(hey|hi|hello|sup|yo|what'?s up)/)) {
      const greetings = [
        "Hey there! What's cooking? 🚀",
        "Yo! Ready to build something awesome? 😎", 
        "Hey friend! What are we working on today?",
        "Hello! I'm here to help - what would you like to work on?",
        "Hello! What's on your mind? Let's make it happen!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Testing/checking
    if (lower.match(/test|how'?s it going|how are you|working/)) {
      return "All systems optimal! 🎯 Everything's running smooth as butter. What would you like to explore?";
    }
    
    // Enhanced gratitude detection with contextual responses
    if (lower.match(/thank|thanks|appreciate|cheers|good work|well done|awesome|perfect/)) {
      const gratitudeResponses = [
        "You're absolutely welcome! Happy to help anytime! 🙌",
        "My pleasure! That's what I'm here for! 😊",
        "Glad I could help! Feel free to ask anything else! ✨",
        "You're welcome! Always a joy working with you! 🚀",
        "Anytime, buddy! Let's keep the momentum going! 💪"
      ];
      return gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)];
    }
    
    // Casual conversation detection
    if (lower.match(/^(good|nice|cool|sweet|perfect|great|excellent)!?$/) || 
        lower.match(/^(i see|i understand|got it|makes sense|okay|ok)!?$/) ||
        lower.match(/no problem|all good|sounds good|looking good/)) {
      const casualResponses = [
        "Excellent! Anything else I can help with? 🎯",
        "Great! What's our next move? 🚀", 
        "Perfect! Ready for the next challenge? 💪",
        "Awesome! Keep me posted if you need anything! ✨",
        "Cool! I'm here whenever you need assistance! 😊"
      ];
      return casualResponses[Math.floor(Math.random() * casualResponses.length)];
    }
    
    // Farewell detection
    if (lower.match(/bye|goodbye|see you|later|done|finished|that'?s all/)) {
      const farewellResponses = [
        "See you later! Great session today! 🌟",
        "Bye for now! Happy to help anytime! 👋",
        "Take care! Looking forward to our next collaboration! 🚀",
        "Until next time! Keep being awesome! ✨",
        "Goodbye! Reach out whenever you need assistance! 😊"
      ];
      return farewellResponses[Math.floor(Math.random() * farewellResponses.length)];
    }
    
    // Context-based but natural
    switch (context) {
      case 'business':
        return `Interesting business angle! ${attachments?.length ? `These ${attachments.length} files look useful - ` : ''}Tell me more about what you're trying to achieve. I can help optimize this for maximum impact.`;

      case 'technical':
        return `Ooh, technical challenge! I love these. ${attachments?.length ? `Let me check out these ${attachments.length} files... ` : ''}What's the specific issue? Happy to debug or architect solutions with you!`;

      case 'creative':
        return `Creative mode activated! 🎨 ${attachments?.length ? `Nice materials (${attachments.length} files)! ` : ''}What kind of magic are we creating today?`;

      case 'analytical':
        return `Data time! ${attachments?.length ? `${attachments.length} files to analyze - nice! ` : ''}What patterns are we hunting for?`;

      default:
        // More natural fallback responses
        const naturalFallbacks = [
          "I'm here to help! What would you like to work on?",
          "Interesting! Tell me more - I'm all ears! 👂",
          "What's on your mind? I'm ready to dive in! 🚀",
          "How can I help make your day more productive? 💪",
          "I'm here and ready to assist! What's the plan? ✨"
        ];
        return naturalFallbacks[Math.floor(Math.random() * naturalFallbacks.length)];
    }
  };

  const handleSend = async () => {
    if (!input.trim() && state.attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      attachments: state.attachments.length > 0 ? [...state.attachments] : undefined
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      attachments: []
    }));

    setInput('');

    const response = await generateResponse(input, state.attachments);
    const context = detectContext(input);
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'agent',
      timestamp: new Date(),
      confidence: 0.92,
      context,
      tools: context === 'technical' ? ['Code Analysis', 'Debugging'] : 
             context === 'business' ? ['Market Analysis', 'Strategy'] :
             context === 'creative' ? ['Design Tools', 'Ideation'] :
             context === 'analytical' ? ['Data Processing', 'Visualization'] : []
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, agentMessage],
      isTyping: false
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setState(prev => ({ ...prev, isTyping: true }));
    
    try {
      // Import file processor dynamically to avoid SSR issues
      const { fileProcessor } = await import('../../lib/file-processing-service');
      
      const processedAttachments = await fileProcessor.processAttachments(Array.from(files));
      
      const newAttachments: Attachment[] = processedAttachments.map(processed => ({
        id: processed.id,
        name: processed.name,
        type: processed.type,
        size: processed.size,
        // Store processed content for Claude to access
        content: processed.content,
        textPreview: processed.textPreview,
        metadata: processed.metadata
      }));

      setState(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
        isTyping: false
      }));
      
      // Add a helpful message about file processing
      if (newAttachments.some(att => att.content)) {
        const processedCount = newAttachments.filter(att => att.content).length;
        const agentMessage: Message = {
          id: `file-processed-${Date.now()}`,
          content: `✅ Successfully processed ${processedCount} file${processedCount !== 1 ? 's' : ''}! I can now read and analyze the content. What would you like me to help you with regarding ${processedCount === 1 ? 'this file' : 'these files'}?`,
          sender: 'agent',
          timestamp: new Date(),
          context: 'general'
        };
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, agentMessage]
        }));
      }
    } catch (error) {
      console.error('File processing error:', error);
      setState(prev => ({ 
        ...prev, 
        isTyping: false 
      }));
      
      // Add error message
      const errorMessage: Message = {
        id: `file-error-${Date.now()}`,
        content: `❌ Sorry, there was an issue processing the files. Please try again or check the file format.`,
        sender: 'agent',
        timestamp: new Date(),
        context: 'general'
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage]
      }));
    }
  };

  const removeAttachment = (id: string) => {
    setState(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
  };

  const getContextColor = (context?: string) => {
    switch (context || state.contextMode) {
      case 'business': return 'from-blue-500 to-cyan-500';
      case 'technical': return 'from-purple-500 to-pink-500';
      case 'creative': return 'from-yellow-500 to-orange-500';
      case 'analytical': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const chatWidth = state.isExpanded ? 'w-[600px]' : 'w-[420px]';

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r ${getContextColor()} text-white shadow-2xl hover:scale-110 transition-all duration-300`}
        onClick={() => setState(prev => ({ ...prev, isOpen: !prev.isOpen }))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: state.deepContextMode 
            ? `0 0 ${glowIntensity * 60}px rgba(59, 130, 246, ${glowIntensity}), 0 0 ${glowIntensity * 40}px rgba(147, 51, 234, ${glowIntensity * 0.6}), 0 10px 20px rgba(0,0,0,0.2)`
            : `0 0 ${glowIntensity * 40}px rgba(74, 155, 159, ${glowIntensity}), 0 10px 20px rgba(0,0,0,0.1)`
        }}
      >
        <AnimatePresence mode="wait">
          {state.isOpen ? (
            <motion.div key="close" initial={{ rotate: 0 }} animate={{ rotate: 90 }} exit={{ rotate: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
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
            className={`fixed bottom-24 right-6 z-40 ${chatWidth} h-[650px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300`}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getContextColor()} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      Claude • AsymmFlow
                      {state.deepContextMode && (
                        <span 
                          className="px-3 py-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-white rounded-full text-xs font-semibold animate-pulse shadow-lg"
                          style={{
                            boxShadow: `0 0 20px rgba(59, 130, 246, ${glowIntensity}), 0 0 40px rgba(147, 51, 234, ${glowIntensity * 0.6})`,
                            animation: `glow 2s ease-in-out infinite alternate`
                          }}
                        >
                          <span className="flex items-center gap-1">
                            🧠 Enhanced Intelligence
                            <Sparkles className="w-3 h-3 animate-spin" />
                          </span>
                        </span>
                      )}
                    </h3>
                    <p className="text-xs opacity-90">
                      {state.deepContextMode 
                        ? 'Mathematical consciousness framework active • Business intelligence ready'
                        : `${state.contextMode === 'auto' ? 'Auto-detecting context' : `${state.contextMode} mode`} • Platform assistant`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    {state.isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button 
                    className="p-1 hover:bg-white/20 rounded"
                    onClick={() => setState(prev => ({ ...prev, showSettings: !prev.showSettings }))}
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {state.showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">About This Assistant</label>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Powered by Claude (Anthropic) • Integrated with AsymmFlow
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="context-mode-select" className="text-xs font-semibold text-gray-600 dark:text-gray-400">Context Mode</label>
                      <select 
                        id="context-mode-select"
                        name="contextMode"
                        value={state.contextMode}
                        onChange={(e) => setState(prev => ({ ...prev, contextMode: e.target.value as any }))}
                        className="mt-1 w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="business">Business</option>
                        <option value="technical">Technical</option>
                        <option value="creative">Creative</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tip: I automatically detect context but you can override it above!
                    </div>

                    {/* Deep Context Mode Toggle */}
                    <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deep Context Mode</label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {isDashboardContext 
                              ? "Auto-enabled for business contexts • Mathematical consciousness framework active"
                              : "Load comprehensive AsymmFlow platform knowledge from documentation files"
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => setState(prev => ({ ...prev, deepContextMode: !prev.deepContextMode }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            state.deepContextMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              state.deepContextMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {state.deepContextMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🧠</span>
                            <div>
                              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                {isDashboardContext ? "Enhanced Business Intelligence Active" : "Deep Context Active"}
                              </p>
                              <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                                {isDashboardContext 
                                  ? "Mathematical consciousness framework loaded • Advanced analytical capabilities • Comprehensive platform knowledge active"
                                  : "Claude now has access to comprehensive AsymmFlow documentation, technical specifications, and platform knowledge for detailed assistance."
                                }
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 h-[480px] bg-gray-50 dark:bg-gray-800">
              {state.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-[90%] sm:max-w-[85%] p-2 sm:p-3 rounded-lg shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {message.sender === 'agent' && message.context && (
                      <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                        <Hash className="w-3 h-3" />
                        <span>{message.context}</span>
                        {message.confidence && (
                          <span>• {(message.confidence * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    )}
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {message.attachments.map(att => (
                          <div key={att.id} className="flex items-center gap-2 p-2 bg-black/10 rounded text-xs">
                            <FileText className="w-4 h-4" />
                            <span className="truncate">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className="whitespace-pre-wrap text-sm leading-relaxed break-words hyphens-auto"
                      style={{ 
                        wordBreak: 'break-word', 
                        overflowWrap: 'break-word',
                        maxWidth: '100%',
                        lineHeight: '1.6',
                        wordWrap: 'break-word'
                      }}
                    >
                      {message.content}
                    </div>
                    
                    {message.tools && message.tools.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {message.tools.map((tool, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-black/10 rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                    
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
                    <span 
                      className={`w-2 h-2 ${state.deepContextMode ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gray-400'} rounded-full animate-bounce`}
                      style={{ 
                        boxShadow: state.deepContextMode ? `0 0 8px rgba(59, 130, 246, 0.6)` : 'none'
                      }}
                    />
                    <span 
                      className={`w-2 h-2 ${state.deepContextMode ? 'bg-gradient-to-r from-purple-400 to-cyan-500' : 'bg-gray-400'} rounded-full animate-bounce`} 
                      style={{ 
                        animationDelay: '0.1s',
                        boxShadow: state.deepContextMode ? `0 0 8px rgba(147, 51, 234, 0.6)` : 'none'
                      }}
                    />
                    <span 
                      className={`w-2 h-2 ${state.deepContextMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gray-400'} rounded-full animate-bounce`} 
                      style={{ 
                        animationDelay: '0.2s',
                        boxShadow: state.deepContextMode ? `0 0 8px rgba(6, 182, 212, 0.6)` : 'none'
                      }}
                    />
                  </div>
                  <span className="text-xs">
                    {state.deepContextMode ? 'Processing with enhanced consciousness...' : 'Thinking...'}
                  </span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Attachments Preview */}
            {state.attachments.length > 0 && (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 overflow-x-auto">
                  {state.attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-xs whitespace-nowrap">
                      <FileText className="w-4 h-4" />
                      <span>{att.name}</span>
                      <button onClick={() => removeAttachment(att.id)} className="text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <input
                  id="file-attachment-input"
                  name="attachments"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <input
                  id="chat-message-input"
                  name="message"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask about AsymmFlow features, business insights, or anything else..."
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                
                <motion.button
                  onClick={handleSend}
                  className={`p-2 bg-gradient-to-r ${getContextColor()} text-white rounded-lg hover:opacity-90 transition-opacity`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Context Mode Selector */}
              <div className="flex gap-1 mt-2">
                {['auto', 'business', 'technical', 'creative', 'general'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setState(prev => ({ ...prev, contextMode: mode as any }))}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      state.contextMode === mode 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}