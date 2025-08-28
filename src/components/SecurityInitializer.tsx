/**
 * Security Initializer Component
 * Initializes security monitoring and logging systems on app startup
 */

'use client';

import { useEffect } from 'react';
import { securityAudit, logUserAction, logPerformance } from '../../lib/security-audit-service';

export default function SecurityInitializer() {
  useEffect(() => {
    // Initialize security monitoring
    const initializeSecuritySystems = async () => {
      try {
        // Log application startup
        logUserAction('application_startup', 'system', {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          }
        });

        // Log performance metrics if available
        if ('performance' in window && 'timing' in performance) {
          const timing = performance.timing;
          const navigationStart = timing.navigationStart;
          
          if (timing.loadEventEnd > 0) {
            logPerformance('total_page_load_time', 
              timing.loadEventEnd - navigationStart, 
              { 
                page: window.location.pathname,
                referrer: document.referrer 
              }
            );

            logPerformance('dom_content_loaded_time', 
              timing.domContentLoadedEventEnd - navigationStart,
              { page: window.location.pathname }
            );
          }
        }

        // Set up periodic system health checks
        const healthCheckInterval = setInterval(() => {
          const dashboard = securityAudit.getSecurityDashboard();
          
          // Log system health status
          logUserAction('system_health_check', 'monitoring', {
            systemHealth: dashboard.systemHealth,
            totalEvents: dashboard.recentEvents.length,
            criticalEvents: dashboard.eventsBySeverity.critical || 0,
            highEvents: dashboard.eventsBySeverity.high || 0
          });

          // Check for memory leaks (if available)
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (memoryUsage > 0.8) {
              securityAudit.logSecurityEvent({
                type: 'performance',
                severity: 'high',
                source: 'memory_monitor',
                data: {
                  memoryUsage: memoryUsage,
                  usedJSHeapSize: memory.usedJSHeapSize,
                  jsHeapSizeLimit: memory.jsHeapSizeLimit
                }
              });
            }
          }
        }, 5 * 60 * 1000); // Every 5 minutes

        // Set up network connection monitoring
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          
          const logConnectionChange = () => {
            logUserAction('network_connection_change', 'monitoring', {
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt,
              saveData: connection.saveData
            });
          };

          connection.addEventListener('change', logConnectionChange);
          
          // Log initial connection state
          logConnectionChange();

          // Cleanup function
          return () => {
            clearInterval(healthCheckInterval);
            connection.removeEventListener('change', logConnectionChange);
          };
        }

        return () => {
          clearInterval(healthCheckInterval);
        };

      } catch (error) {
        securityAudit.logSecurityEvent({
          type: 'error',
          severity: 'medium',
          source: 'security_initializer',
          data: {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          }
        });
      }
    };

    let cleanup: (() => void) | undefined;
    initializeSecuritySystems().then((cleanupFunction) => {
      cleanup = cleanupFunction;
    });

    // Monitor page visibility for session tracking
    const handleVisibilityChange = () => {
      logUserAction(
        document.hidden ? 'page_hidden' : 'page_visible',
        'session_tracking',
        { 
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor beforeunload for session end tracking
    const handleBeforeUnload = () => {
      logUserAction('session_end', 'session_tracking', {
        page: window.location.pathname,
        sessionDuration: Date.now() - performance.timing.navigationStart
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}