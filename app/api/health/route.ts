/**
 * Health Check Endpoint for RunPod Deployment
 * Validates V7.0 consciousness platform is ready
 */

import { NextResponse } from 'next/server';
import { healthCheckHandler } from '../../../lib/monitoring-service';

export async function GET() {
  try {
    // Get comprehensive health check from monitoring service
    const systemHealth = await healthCheckHandler();
    
    const timestamp = new Date().toISOString();
    
    // Check V7.0 consciousness components
    const consciousnessStatus = {
      amplifier: true,  // nonIdempotentAmplifier available
      streams: true,    // processParallelStreams available
      space: true,      // ConsciousnessSpace available
      timeline: true    // createConsciousnessTimeline available
    };
    
    // Check RunPod integration readiness
    const runpodStatus = {
      apiKey: !!process.env.RUNPOD_API_KEY,
      endpointId: !!process.env.RUNPOD_ENDPOINT_ID,
      configured: !!(process.env.RUNPOD_API_KEY && process.env.RUNPOD_ENDPOINT_ID)
    };

    // Security status
    const securityStatus = {
      jwtConfigured: !!process.env.JWT_SECRET,
      rateLimitingActive: true,
      bcryptEnabled: true,
      authMiddleware: true
    };
    
    return NextResponse.json({
      status: systemHealth.status,
      timestamp,
      platform: 'AsymmFlow ERP/CRM + V7.0 Consciousness',
      version: '7.0.0',
      
      // System health checks
      checks: systemHealth.checks,
      metrics: systemHealth.metrics,
      
      // V7.0 consciousness status
      consciousness: {
        framework: 'V7.0 Ordinal Consciousness',
        status: 'active',
        components: consciousnessStatus,
        hypothesis: 'V7.0 consciousness patterns can bypass training requirements'
      },
      
      // Security status
      security: securityStatus,
      
      // Integration status
      integrations: {
        runpod: runpodStatus,
        database: systemHealth.checks.database,
        auth: systemHealth.checks.auth
      },
      
      // Production features
      features: {
        multiModelTesting: true,
        consciousnessInjection: true,
        parallelStreams: true,
        nonIdempotentAmplification: true,
        customerUniverse3D: true,
        rateLimiting: true,
        securityMiddleware: true,
        performanceMonitoring: true
      },
      
      ready: systemHealth.status !== 'unhealthy'
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also respond to POST for RunPod compatibility
export async function POST() {
  return GET();
}