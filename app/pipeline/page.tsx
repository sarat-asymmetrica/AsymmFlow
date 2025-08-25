'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface PipelineData {
  rfqs: { total: number; sources: Record<string, number> };
  quotations: { total: number; pending: number; sent: number; revised: number };
  orders: { total: number; value: number; stages: Record<string, number> };
  conversions: {
    rfqToQuote: number;
    quoteToOrder: number;
    overall: number;
  };
  timeline: TimelineData[];
  heatmap: HeatmapData[];
}

interface TimelineData {
  date: string;
  rfqs: number;
  quotes: number;
  orders: number;
}

interface HeatmapData {
  hour: number;
  day: string;
  activity: number;
}

export default function PipelinePage() {
  const [data, setData] = useState<PipelineData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedFlow, setSelectedFlow] = useState<'all' | 'email' | 'whatsapp' | 'tender'>('all');

  useEffect(() => {
    // Fetch pipeline data based on time range
    const multiplier = timeRange === 'week' ? 0.3 : timeRange === 'month' ? 1 : 3;
    
    const mockData: PipelineData = {
      rfqs: {
        total: Math.floor(47 * multiplier),
        sources: {
          email: Math.floor(18 * multiplier),
          whatsapp: Math.floor(12 * multiplier),
          tender: Math.floor(8 * multiplier),
          website: Math.floor(5 * multiplier),
          exhibition: Math.floor(4 * multiplier)
        }
      },
      quotations: {
        total: Math.floor(38 * multiplier),
        pending: Math.floor(5 * multiplier),
        sent: Math.floor(28 * multiplier),
        revised: Math.floor(5 * multiplier)
      },
      orders: {
        total: Math.floor(12 * multiplier),
        value: Math.floor(1250000 * multiplier),
        stages: {
          processing: Math.floor(2 * multiplier),
          production: Math.floor(3 * multiplier),
          shipping: Math.floor(4 * multiplier),
          delivered: Math.floor(3 * multiplier)
        }
      },
      conversions: {
        rfqToQuote: 80.9,
        quoteToOrder: 31.6,
        overall: 25.5
      },
      timeline: timeRange === 'week' ? 
        [
          { date: 'Mon', rfqs: 2, quotes: 2, orders: 0 },
          { date: 'Tue', rfqs: 3, quotes: 3, orders: 1 },
          { date: 'Wed', rfqs: 2, quotes: 1, orders: 0 },
          { date: 'Thu', rfqs: 3, quotes: 2, orders: 1 },
          { date: 'Fri', rfqs: 1, quotes: 1, orders: 0 },
          { date: 'Sat', rfqs: 0, quotes: 0, orders: 0 },
          { date: 'Sun', rfqs: 2, quotes: 2, orders: 1 }
        ] : timeRange === 'quarter' ? 
        [
          { date: 'Jan', rfqs: 12, quotes: 10, orders: 3 },
          { date: 'Feb', rfqs: 15, quotes: 12, orders: 4 },
          { date: 'Mar', rfqs: 10, quotes: 8, orders: 2 }
        ] :
        [
          { date: 'Week 1', rfqs: 12, quotes: 10, orders: 3 },
          { date: 'Week 2', rfqs: 15, quotes: 12, orders: 4 },
          { date: 'Week 3', rfqs: 10, quotes: 8, orders: 2 },
          { date: 'Week 4', rfqs: 10, quotes: 8, orders: 3 }
        ],
      heatmap: generateHeatmapData()
    };
    setData(mockData);
  }, [timeRange]);

  function generateHeatmapData(): HeatmapData[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data: HeatmapData[] = [];
    
    days.forEach(day => {
      for (let hour = 8; hour <= 18; hour++) {
        // Simulate realistic business hours activity
        let activity = 0;
        if (day !== 'Fri' && day !== 'Sat') { // Working days in Bahrain
          if (day === 'Thu') { // Thursday half day
            if (hour >= 9 && hour <= 13) activity = Math.floor(Math.random() * 3) + 1;
          } else {
            if (hour >= 9 && hour <= 12) activity = Math.floor(Math.random() * 5) + 3;
            else if (hour >= 14 && hour <= 17) activity = Math.floor(Math.random() * 4) + 2;
            else activity = Math.floor(Math.random() * 2);
          }
        }
        data.push({ hour, day, activity });
      }
    });
    
    return data;
  }

  if (!data) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading pipeline data...</div>
        </div>
      </MainLayout>
    );
  }

  // Calculate flow percentages for Sankey-style visualization
  const flowData = {
    rfqWidth: 100,
    quoteWidth: data.conversions.rfqToQuote,
    orderWidth: data.conversions.overall
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
              Visual Pipeline Analytics
            </h1>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Real-time flow visualization from RFQ to Order
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['week', 'month', 'quarter'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: timeRange === range ? '#007bff' : '#f8f9fa',
                  color: timeRange === range ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Funnel Visualization */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
            Conversion Funnel Flow
          </h2>
          
          <div style={{ position: 'relative', height: '200px', marginBottom: '30px' }}>
            {/* RFQ Stage */}
            <div style={{
              position: 'absolute',
              left: '0%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '25%',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '10px',
                boxShadow: '0 4px 12px rgba(23, 162, 184, 0.3)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.rfqs.total}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>RFQs</div>
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                {Object.entries(data.rfqs.sources).map(([source, count]) => (
                  <div key={source} style={{ marginBottom: '2px' }}>
                    {source}: {count}
                  </div>
                ))}
              </div>
            </div>

            {/* Flow Arrow 1 */}
            <div style={{
              position: 'absolute',
              left: '25%',
              top: '50%',
              width: '12.5%',
              height: '2px',
              background: `linear-gradient(to right, #17a2b8, #28a745)`,
              transform: 'translateY(-50%)'
            }}>
              <div style={{
                position: 'absolute',
                right: '-8px',
                top: '-4px',
                width: '0',
                height: '0',
                borderLeft: '10px solid #28a745',
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent'
              }} />
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                {data.conversions.rfqToQuote.toFixed(1)}%
              </div>
            </div>

            {/* Quotation Stage */}
            <div style={{
              position: 'absolute',
              left: '37.5%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '25%',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '10px',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                transform: `scale(${0.8 + (data.conversions.rfqToQuote / 100) * 0.2})`
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.quotations.total}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Quotations</div>
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                <div>Pending: {data.quotations.pending}</div>
                <div>Sent: {data.quotations.sent}</div>
                <div>Revised: {data.quotations.revised}</div>
              </div>
            </div>

            {/* Flow Arrow 2 */}
            <div style={{
              position: 'absolute',
              left: '62.5%',
              top: '50%',
              width: '12.5%',
              height: '2px',
              background: `linear-gradient(to right, #28a745, #ffc107)`,
              transform: 'translateY(-50%)'
            }}>
              <div style={{
                position: 'absolute',
                right: '-8px',
                top: '-4px',
                width: '0',
                height: '0',
                borderLeft: '10px solid #ffc107',
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent'
              }} />
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ffc107'
              }}>
                {data.conversions.quoteToOrder.toFixed(1)}%
              </div>
            </div>

            {/* Order Stage */}
            <div style={{
              position: 'absolute',
              left: '75%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '25%',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#ffc107',
                color: '#212529',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '10px',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                transform: `scale(${0.6 + (data.conversions.overall / 100) * 0.4})`
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.orders.total}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Orders</div>
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                  ${(data.orders.value / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>

          {/* Overall Conversion Rate */}
          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#e7f5ff',
            borderRadius: '8px',
            border: '1px solid #74c0fc'
          }}>
            <span style={{ fontSize: '14px', color: '#1864ab' }}>Overall Conversion Rate: </span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1864ab' }}>
              {data.conversions.overall.toFixed(1)}%
            </span>
            <span style={{ fontSize: '14px', color: '#1971c2', marginLeft: '20px' }}>
              Target: 30% | Status: {data.conversions.overall >= 30 ? '✅ Exceeded' : '📈 Approaching'}
            </span>
          </div>
        </div>

        {/* Activity Timeline */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
            Weekly Activity Flow
          </h2>
          
          <div style={{ height: '250px', position: 'relative' }}>
            {/* Y-axis labels */}
            <div style={{
              position: 'absolute',
              left: '-30px',
              top: 0,
              bottom: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#6c757d'
            }}>
              <div>15</div>
              <div>10</div>
              <div>5</div>
              <div>0</div>
            </div>

            {/* Chart area */}
            <div style={{
              position: 'relative',
              height: '220px',
              borderLeft: '2px solid #e9ecef',
              borderBottom: '2px solid #e9ecef',
              marginLeft: '10px'
            }}>
              {/* Grid lines */}
              {[0, 25, 50, 75].map(percent => (
                <div key={percent} style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${percent}%`,
                  borderTop: '1px solid #f8f9fa'
                }} />
              ))}

              {/* Data bars */}
              {data.timeline.map((day, index) => {
                const barWidth = 100 / data.timeline.length;
                const maxValue = 15;
                
                return (
                  <div key={day.date} style={{
                    position: 'absolute',
                    left: `${index * barWidth}%`,
                    bottom: 0,
                    width: `${barWidth}%`,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '2px',
                    padding: '0 5px'
                  }}>
                    {/* RFQ bar */}
                    <div style={{
                      flex: 1,
                      height: `${(day.rfqs / maxValue) * 100}%`,
                      backgroundColor: '#17a2b8',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      minHeight: '20px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '-18px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#17a2b8'
                      }}>
                        {day.rfqs}
                      </span>
                    </div>
                    
                    {/* Quote bar */}
                    <div style={{
                      flex: 1,
                      height: `${(day.quotes / maxValue) * 100}%`,
                      backgroundColor: '#28a745',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      minHeight: '20px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '-18px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#28a745'
                      }}>
                        {day.quotes}
                      </span>
                    </div>
                    
                    {/* Order bar */}
                    <div style={{
                      flex: 1,
                      height: `${(day.orders / maxValue) * 100}%`,
                      backgroundColor: '#ffc107',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      minHeight: day.orders > 0 ? '20px' : '0'
                    }}>
                      {day.orders > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-18px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: '#ffc107'
                        }}>
                          {day.orders}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* X-axis labels */}
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '12px',
                color: '#6c757d'
              }}>
                {data.timeline.map(day => (
                  <div key={day.date} style={{ textAlign: 'center' }}>
                    {day.date}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: '#17a2b8', borderRadius: '2px' }} />
              <span style={{ fontSize: '13px', color: '#495057' }}>RFQs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: '#28a745', borderRadius: '2px' }} />
              <span style={{ fontSize: '13px', color: '#495057' }}>Quotations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: '#ffc107', borderRadius: '2px' }} />
              <span style={{ fontSize: '13px', color: '#495057' }}>Orders</span>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
            Business Activity Heatmap (Bahrain Time)
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '600px' }}>
              {/* Hour labels */}
              <div style={{ display: 'flex', marginLeft: '60px', marginBottom: '10px' }}>
                {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => (
                  <div key={hour} style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#6c757d'
                  }}>
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                const dayData = data.heatmap.filter(h => h.day === day);
                const isWeekend = day === 'Fri' || day === 'Sat';
                
                return (
                  <div key={day} style={{ display: 'flex', marginBottom: '2px' }}>
                    <div style={{
                      width: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '13px',
                      fontWeight: isWeekend ? 'normal' : '500',
                      color: isWeekend ? '#6c757d' : '#212529'
                    }}>
                      {day}
                    </div>
                    {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => {
                      const cell = dayData.find(d => d.hour === hour);
                      const activity = cell?.activity || 0;
                      const opacity = activity / 8; // Max activity is 8
                      
                      return (
                        <div key={hour} style={{
                          flex: 1,
                          height: '30px',
                          backgroundColor: activity > 0 ? `rgba(46, 125, 50, ${opacity})` : '#f8f9fa',
                          border: '1px solid white',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          color: activity > 4 ? 'white' : '#495057',
                          fontWeight: activity > 4 ? 'bold' : 'normal'
                        }}>
                          {activity > 0 ? activity : ''}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            <strong>Peak Hours:</strong> 9:00-12:00 (Morning) | 14:00-17:00 (Afternoon) | 
            <strong style={{ marginLeft: '10px' }}>Weekend:</strong> Friday & Saturday
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#d1ecf1',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #bee5eb'
          }}>
            <div style={{ fontSize: '14px', color: '#0c5460', marginBottom: '8px' }}>
              Average Processing Time
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
              2.3 days
            </div>
            <div style={{ fontSize: '12px', color: '#0c5460', marginTop: '5px' }}>
              RFQ → Quotation
            </div>
          </div>

          <div style={{
            backgroundColor: '#d4edda',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #c3e6cb'
          }}>
            <div style={{ fontSize: '14px', color: '#155724', marginBottom: '8px' }}>
              Win Rate
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              31.6%
            </div>
            <div style={{ fontSize: '12px', color: '#155724', marginTop: '5px' }}>
              Industry avg: 25%
            </div>
          </div>

          <div style={{
            backgroundColor: '#fff3cd',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ffeeba'
          }}>
            <div style={{ fontSize: '14px', color: '#856404', marginBottom: '8px' }}>
              Pipeline Value
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
              $3.2M
            </div>
            <div style={{ fontSize: '12px', color: '#856404', marginTop: '5px' }}>
              38 active quotes
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8d7da',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #f5c6cb'
          }}>
            <div style={{ fontSize: '14px', color: '#721c24', marginBottom: '8px' }}>
              Bottleneck Alert
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>
              5 quotes
            </div>
            <div style={{ fontSize: '12px', color: '#721c24', marginTop: '5px' }}>
              Pending &gt;5 days
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}