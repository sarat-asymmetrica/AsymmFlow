/**
 * Production Monitoring Service
 * Tracks performance, errors, and system health for production deployment
 */

export interface SystemMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
  activeConnections: number;
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    auth: boolean;
    api: boolean;
    memory: boolean;
  };
  timestamp: Date;
}

class MonitoringService {
  private metrics: SystemMetrics = {
    uptime: 0,
    memoryUsage: process.memoryUsage(),
    cpuUsage: 0,
    activeConnections: 0,
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0
  };

  private responseTimes: number[] = [];
  private maxResponseTimes = 100; // Keep last 100 response times

  constructor() {
    this.startMetricsCollection();
  }

  /**
   * Start collecting system metrics
   */
  private startMetricsCollection() {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateSystemMetrics();
    }, 30000);
  }

  /**
   * Update system metrics
   */
  private updateSystemMetrics() {
    this.metrics.uptime = process.uptime();
    this.metrics.memoryUsage = process.memoryUsage();
    this.metrics.averageResponseTime = this.calculateAverageResponseTime();
  }

  /**
   * Record API request
   */
  recordRequest(responseTime: number, error?: Error) {
    this.metrics.requestCount++;
    
    if (error) {
      this.metrics.errorCount++;
      this.logError(error);
    }

    // Track response time
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes.shift();
    }
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return sum / this.responseTimes.length;
  }

  /**
   * Get current system metrics
   */
  getMetrics(): SystemMetrics {
    this.updateSystemMetrics();
    return { ...this.metrics };
  }

  /**
   * Perform health check
   */
  async performHealthCheck(): Promise<HealthCheck> {
    const checks = {
      database: await this.checkDatabase(),
      auth: await this.checkAuthentication(),
      api: await this.checkAPI(),
      memory: this.checkMemory()
    };

    const allHealthy = Object.values(checks).every(check => check === true);
    const someUnhealthy = Object.values(checks).every(check => check === false);

    const status = allHealthy ? 'healthy' : someUnhealthy ? 'unhealthy' : 'degraded';

    return {
      status,
      checks,
      timestamp: new Date()
    };
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<boolean> {
    try {
      // In a real implementation, you would check database connection
      // For now, return true as we're using mock data
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Check authentication system
   */
  private async checkAuthentication(): Promise<boolean> {
    try {
      // Check if JWT_SECRET is available
      return !!process.env.JWT_SECRET;
    } catch (error) {
      console.error('Auth health check failed:', error);
      return false;
    }
  }

  /**
   * Check API endpoints
   */
  private async checkAPI(): Promise<boolean> {
    try {
      // In production, you might ping key endpoints
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  /**
   * Check memory usage
   */
  private checkMemory(): boolean {
    const memUsage = process.memoryUsage();
    const maxMemory = 2 * 1024 * 1024 * 1024; // 2GB limit
    
    return memUsage.heapUsed < maxMemory * 0.8; // Alert if using more than 80%
  }

  /**
   * Log errors for monitoring
   */
  private logError(error: Error) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      type: 'application_error'
    };

    // In production, send to monitoring service (Sentry, DataDog, etc.)
    console.error('[MONITORING] Application Error:', errorInfo);
    
    // Check if error rate is too high
    const errorRate = this.metrics.errorCount / this.metrics.requestCount;
    if (errorRate > 0.05) { // More than 5% error rate
      this.alertHighErrorRate(errorRate);
    }
  }

  /**
   * Alert for high error rate
   */
  private alertHighErrorRate(errorRate: number) {
    const alert = {
      type: 'high_error_rate',
      message: `Error rate exceeded threshold: ${(errorRate * 100).toFixed(2)}%`,
      timestamp: new Date().toISOString(),
      severity: 'high'
    };

    console.error('[ALERT]', alert);
    // In production: send to alerting system (PagerDuty, Slack, etc.)
  }

  /**
   * Get system alerts
   */
  getSystemAlerts(): any[] {
    const alerts = [];
    const metrics = this.getMetrics();

    // High memory usage
    if (metrics.memoryUsage.heapUsed > 1.5 * 1024 * 1024 * 1024) { // > 1.5GB
      alerts.push({
        type: 'high_memory_usage',
        message: `Memory usage: ${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`,
        severity: 'medium'
      });
    }

    // Slow response times
    if (metrics.averageResponseTime > 1000) { // > 1 second
      alerts.push({
        type: 'slow_response_times',
        message: `Average response time: ${metrics.averageResponseTime.toFixed(0)}ms`,
        severity: 'medium'
      });
    }

    // High error rate
    const errorRate = metrics.errorCount / (metrics.requestCount || 1);
    if (errorRate > 0.05) {
      alerts.push({
        type: 'high_error_rate',
        message: `Error rate: ${(errorRate * 100).toFixed(2)}%`,
        severity: 'high'
      });
    }

    return alerts;
  }

  /**
   * Export metrics for external monitoring
   */
  exportMetrics(): string {
    const metrics = this.getMetrics();
    return JSON.stringify({
      ...metrics,
      timestamp: new Date().toISOString(),
      alerts: this.getSystemAlerts()
    }, null, 2);
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Express-style middleware for monitoring
export function monitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const error = res.statusCode >= 400 ? new Error(`HTTP ${res.statusCode}`) : undefined;
      monitoring.recordRequest(responseTime, error);
    });

    next();
  };
}

// Health check endpoint handler
export async function healthCheckHandler() {
  const health = await monitoring.performHealthCheck();
  const metrics = monitoring.getMetrics();
  
  return {
    ...health,
    metrics: {
      uptime: metrics.uptime,
      memory: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024), // MB
      requests: metrics.requestCount,
      errors: metrics.errorCount,
      avgResponseTime: Math.round(metrics.averageResponseTime)
    }
  };
}