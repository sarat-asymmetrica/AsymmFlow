/**
 * Security Middleware for API Routes
 * Provides authentication, authorization, rate limiting, and audit logging
 */

import { NextRequest, NextResponse } from 'next/server';

export interface SecurityConfig {
  requireAuth?: boolean;
  requiredRole?: string;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  logRequest?: boolean;
  allowedMethods?: string[];
  corsOrigins?: string[];
}

export interface SecurityContext {
  userId?: string;
  userRole?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  authenticated: boolean;
}

// In-memory storage for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: SecurityConfig = {}) {
    this.config = {
      requireAuth: false,
      logRequest: true,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      corsOrigins: ['http://localhost:3000', 'https://localhost:3000'],
      ...config
    };
  }

  /**
   * Main security middleware function
   */
  async handle(request: NextRequest): Promise<NextResponse | null> {
    try {
      const context = await this.buildSecurityContext(request);

      // Method validation
      if (!this.isMethodAllowed(request.method)) {
        return this.createErrorResponse(405, 'Method Not Allowed', {
          allowed: this.config.allowedMethods
        });
      }

      // CORS handling
      const corsResponse = this.handleCors(request);
      if (corsResponse) return corsResponse;

      // Rate limiting
      const rateLimitResponse = await this.checkRateLimit(request, context);
      if (rateLimitResponse) return rateLimitResponse;

      // Authentication check
      if (this.config.requireAuth && !context.authenticated) {
        return this.createErrorResponse(401, 'Authentication required');
      }

      // Role-based access control
      if (this.config.requiredRole && context.userRole !== this.config.requiredRole) {
        return this.createErrorResponse(403, 'Insufficient permissions');
      }

      // Request logging
      if (this.config.logRequest) {
        this.logApiRequest(request, context);
      }

      // If we reach here, request is authorized
      return null;

    } catch (error) {
      this.logSecurityEvent('middleware_error', 'high', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: request.url,
        method: request.method
      });

      return this.createErrorResponse(500, 'Internal server error');
    }
  }

  /**
   * Build security context from request
   */
  private async buildSecurityContext(request: NextRequest): Promise<SecurityContext> {
    const headers = request.headers;
    const ip = this.getClientIP(request);
    const userAgent = headers.get('user-agent') || 'Unknown';
    
    // Extract session information (customize based on your auth system)
    const sessionId = this.extractSessionId(request);
    const authToken = headers.get('authorization') || request.cookies.get('auth-token')?.value;
    
    let userId: string | undefined;
    let userRole: string | undefined;
    let authenticated = false;

    if (authToken) {
      try {
        // Validate auth token (implement your auth validation logic)
        const authInfo = await this.validateAuthToken(authToken);
        if (authInfo) {
          userId = authInfo.userId;
          userRole = authInfo.role;
          authenticated = true;
        }
      } catch (error) {
        this.logSecurityEvent('auth_token_validation_failed', 'medium', {
          error: error instanceof Error ? error.message : 'Token validation failed',
          ip,
          userAgent
        });
      }
    }

    return {
      userId,
      userRole,
      sessionId,
      ip,
      userAgent,
      authenticated
    };
  }

  /**
   * Check if HTTP method is allowed
   */
  private isMethodAllowed(method: string): boolean {
    return this.config.allowedMethods?.includes(method.toUpperCase()) ?? true;
  }

  /**
   * Handle CORS preflight and headers
   */
  private handleCors(request: NextRequest): NextResponse | null {
    const origin = request.headers.get('origin');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: this.getCorsHeaders(origin)
      });
    }

    return null;
  }

  /**
   * Rate limiting check
   */
  private async checkRateLimit(request: NextRequest, context: SecurityContext): Promise<NextResponse | null> {
    if (!this.config.rateLimit) return null;

    const key = context.userId || context.ip || 'anonymous';
    const now = Date.now();
    const windowMs = this.config.rateLimit.windowMs;
    const maxRequests = this.config.rateLimit.maxRequests;

    let entry = rateLimitStore.get(key);
    
    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    if (entry.count > maxRequests) {
      this.logSecurityEvent('rate_limit_exceeded', 'medium', {
        key,
        count: entry.count,
        maxRequests,
        ip: context.ip,
        userId: context.userId
      });

      return this.createErrorResponse(429, 'Rate limit exceeded', {
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      });
    }

    return null;
  }

  /**
   * Log API request for audit trail
   */
  private logApiRequest(request: NextRequest, context: SecurityContext) {
    const url = new URL(request.url);
    
    // Don't log sensitive data in query params
    const sanitizedSearchParams = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (!this.isSensitiveParam(key)) {
        sanitizedSearchParams.set(key, value);
      } else {
        sanitizedSearchParams.set(key, '[REDACTED]');
      }
    });

    this.logSecurityEvent('api_request', 'low', {
      method: request.method,
      path: url.pathname,
      query: sanitizedSearchParams.toString(),
      ip: context.ip,
      userAgent: context.userAgent,
      userId: context.userId,
      sessionId: context.sessionId,
      authenticated: context.authenticated,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Validate authentication token (JWT implementation)
   */
  private async validateAuthToken(token: string): Promise<{ userId: string; role: string } | null> {
    try {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }

      const jwt = await import('jsonwebtoken');
      const decoded = jwt.verify(cleanToken, JWT_SECRET) as any;
      
      // Validate user still exists and is active
      const { getUserById } = await import('./user-roles');
      const user = getUserById(decoded.userId);
      
      if (!user || !user.isActive) {
        return null;
      }

      return {
        userId: decoded.userId,
        role: decoded.role
      };
    } catch (error) {
      this.logSecurityEvent('jwt_validation_failed', 'medium', {
        error: error instanceof Error ? error.message : 'JWT validation failed',
        token: token.substring(0, 20) + '...' // Log only first 20 chars for security
      });
      return null;
    }
  }

  /**
   * Extract session ID from request
   */
  private extractSessionId(request: NextRequest): string {
    // Try various sources for session ID
    const sessionCookie = request.cookies.get('session-id')?.value;
    if (sessionCookie) return sessionCookie;

    const sessionHeader = request.headers.get('x-session-id');
    if (sessionHeader) return sessionHeader;

    // Generate a temporary session ID
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;

    const cfIP = request.headers.get('cf-connecting-ip');
    if (cfIP) return cfIP;

    return 'unknown';
  }

  /**
   * Check if parameter contains sensitive data
   */
  private isSensitiveParam(key: string): boolean {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'session'];
    return sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive)
    );
  }

  /**
   * Get CORS headers
   */
  private getCorsHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
      'Access-Control-Allow-Methods': this.config.allowedMethods?.join(', ') || '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Session-ID',
      'Access-Control-Max-Age': '86400'
    };

    if (origin && this.config.corsOrigins?.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
    } else {
      headers['Access-Control-Allow-Origin'] = '*';
    }

    return headers;
  }

  /**
   * Create error response
   */
  private createErrorResponse(status: number, message: string, data?: any): NextResponse {
    const response = {
      error: message,
      status,
      timestamp: new Date().toISOString(),
      ...data
    };

    return NextResponse.json(response, { 
      status,
      headers: this.getCorsHeaders(null)
    });
  }

  /**
   * Log security event
   */
  private logSecurityEvent(type: string, severity: 'low' | 'medium' | 'high' | 'critical', data: any) {
    // In a real application, you would send this to your logging service
    console.log(`[SECURITY] ${severity.toUpperCase()}: ${type}`, data);
    
    // You could also store this in your security audit service
    // securityAudit.logSecurityEvent({ type: 'security', severity, source: type, data });
  }
}

/**
 * Helper function to create middleware for API routes
 */
export function withSecurity(config: SecurityConfig = {}) {
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async function(request: NextRequest, context?: any): Promise<NextResponse> {
      const middleware = new SecurityMiddleware(config);
      const securityResult = await middleware.handle(request);
      
      if (securityResult) {
        return securityResult;
      }
      
      return handler(request, context);
    };
  };
}

/**
 * Common security configurations
 */
export const SecurityConfigs = {
  public: {
    requireAuth: false,
    logRequest: true,
    rateLimit: { maxRequests: 100, windowMs: 60000 } // 100 requests per minute
  },
  
  authenticated: {
    requireAuth: true,
    logRequest: true,
    rateLimit: { maxRequests: 200, windowMs: 60000 } // 200 requests per minute for auth users
  },
  
  admin: {
    requireAuth: true,
    requiredRole: 'admin',
    logRequest: true,
    rateLimit: { maxRequests: 500, windowMs: 60000 } // 500 requests per minute for admins
  },
  
  sensitive: {
    requireAuth: true,
    logRequest: true,
    rateLimit: { maxRequests: 50, windowMs: 60000 }, // 50 requests per minute for sensitive ops
    allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
  }
};