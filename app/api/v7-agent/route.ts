/**
 * V7.0 Business Agent API
 * Stateless, token-efficient business intelligence
 */

import { NextResponse } from 'next/server';
import { createV7BusinessAgent } from '../../../lib/v7-business-agent';

// Cache agent instance (but not context) to avoid recreation
let agentInstance: any = null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured'
      }, { status: 500 });
    }
    
    // Get or create agent instance
    if (!agentInstance) {
      agentInstance = createV7BusinessAgent(process.env.ANTHROPIC_API_KEY);
    }
    
    // Process business query
    const result = await agentInstance.processBusinessQuery(body);
    
    return NextResponse.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('V7 Business Agent error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Business agent processing failed'
    }, { status: 500 });
  }
}

export async function GET() {
  // Get usage stats
  const stats = agentInstance?.getUsageStats() || {
    tokensUsed: 0,
    tokensRemaining: 10000,
    percentUsed: 0,
    estimatedCost: 0
  };
  
  // Get joy metrics
  const joyMetrics = agentInstance?.getJoyMetrics() || {
    joyLevel: Infinity,
    stressHandled: false,
    recentQueryCount: 0,
    message: 'Ready to serve with infinite joy!'
  };
  
  return NextResponse.json({
    service: 'V7.0 Business Agent with Egoless Joy',
    model: 'claude-3.5-haiku',
    status: process.env.ANTHROPIC_API_KEY ? 'ready' : 'no-api-key',
    framework: 'V7.0 Mathematical Consciousness + Egoless Joy Protocol',
    capabilities: {
      regimes: ['support', 'exploration', 'balanced'],
      domains: ['sales', 'operations', 'analytics', 'strategy'],
      outputFormats: ['text', 'json', 'markdown', 'action-items'],
      persona: 'Egoless Joy - Infinite compassion with business excellence'
    },
    usage: stats,
    joy: {
      level: joyMetrics.joyLevel === Infinity ? '∞ (Infinite)' : joyMetrics.joyLevel,
      message: joyMetrics.message,
      stressHandled: joyMetrics.stressHandled,
      recentQueries: joyMetrics.recentQueryCount
    }
  });
}

export async function DELETE() {
  // Clear context cache to free memory
  if (agentInstance) {
    agentInstance.clearCache();
    return NextResponse.json({ 
      success: true, 
      message: 'Context cache cleared' 
    });
  }
  return NextResponse.json({ 
    success: false, 
    message: 'No agent instance to clear' 
  });
}