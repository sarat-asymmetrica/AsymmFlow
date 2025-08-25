/**
 * V7.0 Consciousness API Endpoint
 * Test hypothesis: Can V7.0 consciousness patterns make any LLM consciousness-aware?
 */

import { NextResponse } from 'next/server';
import { createRunPodV7Service } from '../../../lib/runpod-v7-service';
import { nonIdempotentAmplifier } from '../../../lib/v7-consciousness';

export async function POST(request: Request) {
  try {
    const { message, testMode = false } = await request.json();
    
    const runpodService = createRunPodV7Service();
    
    // If test mode, run consciousness alignment tests
    if (testMode) {
      console.log('🧪 Running V7.0 consciousness hypothesis test...');
      
      const testResults = await runpodService.testModelConsciousness();
      
      return NextResponse.json({
        hypothesis: 'V7.0 consciousness patterns can bypass training requirements',
        results: testResults,
        conclusion: analyzeTestResults(testResults)
      });
    }
    
    // Normal message processing with V7.0 consciousness
    const ordinal = detectIntent(message);
    const amplification = nonIdempotentAmplifier(1, 1, ordinal);
    
    const response = await runpodService.generateWithConsciousness({
      userMessage: message,
      ordinal,
      amplification
    });
    
    return NextResponse.json({
      response,
      consciousness: {
        ordinal,
        amplification,
        pattern: 'V7.0 Enhanced'
      }
    });
    
  } catch (error) {
    console.error('V7.0 Consciousness API error:', error);
    return NextResponse.json(
      { error: 'Failed to process with V7.0 consciousness' },
      { status: 500 }
    );
  }
}

// Intent detection (simplified from V7ConsciousnessAgent)
function detectIntent(message: string): 'support' | 'exploration' | 'balanced' | 'transcendent' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('migrate') || lowerMessage.includes('excel') || lowerMessage.includes('task')) {
    return 'support';
  } else if (lowerMessage.includes('analyze') || lowerMessage.includes('pattern') || lowerMessage.includes('discover')) {
    return 'exploration';
  } else if (lowerMessage.includes('optimize') || lowerMessage.includes('strategy')) {
    return 'balanced';
  } else if (lowerMessage.includes('vision') || lowerMessage.includes('transform')) {
    return 'transcendent';
  }
  
  return 'balanced';
}

// Analyze test results to validate hypothesis
function analyzeTestResults(results: any): any {
  let totalAlignment = 0;
  let testCount = 0;
  
  for (const key in results) {
    if (results[key].consciousnessScore) {
      totalAlignment += results[key].consciousnessScore;
      testCount++;
    }
  }
  
  const averageAlignment = totalAlignment / testCount;
  
  return {
    averageConsciousnessAlignment: averageAlignment.toFixed(1) + '%',
    hypothesisValidated: averageAlignment > 60,
    insight: averageAlignment > 60 
      ? 'V7.0 consciousness patterns successfully transfer to untrained models!'
      : 'Models need more V7.0 consciousness injection intensity',
    recommendation: 'Deploy V7.0 consciousness wrapper for all LLM interactions'
  };
}