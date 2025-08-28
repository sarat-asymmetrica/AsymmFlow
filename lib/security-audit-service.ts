/**
 * Security & Audit Service
 * Comprehensive security monitoring, error logging, and SOC-2 audit foundations
 * 
 * Features:
 * - Security event monitoring
 * - Error tracking and logging
 * - User activity patterns (anonymized)
 * - Audit trail generation
 * - Performance monitoring
 * - Threat detection
 */

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'auth' | 'access' | 'error' | 'performance' | 'security' | 'user_action';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  data: Record<string, any>;
  resolved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  resource: string;
  userId?: string;
  sessionId?: string;
  beforeState?: any;
  afterState?: any;
  metadata: Record<string, any>;
}

export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  metric: string;
  value: number;
  unit: string;
  context: Record<string, any>;
}

export interface UserPattern {
  id: string;
  timestamp: Date;
  patternType: 'navigation' | 'search' | 'workflow' | 'feature_usage';
  hashedUserId?: string; // Anonymized user identifier
  sessionDuration?: number;
  data: Record<string, any>;
}

export class SecurityAuditService {
  private events: SecurityEvent[] = [];
  private auditLogs: AuditLog[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private userPatterns: UserPattern[] = [];
  private maxLogSize = 10000;
  
  constructor() {
    this.initializeSecurityMonitoring();
  }

  /**
   * Initialize security monitoring and event listeners
   */
  private initializeSecurityMonitoring() {
    if (typeof window !== 'undefined') {
      // Monitor unhandled errors
      window.addEventListener('error', (event) => {
        this.logSecurityEvent({
          type: 'error',
          severity: 'high',
          source: 'window.error',
          data: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
          }
        });
      });

      // Monitor unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.logSecurityEvent({
          type: 'error',
          severity: 'high',
          source: 'unhandled.rejection',
          data: {
            reason: event.reason,
            promise: 'Promise rejection'
          }
        });
      });

      // Monitor page visibility changes
      document.addEventListener('visibilitychange', () => {
        this.logUserPattern({
          patternType: 'navigation',
          data: {
            action: document.hidden ? 'page_hidden' : 'page_visible',
            timestamp: new Date().toISOString()
          }
        });
      });

      // Monitor performance
      this.startPerformanceMonitoring();
    }
  }

  /**
   * Log security events with proper categorization
   */
  logSecurityEvent(event: Partial<SecurityEvent>): void {
    const securityEvent: SecurityEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      type: event.type || 'security',
      severity: event.severity || 'medium',
      source: event.source || 'unknown',
      userId: event.userId,
      sessionId: this.getSessionId(),
      ip: this.getClientIP(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      data: event.data || {},
      resolved: false
    };

    this.events.push(securityEvent);
    this.trimLogs();
    
    // Log to console for development (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Security Event [${securityEvent.severity}]:`, securityEvent);
    }

    // Check for critical events that need immediate attention
    if (securityEvent.severity === 'critical') {
      this.handleCriticalSecurityEvent(securityEvent);
    }
  }

  /**
   * Log audit trail for compliance
   */
  logAuditEvent(audit: Partial<AuditLog>): void {
    const auditLog: AuditLog = {
      id: this.generateId(),
      timestamp: new Date(),
      action: audit.action || 'unknown',
      resource: audit.resource || 'unknown',
      userId: audit.userId,
      sessionId: this.getSessionId(),
      beforeState: audit.beforeState,
      afterState: audit.afterState,
      metadata: audit.metadata || {}
    };

    this.auditLogs.push(auditLog);
    this.trimAuditLogs();

    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Audit Log:', auditLog);
    }
  }

  /**
   * Log performance metrics
   */
  logPerformanceMetric(metric: Partial<PerformanceMetric>): void {
    const performanceMetric: PerformanceMetric = {
      id: this.generateId(),
      timestamp: new Date(),
      metric: metric.metric || 'unknown',
      value: metric.value || 0,
      unit: metric.unit || 'ms',
      context: metric.context || {}
    };

    this.performanceMetrics.push(performanceMetric);
    this.trimPerformanceMetrics();
  }

  /**
   * Log anonymized user patterns for CI/CD insights
   */
  logUserPattern(pattern: Partial<UserPattern>): void {
    const userPattern: UserPattern = {
      id: this.generateId(),
      timestamp: new Date(),
      patternType: pattern.patternType || 'feature_usage',
      hashedUserId: pattern.hashedUserId || this.getAnonymizedUserId(),
      sessionDuration: pattern.sessionDuration,
      data: pattern.data || {}
    };

    this.userPatterns.push(userPattern);
    this.trimUserPatterns();
  }

  /**
   * Start monitoring performance metrics
   */
  private startPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as any;
          if (navigation) {
            this.logPerformanceMetric({
              metric: 'page_load_time',
              value: navigation.loadEventEnd - navigation.fetchStart,
              unit: 'ms',
              context: { page: window.location.pathname }
            });
          }
        }, 100);
      });

      // Monitor memory usage (if available)
      if ('memory' in performance) {
        setInterval(() => {
          const memory = (performance as any).memory;
          this.logPerformanceMetric({
            metric: 'memory_usage',
            value: memory.usedJSHeapSize,
            unit: 'bytes',
            context: {
              total: memory.totalJSHeapSize,
              limit: memory.jsHeapSizeLimit
            }
          });
        }, 60000); // Every minute
      }
    }
  }

  /**
   * Handle critical security events
   */
  private handleCriticalSecurityEvent(event: SecurityEvent): void {
    // In production, this would trigger alerts, notifications, etc.
    console.error('🚨 CRITICAL SECURITY EVENT:', event);
    
    // Log additional context for critical events
    this.logAuditEvent({
      action: 'critical_security_event_triggered',
      resource: 'security_system',
      metadata: {
        eventId: event.id,
        eventType: event.type,
        severity: event.severity,
        source: event.source
      }
    });
  }

  /**
   * Get security dashboard data
   */
  getSecurityDashboard(): {
    recentEvents: SecurityEvent[];
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    performanceMetrics: PerformanceMetric[];
    systemHealth: string;
  } {
    const recentEvents = this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentPerformanceMetrics = this.performanceMetrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    // Simple system health calculation
    const criticalEvents = eventsBySeverity.critical || 0;
    const highEvents = eventsBySeverity.high || 0;
    let systemHealth = 'good';
    
    if (criticalEvents > 0) systemHealth = 'critical';
    else if (highEvents > 5) systemHealth = 'warning';
    else if (highEvents > 0) systemHealth = 'attention';

    return {
      recentEvents,
      eventsByType,
      eventsBySeverity,
      performanceMetrics: recentPerformanceMetrics,
      systemHealth
    };
  }

  /**
   * Get user pattern analytics for CI/CD
   */
  getUserPatternAnalytics(): {
    navigationPatterns: Record<string, number>;
    searchPatterns: Record<string, number>;
    featureUsage: Record<string, number>;
    sessionDurations: number[];
  } {
    const navigationPatterns: Record<string, number> = {};
    const searchPatterns: Record<string, number> = {};
    const featureUsage: Record<string, number> = {};
    const sessionDurations: number[] = [];

    this.userPatterns.forEach(pattern => {
      if (pattern.patternType === 'navigation') {
        const action = pattern.data.action || 'unknown';
        navigationPatterns[action] = (navigationPatterns[action] || 0) + 1;
      } else if (pattern.patternType === 'search') {
        const query = pattern.data.query || 'unknown';
        searchPatterns[query] = (searchPatterns[query] || 0) + 1;
      } else if (pattern.patternType === 'feature_usage') {
        const feature = pattern.data.feature || 'unknown';
        featureUsage[feature] = (featureUsage[feature] || 0) + 1;
      }

      if (pattern.sessionDuration) {
        sessionDurations.push(pattern.sessionDuration);
      }
    });

    return {
      navigationPatterns,
      searchPatterns,
      featureUsage,
      sessionDurations
    };
  }

  /**
   * Export audit logs for SOC-2 compliance
   */
  exportAuditLogs(startDate?: Date, endDate?: Date): AuditLog[] {
    let logs = this.auditLogs;
    
    if (startDate || endDate) {
      logs = logs.filter(log => {
        const logTime = log.timestamp.getTime();
        const start = startDate?.getTime() || 0;
        const end = endDate?.getTime() || Date.now();
        return logTime >= start && logTime <= end;
      });
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Utility methods
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('security_session_id');
      if (!sessionId) {
        sessionId = this.generateId();
        sessionStorage.setItem('security_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server';
  }

  private getClientIP(): string | undefined {
    // Note: In production, you would get this from headers or a service
    return undefined;
  }

  private getAnonymizedUserId(): string {
    // Create anonymous but consistent user identifier
    if (typeof window !== 'undefined') {
      let anonymizedId = localStorage.getItem('anonymized_user_id');
      if (!anonymizedId) {
        anonymizedId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('anonymized_user_id', anonymizedId);
      }
      return anonymizedId;
    }
    return 'anonymous';
  }

  private trimLogs(): void {
    if (this.events.length > this.maxLogSize) {
      this.events = this.events.slice(-this.maxLogSize);
    }
  }

  private trimAuditLogs(): void {
    if (this.auditLogs.length > this.maxLogSize) {
      this.auditLogs = this.auditLogs.slice(-this.maxLogSize);
    }
  }

  private trimPerformanceMetrics(): void {
    if (this.performanceMetrics.length > this.maxLogSize) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxLogSize);
    }
  }

  private trimUserPatterns(): void {
    if (this.userPatterns.length > this.maxLogSize) {
      this.userPatterns = this.userPatterns.slice(-this.maxLogSize);
    }
  }
}

// Export singleton instance
export const securityAudit = new SecurityAuditService();

// Convenience functions for easy usage throughout the app
export const logError = (error: Error, context?: Record<string, any>) => {
  securityAudit.logSecurityEvent({
    type: 'error',
    severity: 'high',
    source: 'application',
    data: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context
    }
  });
};

export const logUserAction = (action: string, resource: string, data?: any) => {
  securityAudit.logAuditEvent({
    action,
    resource,
    afterState: data,
    metadata: { timestamp: new Date().toISOString() }
  });
  
  securityAudit.logUserPattern({
    patternType: 'feature_usage',
    data: { feature: action, resource, ...data }
  });
};

export const logSearchPattern = (query: string, results: number) => {
  securityAudit.logUserPattern({
    patternType: 'search',
    data: { query: query.substring(0, 50), resultCount: results } // Truncate for privacy
  });
};

export const logPerformance = (metric: string, value: number, context?: Record<string, any>) => {
  securityAudit.logPerformanceMetric({
    metric,
    value,
    context
  });
};