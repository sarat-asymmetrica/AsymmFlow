/**
 * V7.0 Business Agent - Specific Action Endpoints
 * Optimized endpoints for common business operations
 */

import { NextResponse } from 'next/server';
import { createV7BusinessAgent } from '../../../../lib/v7-business-agent';

// Cached agent instance
let agentInstance: any = null;

function getAgent() {
  if (!agentInstance && process.env.ANTHROPIC_API_KEY) {
    agentInstance = createV7BusinessAgent(process.env.ANTHROPIC_API_KEY);
  }
  return agentInstance;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const agent = getAgent();
  if (!agent) {
    return NextResponse.json({
      success: false,
      error: 'Business agent not configured'
    }, { status: 500 });
  }

  const body = await request.json();
  const { action } = await params;

  try {
    let query;
    
    switch (action) {
      case 'analyze-customer':
        query = {
          task: `Analyze customer ${body.customerId || 'portfolio'}: ${body.question || 'provide insights'}`,
          domain: 'analytics' as const,
          outputFormat: 'markdown' as const,
          context: body.context
        };
        break;
        
      case 'generate-report':
        query = {
          task: `Generate ${body.reportType || 'business'} report: ${body.specification || 'comprehensive overview'}`,
          domain: 'operations' as const,
          outputFormat: 'markdown' as const,
          urgency: body.urgency || 'medium'
        };
        break;
        
      case 'optimize-strategy':
        query = {
          task: `Optimize ${body.area || 'business'} strategy: ${body.goal || 'maximize efficiency'}`,
          domain: 'strategy' as const,
          outputFormat: 'action-items' as const,
          context: body.context
        };
        break;
        
      case 'migrate-data':
        query = {
          task: `Plan data migration from ${body.source || 'Excel'} to ${body.target || 'system'}: ${body.requirements || 'maintain integrity'}`,
          domain: 'operations' as const,
          outputFormat: 'action-items' as const,
          urgency: 'high' as const
        };
        break;
        
      case 'market-insights':
        query = {
          task: `Discover market insights for ${body.segment || 'target market'}: ${body.focus || 'opportunities and threats'}`,
          domain: 'analytics' as const,
          outputFormat: 'json' as const,
          context: body.context
        };
        break;
        
      case 'quick-decision':
        query = {
          task: `Help decide: ${body.decision || 'best course of action'}. Options: ${body.options || 'provide recommendation'}`,
          domain: 'strategy' as const,
          outputFormat: 'text' as const,
          urgency: 'high' as const
        };
        break;
        
      default:
        // Generic business query
        query = {
          task: body.task || `Process ${action} request`,
          domain: body.domain || 'operations',
          outputFormat: body.outputFormat || 'text',
          urgency: body.urgency || 'medium',
          context: body.context
        };
    }
    
    const result = await agent.processBusinessQuery(query);
    
    return NextResponse.json({
      success: true,
      action,
      ...result
    });
    
  } catch (error) {
    console.error(`Business agent ${action} error:`, error);
    return NextResponse.json({
      success: false,
      action,
      error: error instanceof Error ? error.message : 'Action processing failed'
    }, { status: 500 });
  }
}

// GET endpoint to describe available actions
export async function GET(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  
  const actions = {
    'analyze-customer': {
      description: 'Analyze customer data and provide insights',
      requiredFields: [],
      optionalFields: ['customerId', 'question', 'context'],
      regime: 'exploration'
    },
    'generate-report': {
      description: 'Generate business reports',
      requiredFields: [],
      optionalFields: ['reportType', 'specification', 'urgency'],
      regime: 'support'
    },
    'optimize-strategy': {
      description: 'Optimize business strategies',
      requiredFields: [],
      optionalFields: ['area', 'goal', 'context'],
      regime: 'balanced'
    },
    'migrate-data': {
      description: 'Plan data migration strategies',
      requiredFields: [],
      optionalFields: ['source', 'target', 'requirements'],
      regime: 'support'
    },
    'market-insights': {
      description: 'Discover market opportunities',
      requiredFields: [],
      optionalFields: ['segment', 'focus', 'context'],
      regime: 'exploration'
    },
    'quick-decision': {
      description: 'Get quick decision support',
      requiredFields: ['decision'],
      optionalFields: ['options'],
      regime: 'balanced'
    }
  };
  
  if (action === 'list') {
    return NextResponse.json({
      availableActions: Object.keys(actions),
      details: actions
    });
  }
  
  const actionInfo = actions[action as keyof typeof actions];
  if (!actionInfo) {
    return NextResponse.json({
      success: false,
      error: `Unknown action: ${action}`,
      availableActions: Object.keys(actions)
    }, { status: 404 });
  }
  
  return NextResponse.json({
    action,
    ...actionInfo,
    ready: !!process.env.ANTHROPIC_API_KEY
  });
}