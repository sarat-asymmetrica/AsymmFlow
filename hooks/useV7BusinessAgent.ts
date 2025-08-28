/**
 * useV7BusinessAgent Hook
 * Easy integration of V7.0 Business Agent throughout the app
 */

import { useState, useCallback } from 'react';

export interface AgentQuery {
  task?: string;
  action?: string;
  domain?: 'sales' | 'operations' | 'analytics' | 'strategy';
  urgency?: 'low' | 'medium' | 'high';
  outputFormat?: 'text' | 'json' | 'markdown' | 'action-items';
  context?: any;
  [key: string]: any; // Allow action-specific fields
}

export interface AgentResponse {
  success: boolean;
  response?: string;
  regime?: string;
  confidence?: number;
  actionItems?: string[];
  metrics?: any;
  tokensUsed?: number;
  cost?: number;
  error?: string;
}

export function useV7BusinessAgent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);
  const [usage, setUsage] = useState({
    tokensUsed: 0,
    totalCost: 0,
    requestCount: 0
  });

  /**
   * Send query to business agent
   */
  const query = useCallback(async (params: AgentQuery): Promise<AgentResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Determine endpoint
      const endpoint = params.action 
        ? `/api/v7-agent/${params.action}`
        : '/api/v7-agent';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Agent query failed');
      }
      
      // Update usage stats
      setUsage(prev => ({
        tokensUsed: prev.tokensUsed + (data.tokensUsed || 0),
        totalCost: prev.totalCost + (data.cost || 0),
        requestCount: prev.requestCount + 1
      }));
      
      setLastResponse(data);
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
      
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Quick action shortcuts
   */
  const analyzeCustomer = useCallback(
    (customerId?: string, question?: string) => 
      query({ 
        action: 'analyze-customer', 
        customerId, 
        question 
      }),
    [query]
  );

  const generateReport = useCallback(
    (reportType: string, urgency?: 'low' | 'medium' | 'high') =>
      query({ 
        action: 'generate-report', 
        reportType, 
        urgency 
      }),
    [query]
  );

  const optimizeStrategy = useCallback(
    (area: string, goal: string) =>
      query({ 
        action: 'optimize-strategy', 
        area, 
        goal 
      }),
    [query]
  );

  const getMarketInsights = useCallback(
    (segment: string, focus?: string) =>
      query({ 
        action: 'market-insights', 
        segment, 
        focus 
      }),
    [query]
  );

  const quickDecision = useCallback(
    (decision: string, options?: string) =>
      query({ 
        action: 'quick-decision', 
        decision, 
        options 
      }),
    [query]
  );

  const migrateData = useCallback(
    (source: string, target: string, requirements?: string) =>
      query({ 
        action: 'migrate-data', 
        source, 
        target, 
        requirements 
      }),
    [query]
  );

  /**
   * Clear context cache (for memory management)
   */
  const clearCache = useCallback(async () => {
    try {
      await fetch('/api/v7-agent', { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  }, []);

  /**
   * Get agent status
   */
  const getStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/v7-agent');
      return await response.json();
    } catch (err) {
      return { status: 'error', error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, []);

  return {
    // Core functionality
    query,
    loading,
    error,
    lastResponse,
    usage,
    
    // Quick actions
    analyzeCustomer,
    generateReport,
    optimizeStrategy,
    getMarketInsights,
    quickDecision,
    migrateData,
    
    // Utilities
    clearCache,
    getStatus
  };
}

/**
 * Example usage in a component:
 * 
 * const agent = useV7BusinessAgent();
 * 
 * // Generic query
 * const result = await agent.query({
 *   task: 'Analyze Q4 sales performance',
 *   domain: 'analytics',
 *   outputFormat: 'markdown'
 * });
 * 
 * // Quick actions
 * const customerInsights = await agent.analyzeCustomer('CUST001', 'What is their purchase pattern?');
 * const report = await agent.generateReport('monthly-sales', 'high');
 * const strategy = await agent.optimizeStrategy('customer-retention', 'reduce churn by 20%');
 * 
 * // Check usage
 * console.log(`Tokens used: ${agent.usage.tokensUsed}`);
 * console.log(`Total cost: $${agent.usage.totalCost.toFixed(4)}`);
 */