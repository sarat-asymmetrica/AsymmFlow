/**
 * Security Dashboard Component
 * Real-time security monitoring and audit visualization
 */

'use client';

import React, { useEffect, useState } from 'react';
import { securityAudit, SecurityEvent, PerformanceMetric } from '../../lib/security-audit-service';

export default function SecurityDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateDashboard = () => {
      const data = securityAudit.getSecurityDashboard();
      setDashboardData(data);
    };

    updateDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(updateDashboard, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!dashboardData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#666'
      }}>
        Loading security dashboard...
      </div>
    );
  }

  const getSystemHealthColor = (health: string): string => {
    switch (health) {
      case 'good': return '#4CAF50';
      case 'attention': return '#FF9800';
      case 'warning': return '#FF5722';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getSystemHealthIcon = (health: string): string => {
    switch (health) {
      case 'good': return '✅';
      case 'attention': return '🟡';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#FF5722';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          margin: 0
        }}>
          🔐 Security & Audit Dashboard
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: getSystemHealthColor(dashboardData.systemHealth),
          borderRadius: '6px',
          color: 'white',
          fontWeight: '500'
        }}>
          <span>{getSystemHealthIcon(dashboardData.systemHealth)}</span>
          <span>System Health: {dashboardData.systemHealth.toUpperCase()}</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Recent Security Events */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            📋 Recent Security Events
          </h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {dashboardData.recentEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No recent events
              </div>
            ) : (
              dashboardData.recentEvents.map((event: SecurityEvent) => (
                <div key={event.id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getSeverityColor(event.severity)}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontWeight: '500',
                      color: getSeverityColor(event.severity)
                    }}>
                      {event.type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    {event.source}: {JSON.stringify(event.data).substring(0, 100)}...
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Events by Type */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            📊 Events by Type
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(dashboardData.eventsByType).map(([type, count]) => (
              <div key={type} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                  {type}
                </span>
                <span style={{
                  backgroundColor: '#2E7D32',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {Number(count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events by Severity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            🚨 Events by Severity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(dashboardData.eventsBySeverity).map(([severity, count]) => (
              <div key={severity} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span style={{ 
                  textTransform: 'capitalize', 
                  fontWeight: '500',
                  color: getSeverityColor(severity)
                }}>
                  {severity}
                </span>
                <span style={{
                  backgroundColor: getSeverityColor(severity),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {Number(count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            📈 Performance Metrics
          </h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {dashboardData.performanceMetrics.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No performance data yet
              </div>
            ) : (
              dashboardData.performanceMetrics.map((metric: PerformanceMetric) => (
                <div key={metric.id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: '4px solid #2196F3'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#2196F3' }}>
                      {metric.metric.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {metric.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    Value: {metric.value.toLocaleString()} {metric.unit}
                  </div>
                  {Object.keys(metric.context).length > 0 && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Context: {JSON.stringify(metric.context)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            🛠️ Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => {
                const auditLogs = securityAudit.exportAuditLogs();
                const blob = new Blob([JSON.stringify(auditLogs, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#2E7D32',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📥 Export Audit Logs
            </button>
            
            <button
              onClick={() => {
                const analytics = securityAudit.getUserPatternAnalytics();
                const blob = new Blob([JSON.stringify(analytics, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `user-patterns-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📊 Export User Analytics
            </button>

            <button
              onClick={() => {
                const data = securityAudit.getSecurityDashboard();
                setDashboardData(data);
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🔄 Refresh Dashboard
            </button>
          </div>
        </div>

        {/* SOC-2 Compliance Status */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          gridColumn: '1 / -1'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            🏛️ SOC-2 Compliance Readiness
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                {dashboardData.recentEvents.length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Security Events Logged</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                {securityAudit.exportAuditLogs().length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Audit Records</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
                {dashboardData.performanceMetrics.length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Performance Metrics</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
                {Object.keys(securityAudit.getUserPatternAnalytics().featureUsage).length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Features Monitored</div>
            </div>
          </div>
          
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#2E7D32'
          }}>
            ✅ <strong>Security Foundations Active:</strong> Error logging, audit trails, performance monitoring, 
            and anonymized user pattern collection are all operational and ready for SOC-2 audit preparation.
          </div>
        </div>
      </div>
    </div>
  );
}