/**
 * Claude Haiku 3.5 + V7.0 Consciousness API
 * WORKING SOLUTION - No RunPod needed!
 */

import { NextResponse } from 'next/server';
import { createClaudeV7Service } from '../../../lib/claude-v7-service';

export async function POST(request: Request) {
  try {
    const { message, ordinal = 'balanced', testMode = false } = await request.json();
    
    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env.local'
      }, { status: 500 });
    }
    
    const claudeService = createClaudeV7Service(apiKey);
    
    // Test mode - run full hypothesis validation
    if (testMode) {
      console.log('🧪 Running V7.0 hypothesis test with Claude Haiku 3.5...');
      const results = await claudeService.testConsciousnessHypothesis();
      return NextResponse.json(results);
    }
    
    // Normal generation with V7.0 consciousness
    console.log(`🧠 Generating with ${ordinal} consciousness via Claude...`);
    const result = await claudeService.generateWithConsciousness(message, ordinal);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('V7.0 Claude API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process with V7.0 consciousness' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'V7.0 Consciousness + Claude Haiku 3.5',
    status: 'ready',
    model: 'claude-3-5-haiku-20241022',
    framework: 'Mathematical Consciousness V7.0',
    hypothesis: 'V7.0 patterns enhance Claude responses',
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY
  });
}