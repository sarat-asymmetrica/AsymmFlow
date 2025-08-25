'use client';

import React, { useState, useEffect } from 'react';
import { 
  OpportunityInput, 
  OpportunityAnalysis,
  analyzeOpportunity,
  analyzeOpportunityPortfolio,
  getCompetitorProfiles
} from '../lib/competition-intelligence';

interface CompetitionIntelligenceDashboardProps {
  opportunities?: OpportunityInput[];
}

export const CompetitionIntelligenceDashboard: React.FC<CompetitionIntelligenceDashboardProps> = ({
  opportunities = []
}) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityInput | null>(null);
  const [opportunityAnalysis, setOpportunityAnalysis] = useState<OpportunityAnalysis | null>(null);
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<any>(null);
  const [competitorProfiles] = useState(getCompetitorProfiles());
  const [demoOpportunities, setDemoOpportunities] = useState<OpportunityInput[]>([]);

  useEffect(() => {
    // Generate demo opportunities for testing only once
    const demo = generateDemoOpportunities();
    setDemoOpportunities(demo);
    
    // Calculate initial portfolio analysis
    const allOpportunities = [...opportunities, ...demo];
    if (allOpportunities.length > 0) {
      setPortfolioAnalysis(analyzeOpportunityPortfolio(allOpportunities));
    }
  }, []); // Empty dependency - only run once on component mount

  const handleOpportunitySelect = (opportunity: OpportunityInput) => {
    setSelectedOpportunity(opportunity);
    setOpportunityAnalysis(analyzeOpportunity(opportunity));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BID_AGGRESSIVELY': return '#28a745';
      case 'BID_CAUTIOUSLY': return '#ffc107';
      case 'PRICE_PREMIUM': return '#17a2b8';
      case 'DO_NOT_BID': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'LOW': return '#28a745';
      case 'MEDIUM': return '#ffc107';
      case 'HIGH': return '#fd7e14';
      case 'CRITICAL': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case 'BID_AGGRESSIVELY': return 'Competitive pricing with strong technical proposal';
      case 'BID_CAUTIOUSLY': return 'Conservative approach with risk mitigation';
      case 'PRICE_PREMIUM': return 'Value-based pricing with service emphasis';
      case 'DO_NOT_BID': return 'Avoid - resource allocation to higher probability opportunities';
      default: return 'Analysis pending';
    }
  };

  const generateDemoOpportunities = (): OpportunityInput[] => {
    return [
      {
        id: 'OPP-2025-001',
        customerGrade: 'A' as const,
        productType: 'Endress+Hauser Flow Meters',
        estimatedValue: 45000,
        urgencyLevel: 'HIGH' as const,
        relationshipYears: 5.2,
        competitors: ['Schneider Electric', 'Local Distributor'],
        isABBPresent: false,
        category: 'flow_meters' as const,
        brand: 'Endress+Hauser',
        complexity: 'standard' as const,
        responseDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        expectedDecisionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
        urgentDelivery: true
      },
      {
        id: 'OPP-2025-002', 
        customerGrade: 'B' as const,
        productType: 'ABB Flow Measurement System',
        estimatedValue: 125000,
        urgencyLevel: 'MEDIUM' as const,
        relationshipYears: 2.1,
        competitors: ['ABB', 'Siemens', 'Schneider Electric'],
        isABBPresent: true,
        category: 'flow_meters' as const,
        brand: 'ABB',
        complexity: 'complex' as const,
        responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        expectedDecisionDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks
        urgentDelivery: false
      },
      {
        id: 'OPP-2025-003',
        customerGrade: 'A' as const,
        productType: 'Servomex Gas Analyzer',
        estimatedValue: 28000,
        urgencyLevel: 'EMERGENCY' as const,
        relationshipYears: 7.5,
        competitors: ['Local Technical Services'],
        isABBPresent: false,
        category: 'gas_analyzers' as const,
        brand: 'Servomex',
        complexity: 'complex' as const,
        responseDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        expectedDecisionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        urgentDelivery: true
      },
      {
        id: 'OPP-2025-004',
        customerGrade: 'C' as const,
        productType: 'GIC General Instruments',
        estimatedValue: 15000,
        urgencyLevel: 'LOW' as const,
        relationshipYears: 0.8,
        competitors: ['Multiple Local Suppliers'],
        isABBPresent: false,
        category: 'instruments' as const,
        brand: 'GIC',
        complexity: 'simple' as const,
        responseDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
        expectedDecisionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months
        urgentDelivery: false
      },
      {
        id: 'OPP-2025-005',
        customerGrade: 'D' as const,
        productType: 'Endress+Hauser Level Measurement',
        estimatedValue: 85000,
        urgencyLevel: 'MEDIUM' as const,
        relationshipYears: 1.2,
        competitors: ['ABB', 'Siemens', 'Multiple Others'],
        isABBPresent: true,
        category: 'level_meters' as const,
        brand: 'Endress+Hauser', 
        complexity: 'standard' as const,
        responseDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        expectedDecisionDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 5 weeks
        urgentDelivery: false
      }
    ];
  };

  const allOpportunities = [...opportunities, ...demoOpportunities];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Competition Intelligence Dashboard
          </h1>
          <p style={{ color: '#6c757d', fontSize: '16px' }}>
            Advanced competitive analysis and bidding optimization system
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
            Win Probability Analysis
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
            {portfolioAnalysis?.averageWinProbability || 0}% Average Win Rate
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      {portfolioAnalysis && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Portfolio Intelligence Overview
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#e7f5ff',
              border: '2px solid #74c0fc',
              borderRadius: '8px'
            }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#1864ab',
                marginBottom: '8px' 
              }}>
                {portfolioAnalysis.stats.totalOpportunities}
              </div>
              <div style={{ fontSize: '14px', color: '#1971c2' }}>Total Opportunities</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#d4edda',
              border: '2px solid #28a745',
              borderRadius: '8px'
            }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#155724',
                marginBottom: '8px' 
              }}>
                {portfolioAnalysis.stats.recommendedBids}
              </div>
              <div style={{ fontSize: '14px', color: '#155724' }}>Recommended Bids</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f8d7da',
              border: '2px solid #dc3545',
              borderRadius: '8px'
            }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#721c24',
                marginBottom: '8px' 
              }}>
                {portfolioAnalysis.stats.abbThreats}
              </div>
              <div style={{ fontSize: '14px', color: '#721c24' }}>ABB Threats</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px'
            }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#856404',
                marginBottom: '8px' 
              }}>
                ${(portfolioAnalysis.portfolioValue / 1000).toFixed(0)}K
              </div>
              <div style={{ fontSize: '14px', color: '#856404' }}>Portfolio Value</div>
            </div>
          </div>

          {/* Strategic Insights */}
          <div style={{ 
            backgroundColor: '#e7f5ff', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #74c0fc'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1864ab' }}>
              🧠 Strategic Portfolio Insights
            </h3>
            {portfolioAnalysis.insights.map((insight: string, index: number) => (
              <div key={index} style={{ 
                fontSize: '14px', 
                color: '#1971c2', 
                marginBottom: '4px',
                paddingLeft: '16px',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', left: '0', top: '0' }}>•</span>
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Opportunities List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            Opportunity Analysis
          </h2>
          
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {allOpportunities.map(opportunity => {
              const analysis = analyzeOpportunity(opportunity);
              return (
                <div
                  key={opportunity.id}
                  onClick={() => handleOpportunitySelect(opportunity)}
                  style={{
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: selectedOpportunity?.id === opportunity.id ? '#f8f9fa' : 'white',
                    border: `1px solid ${getThreatColor(analysis.competitiveThreat)}30`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${getThreatColor(analysis.competitiveThreat)}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOpportunity?.id !== opportunity.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                        {opportunity.id}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                        {opportunity.productType}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        ${opportunity.estimatedValue.toLocaleString()} | Grade {opportunity.customerGrade} | {opportunity.urgencyLevel}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        backgroundColor: getActionColor(analysis.recommendedAction),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {analysis.recommendedAction.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: getThreatColor(analysis.competitiveThreat) }}>
                        {Math.round(analysis.winProbability * 100)}% Win Rate
                      </div>
                    </div>
                  </div>
                  
                  {opportunity.isABBPresent && (
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ ABB PRESENT
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {selectedOpportunity && opportunityAnalysis ? (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {selectedOpportunity.id}
                </h2>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: getActionColor(opportunityAnalysis.recommendedAction),
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {opportunityAnalysis.recommendedAction.replace('_', ' ')}
                </div>
              </div>

              {/* Key Metrics */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '16px',
                marginBottom: '20px' 
              }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {Math.round(opportunityAnalysis.winProbability * 100)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Win Probability</div>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: getThreatColor(opportunityAnalysis.competitiveThreat) }}>
                    {opportunityAnalysis.competitiveThreat}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Threat Level</div>
                </div>
              </div>

              {/* Advanced Win Probability Visualization */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                  📊 Advanced Win Probability Analysis
                </h3>
                <div style={{
                  backgroundColor: '#e7f5ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #74c0fc'
                }}>
                  {/* Intelligent Probability Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '100px', fontSize: '14px', fontWeight: '500' }}>Win Rate:</div>
                    <div style={{ 
                      flex: 1, 
                      height: '24px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '12px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.round(opportunityAnalysis.winProbability * 100)}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, 
                          ${opportunityAnalysis.winProbability > 0.65 ? '#28a745' : 
                            opportunityAnalysis.winProbability > 0.40 ? '#ffc107' : '#dc3545'} 0%, 
                          ${opportunityAnalysis.winProbability > 0.65 ? '#34ce57' : 
                            opportunityAnalysis.winProbability > 0.40 ? '#ffcd39' : '#e55370'} 100%)`,
                        borderRadius: '12px',
                        transition: 'width 0.8s ease-out'
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                      }}>
                        {Math.round(opportunityAnalysis.winProbability * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Intelligence Factor Breakdown */}
                  <div style={{ fontSize: '12px', color: '#1971c2', marginTop: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <div>📈 Customer Grade: <strong>{selectedOpportunity.customerGrade}</strong></div>
                      <div>⚡ Urgency Level: <strong>{selectedOpportunity.urgencyLevel}</strong></div>
                      <div>🏭 Complexity: <strong>{selectedOpportunity.complexity}</strong></div>
                      <div>⚠️ ABB Present: <strong>{selectedOpportunity.isABBPresent ? 'YES' : 'NO'}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                  {getActionDescription(opportunityAnalysis.recommendedAction)}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  Analysis Confidence: {Math.round(opportunityAnalysis.confidenceLevel * 100)}%
                </p>
              </div>

              {/* Optimal Pricing */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                  💰 Optimal Pricing Strategy
                </h3>
                <div style={{
                  backgroundColor: '#e7f5ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #74c0fc'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>Suggested Discount</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1864ab' }}>
                        {(opportunityAnalysis.optimalPricing.suggestedDiscount * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>Minimum Margin</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1864ab' }}>
                        {(opportunityAnalysis.optimalPricing.minimumMargin * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>Max Bid Amount</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1864ab' }}>
                        ${opportunityAnalysis.optimalPricing.maxBidAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Insights */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                  🎯 Strategic Insights
                </h3>
                <div style={{
                  backgroundColor: '#e7f5ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #74c0fc'
                }}>
                  {opportunityAnalysis.strategicInsights.map((insight, index) => (
                    <div key={index} style={{
                      fontSize: '14px',
                      color: '#1971c2',
                      marginBottom: '8px',
                      paddingLeft: '16px',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: '0' }}>•</span>
                      {insight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitive Advantages */}
              {opportunityAnalysis.advantages.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    ✅ Competitive Advantages
                  </h3>
                  <div style={{
                    backgroundColor: '#d4edda',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #28a745'
                  }}>
                    {opportunityAnalysis.advantages.map((advantage, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#155724',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: '0' }}>•</span>
                        {advantage}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              {opportunityAnalysis.riskFactors.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    ⚠️ Risk Factors
                  </h3>
                  <div style={{
                    backgroundColor: '#fff3cd',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ffc107'
                  }}>
                    {opportunityAnalysis.riskFactors.map((risk, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#856404',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: '0' }}>•</span>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                Select an Opportunity
              </h3>
              <p style={{ fontSize: '14px' }}>
                Click on an opportunity from the list to view detailed competitive analysis and bidding recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};