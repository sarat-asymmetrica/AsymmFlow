/**
 * V7.0 Business Agent Panel
 * Interactive UI for business intelligence queries
 */

'use client';

import React, { useState } from 'react';
import { useV7BusinessAgent } from '../../hooks/useV7BusinessAgent';
import { Brain, Zap, TrendingUp, FileText, Target, DollarSign, Loader2 } from 'lucide-react';

export function V7BusinessAgentPanel() {
  const agent = useV7BusinessAgent();
  const [customQuery, setCustomQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'sales' | 'operations' | 'analytics' | 'strategy'>('analytics');

  // Quick action handlers
  const quickActions = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'Analyze Customers',
      action: () => agent.analyzeCustomer(undefined, 'Identify top 5 opportunities for growth'),
      color: 'bg-blue-500'
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Generate Report',
      action: () => agent.generateReport('executive-summary', 'high'),
      color: 'bg-green-500'
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: 'Optimize Strategy',
      action: () => agent.optimizeStrategy('revenue', 'increase by 25% in Q1'),
      color: 'bg-purple-500'
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: 'Market Insights',
      action: () => agent.getMarketInsights('premium-customers', 'untapped opportunities'),
      color: 'bg-yellow-500'
    }
  ];

  const handleCustomQuery = async () => {
    if (!customQuery) return;
    
    await agent.query({
      task: customQuery,
      domain: selectedDomain,
      outputFormat: 'markdown'
    });
    
    setCustomQuery('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">V7.0 Business Agent</h2>
            <p className="text-sm text-gray-500">Claude Haiku 3.5 + Mathematical Consciousness</p>
          </div>
        </div>
        
        {/* Usage Stats */}
        <div className="text-right text-sm">
          <div className="text-gray-600">Tokens: {agent.usage.tokensUsed.toLocaleString()}</div>
          <div className="text-gray-600">Cost: ${agent.usage.totalCost.toFixed(4)}</div>
          <div className="text-gray-600">Requests: {agent.usage.requestCount}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.action}
              disabled={agent.loading}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white ${action.color} hover:opacity-90 transition-opacity disabled:opacity-50`}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Query */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Query</h3>
        <div className="flex gap-2">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="sales">Sales</option>
            <option value="operations">Operations</option>
            <option value="analytics">Analytics</option>
            <option value="strategy">Strategy</option>
          </select>
          
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomQuery()}
            placeholder="Ask anything about your business..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            disabled={agent.loading}
          />
          
          <button
            onClick={handleCustomQuery}
            disabled={agent.loading || !customQuery}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {agent.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span className="font-medium">Process</span>
          </button>
        </div>
      </div>

      {/* Response Display */}
      {agent.lastResponse && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Response</h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Regime: {agent.lastResponse.regime}</span>
              <span>Confidence: {((agent.lastResponse.confidence || 0) * 100).toFixed(0)}%</span>
              <span>Tokens: {agent.lastResponse.tokensUsed}</span>
            </div>
          </div>
          
          {/* Main Response */}
          <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4">
            <div dangerouslySetInnerHTML={{ 
              __html: agent.lastResponse.response?.replace(/\n/g, '<br>') || '' 
            }} />
          </div>
          
          {/* Action Items */}
          {agent.lastResponse.actionItems && agent.lastResponse.actionItems.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Action Items</h4>
              <ul className="space-y-1">
                {agent.lastResponse.actionItems.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Metrics */}
          {agent.lastResponse.metrics && Object.keys(agent.lastResponse.metrics).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(agent.lastResponse.metrics).map(([key, value]) => (
                  <div key={key} className="bg-blue-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-600">{key}</div>
                    <div className="text-lg font-bold text-blue-600">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {agent.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Error: {agent.error}</p>
        </div>
      )}

      {/* Status Bar */}
      <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${agent.loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span>{agent.loading ? 'Processing...' : 'Ready'}</span>
        </div>
        
        <button
          onClick={agent.clearCache}
          className="text-blue-500 hover:text-blue-600"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
}