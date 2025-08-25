// 🧠 Mathematical Consciousness Competition Intelligence Engine
// Business Presentation: "Advanced Competitive Analysis and Bidding Optimization"
// Hidden Reality: Julius-Validated Win Probability Calculations

// Julius-Validated Mathematical Constants (Hidden from Business Layer)
const CONSCIOUSNESS_CONSTANTS = {
  // ABB competitive intelligence (based on business reality data)
  ABB_THREAT_MULTIPLIER: 0.3, // 70% reduction in win probability when ABB competes
  ABB_PRICING_AGGRESSION: 0.85, // ABB typically prices 15% below cost to kill competition
  
  // V6.0 Julius-Validated Win Probability Factors (33.85/28.72/37.44)
  CUSTOMER_GRADE_WEIGHT: 0.3385, // 33.85% - Customer relationship priority (exploration-dominant)
  PRODUCT_TYPE_WEIGHT: 0.2872,   // 28.72% - Technical expertise advantage (precision-focused)  
  URGENCY_WEIGHT: 0.1872,        // 18.72% - Opportunity timing factor
  RELATIONSHIP_WEIGHT: 0.1871,   // 18.71% - Historical relationship value (totals ~100%)
  
  // Minimum acceptable margins (consciousness-guided thresholds)
  MIN_MARGIN_THRESHOLD: 0.10, // 10% minimum margin
  PREFERRED_MARGIN_TARGET: 0.18, // 18% optimal margin
  
  // Center-seeking win probability targets
  TARGET_WIN_RATE: 0.65, // 65% optimal win rate
  MIN_VIABLE_WIN_RATE: 0.40 // Below 40%, don't bid
};

// Opportunity Analysis Interface
export interface OpportunityAnalysis {
  opportunityId: string;
  winProbability: number;
  competitiveThreat: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: 'BID_AGGRESSIVELY' | 'BID_CAUTIOUSLY' | 'PRICE_PREMIUM' | 'DO_NOT_BID';
  
  // Mathematical consciousness factors (hidden in business presentation)
  riskFactors: string[];
  advantages: string[];
  
  // Business intelligence insights
  optimalPricing: {
    suggestedDiscount: number;
    minimumMargin: number;
    maxBidAmount: number;
  };
  
  strategicInsights: string[];
  confidenceLevel: number;
}

export interface CompetitorProfile {
  name: string;
  threatLevel: number; // 0-1 scale
  typicalDiscount: number;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
}

export interface OpportunityInput {
  id: string;
  customerGrade: 'A' | 'B' | 'C' | 'D';
  productType: string;
  estimatedValue: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  relationshipYears: number;
  
  // Competitive intelligence
  competitors: string[];
  isABBPresent: boolean;
  
  // Product details
  category: 'flow_meters' | 'level_meters' | 'gas_analyzers' | 'electricity_meters' | 'instruments';
  brand: string;
  complexity: 'simple' | 'standard' | 'complex' | 'custom';
  
  // Timeline
  responseDeadline: Date;
  expectedDecisionDate: Date;
  urgentDelivery: boolean;
}

// Main Competition Intelligence Engine
export const analyzeOpportunity = (opportunity: OpportunityInput): OpportunityAnalysis => {
  // Perform mathematical consciousness analysis
  const winProbability = calculateWinProbability(opportunity);
  const competitiveThreat = assessCompetitiveThreat(opportunity);
  const recommendedAction = determineOptimalAction(opportunity, winProbability, competitiveThreat);
  
  // Generate business intelligence insights
  const riskFactors = identifyRiskFactors(opportunity);
  const advantages = identifyCompetitiveAdvantages(opportunity);
  const optimalPricing = calculateOptimalPricing(opportunity, winProbability);
  const strategicInsights = generateStrategicInsights(opportunity, winProbability);
  const confidenceLevel = calculateAnalysisConfidence(opportunity);
  
  return {
    opportunityId: opportunity.id,
    winProbability,
    competitiveThreat,
    recommendedAction,
    riskFactors,
    advantages,
    optimalPricing,
    strategicInsights,
    confidenceLevel
  };
};

// Julius-Validated Win Probability Calculator
const calculateWinProbability = (opportunity: OpportunityInput): number => {
  let probability = 0.5; // Base 50% probability
  
  // Customer Grade Impact (consciousness-weighted)
  const customerImpact = calculateCustomerGradeProbability(opportunity.customerGrade);
  probability += customerImpact * CONSCIOUSNESS_CONSTANTS.CUSTOMER_GRADE_WEIGHT;
  
  // Product Type Advantage
  const productImpact = calculateProductAdvantage(opportunity.category, opportunity.brand);
  probability += productImpact * CONSCIOUSNESS_CONSTANTS.PRODUCT_TYPE_WEIGHT;
  
  // Urgency Factor (consciousness principle: urgency = opportunity)
  const urgencyImpact = calculateUrgencyAdvantage(opportunity.urgencyLevel);
  probability += urgencyImpact * CONSCIOUSNESS_CONSTANTS.URGENCY_WEIGHT;
  
  // Relationship Value
  const relationshipImpact = calculateRelationshipAdvantage(opportunity.relationshipYears);
  probability += relationshipImpact * CONSCIOUSNESS_CONSTANTS.RELATIONSHIP_WEIGHT;
  
  // ABB Presence (CRITICAL consciousness factor)
  if (opportunity.isABBPresent) {
    probability *= CONSCIOUSNESS_CONSTANTS.ABB_THREAT_MULTIPLIER; // Massive reduction
  }
  
  // Complexity Factor (PH Trading's sweet spot)
  if (opportunity.complexity === 'complex' || opportunity.complexity === 'custom') {
    probability += 0.15; // 15% bonus for complex solutions
  }
  
  // Small Order Size Advantage (ABB weakness)
  if (opportunity.estimatedValue < 20000) {
    probability += 0.20; // 20% bonus for small orders ABB ignores
  }
  
  // Center-seeking probability normalization
  return Math.max(0.05, Math.min(0.95, probability));
};

// V6.0 Julius-Validated Customer Grade Probability Mapping
const calculateCustomerGradeProbability = (grade: 'A' | 'B' | 'C' | 'D'): number => {
  // Consciousness-guided customer value distribution
  switch (grade) {
    case 'A': return 0.3744;  // 37.44% bonus - Context-dominant premium customers
    case 'B': return 0.2872;  // 28.72% bonus - Precision-focused reliable customers  
    case 'C': return 0.0;     // Neutral - developing relationships
    case 'D': return -0.3385; // -33.85% penalty - exploration reveals high-risk patterns
    default: return 0.0;
  }
};

// Product Category Advantage Calculator
const calculateProductAdvantage = (category: string, brand: string): number => {
  // Mathematical consciousness insights from business reality
  const productMatrix: Record<string, number> = {
    'gas_analyzers': 0.25,    // Servomex specialty - 25% advantage
    'flow_meters': -0.10,     // E+H competitive but ABB strong - 10% disadvantage  
    'level_meters': 0.05,     // Slight advantage
    'electricity_meters': 0.15, // Landis+Gyr/Iskraemeco niche - 15% advantage
    'instruments': 0.10       // GIC cost advantage - 10% advantage
  };
  
  return productMatrix[category] || 0.0;
};

// Urgency Advantage Calculator (Consciousness Principle: Speed = Value)
const calculateUrgencyAdvantage = (urgency: string): number => {
  switch (urgency) {
    case 'EMERGENCY': return 0.35; // 35% bonus - ABB can't respond fast enough
    case 'HIGH': return 0.20;      // 20% bonus - speed advantage
    case 'MEDIUM': return 0.05;    // 5% slight bonus
    case 'LOW': return -0.05;      // 5% penalty - gives ABB time to respond
    default: return 0.0;
  }
};

// Relationship Value Calculator
const calculateRelationshipAdvantage = (years: number): number => {
  if (years >= 5) return 0.25;    // 25% bonus for long-term relationships
  if (years >= 2) return 0.15;    // 15% bonus for established relationships
  if (years >= 1) return 0.10;    // 10% bonus for existing customers
  return 0.05; // 5% bonus for new relationships (potential)
};

// Competitive Threat Assessment
const assessCompetitiveThreat = (opportunity: OpportunityInput): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  let threatScore = 0;
  
  // ABB presence is automatic CRITICAL threat
  if (opportunity.isABBPresent) {
    return 'CRITICAL';
  }
  
  // Multiple competitors
  if (opportunity.competitors.length > 3) threatScore += 0.3;
  else if (opportunity.competitors.length > 1) threatScore += 0.2;
  
  // High-value opportunity attracts competition
  if (opportunity.estimatedValue > 100000) threatScore += 0.3;
  else if (opportunity.estimatedValue > 50000) threatScore += 0.2;
  
  // Standard products = more competition
  if (opportunity.complexity === 'simple' || opportunity.complexity === 'standard') {
    threatScore += 0.2;
  }
  
  // Long timeline = more competitive pressure
  const timeToDecision = opportunity.expectedDecisionDate.getTime() - Date.now();
  const weeksToDecision = timeToDecision / (1000 * 60 * 60 * 24 * 7);
  if (weeksToDecision > 8) threatScore += 0.2;
  
  // Center-seeking threat classification
  if (threatScore >= 0.6) return 'HIGH';
  if (threatScore >= 0.4) return 'MEDIUM';
  return 'LOW';
};

// Optimal Action Determination (Mathematical Consciousness Decision Tree)
const determineOptimalAction = (
  opportunity: OpportunityInput, 
  winProbability: number, 
  threatLevel: string
): 'BID_AGGRESSIVELY' | 'BID_CAUTIOUSLY' | 'PRICE_PREMIUM' | 'DO_NOT_BID' => {
  
  // Julius-validated decision matrix
  if (opportunity.isABBPresent && opportunity.estimatedValue > 50000) {
    return 'DO_NOT_BID'; // Never compete with ABB on large standard deals
  }
  
  if (winProbability < CONSCIOUSNESS_CONSTANTS.MIN_VIABLE_WIN_RATE) {
    return 'DO_NOT_BID'; // Below minimum viable win rate
  }
  
  if (winProbability > 0.75 && opportunity.customerGrade === 'A') {
    return 'PRICE_PREMIUM'; // High probability with premium customer
  }
  
  if (winProbability > 0.60 || opportunity.urgencyLevel === 'EMERGENCY') {
    return 'BID_AGGRESSIVELY'; // Good chance or emergency opportunity
  }
  
  if (threatLevel === 'CRITICAL' || threatLevel === 'HIGH') {
    return 'BID_CAUTIOUSLY'; // High competition requires careful approach
  }
  
  return 'BID_CAUTIOUSLY'; // Default conservative approach
};

// Risk Factor Identification
const identifyRiskFactors = (opportunity: OpportunityInput): string[] => {
  const risks = [];
  
  if (opportunity.isABBPresent) {
    risks.push('ABB is competing - expect aggressive pricing below market rates');
  }
  
  if (opportunity.competitors.length > 3) {
    risks.push('High competition levels may drive margins to unsustainable levels');
  }
  
  if (opportunity.customerGrade === 'C' || opportunity.customerGrade === 'D') {
    risks.push('Customer payment history indicates potential collection issues');
  }
  
  if (opportunity.category === 'flow_meters' && opportunity.estimatedValue > 30000) {
    risks.push('Flow meters above $30K typically targeted by ABB with loss-leader pricing');
  }
  
  if (opportunity.complexity === 'simple' && opportunity.estimatedValue > 20000) {
    risks.push('Simple products at high value attract maximum competitive pressure');
  }
  
  const timeToDecision = opportunity.expectedDecisionDate.getTime() - Date.now();
  if (timeToDecision > (8 * 7 * 24 * 60 * 60 * 1000)) { // 8 weeks
    risks.push('Long decision timeline allows competitors to develop aggressive strategies');
  }
  
  return risks;
};

// Competitive Advantage Identification
const identifyCompetitiveAdvantages = (opportunity: OpportunityInput): string[] => {
  const advantages = [];
  
  if (opportunity.urgencyLevel === 'EMERGENCY') {
    advantages.push('Emergency timeline favors local responsiveness and immediate availability');
  }
  
  if (opportunity.estimatedValue < 20000) {
    advantages.push('Small order size below ABB minimum engagement threshold');
  }
  
  if (opportunity.complexity === 'complex' || opportunity.complexity === 'custom') {
    advantages.push('Complex solutions require technical expertise and local support');
  }
  
  if (opportunity.relationshipYears >= 3) {
    advantages.push('Established relationship provides trust advantage over new competitors');
  }
  
  if (opportunity.category === 'gas_analyzers') {
    advantages.push('Servomex specialization provides technical and service advantages');
  }
  
  if (opportunity.category === 'electricity_meters') {
    advantages.push('Landis+Gyr and Iskraemeco partnerships offer competitive pricing');
  }
  
  if (!opportunity.isABBPresent && opportunity.competitors.length <= 2) {
    advantages.push('Limited competition allows for optimal pricing and margin protection');
  }
  
  return advantages;
};

// Optimal Pricing Calculator (Consciousness-Guided Pricing Engine)
const calculateOptimalPricing = (opportunity: OpportunityInput, winProbability: number) => {
  let suggestedDiscount = 0;
  let minimumMargin = CONSCIOUSNESS_CONSTANTS.MIN_MARGIN_THRESHOLD;
  
  // Base discount based on competition and win probability
  if (opportunity.isABBPresent) {
    suggestedDiscount = 0.12; // 12% discount to compete with ABB (often not enough)
    minimumMargin = 0.05; // Accept lower margins when fighting ABB
  } else if (winProbability < 0.5) {
    suggestedDiscount = 0.08; // 8% discount for competitive situations
  } else if (winProbability > 0.75) {
    suggestedDiscount = 0.02; // 2% minimal discount for strong position
    minimumMargin = CONSCIOUSNESS_CONSTANTS.PREFERRED_MARGIN_TARGET;
  }
  
  // Customer grade adjustments
  if (opportunity.customerGrade === 'A') {
    suggestedDiscount -= 0.02; // 2% less discount for premium customers
  } else if (opportunity.customerGrade === 'D') {
    suggestedDiscount = 0; // No discount for risky customers
    minimumMargin = 0.20; // Higher margin to offset risk
  }
  
  // Urgency premium
  if (opportunity.urgencyLevel === 'EMERGENCY') {
    suggestedDiscount = Math.max(0, suggestedDiscount - 0.05); // 5% less discount
    minimumMargin += 0.05; // 5% urgency premium
  }
  
  // Calculate maximum bid amount
  const estimatedCost = opportunity.estimatedValue * (1 - CONSCIOUSNESS_CONSTANTS.PREFERRED_MARGIN_TARGET);
  const maxBidAmount = estimatedCost / (1 - minimumMargin);
  
  return {
    suggestedDiscount: Math.round(suggestedDiscount * 100) / 100,
    minimumMargin: Math.round(minimumMargin * 100) / 100,
    maxBidAmount: Math.round(maxBidAmount)
  };
};

// Strategic Insights Generator
const generateStrategicInsights = (opportunity: OpportunityInput, winProbability: number): string[] => {
  const insights = [];
  
  // ABB-specific strategy
  if (opportunity.isABBPresent) {
    insights.push('Focus on service value, local support, and delivery speed rather than price competition');
    insights.push('Consider proposing alternative products where ABB is weaker (e.g., Servomex gas analyzers)');
  }
  
  // Win probability insights
  if (winProbability > 0.70) {
    insights.push('Strong position allows for premium pricing and margin protection');
  } else if (winProbability < 0.45) {
    insights.push('Consider strategic no-bid or focus resources on higher probability opportunities');
  }
  
  // Customer-specific strategy
  if (opportunity.customerGrade === 'A' && opportunity.relationshipYears >= 3) {
    insights.push('Leverage long-term relationship for premium pricing and extended payment terms');
  }
  
  // Product strategy
  if (opportunity.category === 'gas_analyzers') {
    insights.push('Emphasize Servomex technical superiority and specialized calibration services');
  }
  
  // Timeline strategy
  if (opportunity.urgencyLevel === 'EMERGENCY') {
    insights.push('Emergency timeline is significant advantage - price accordingly');
  }
  
  // Value strategy
  if (opportunity.estimatedValue < 15000) {
    insights.push('Small order size favors competitive pricing for relationship building');
  }
  
  return insights;
};

// Analysis Confidence Calculator
const calculateAnalysisConfidence = (opportunity: OpportunityInput): number => {
  let confidence = 0.7; // Base confidence
  
  // More data = higher confidence
  if (opportunity.relationshipYears > 0) confidence += 0.1;
  if (opportunity.customerGrade) confidence += 0.1;
  if (opportunity.competitors.length > 0) confidence += 0.1;
  
  // Clear competitive landscape = higher confidence
  if (opportunity.isABBPresent) confidence += 0.1; // Clear threat assessment
  if (opportunity.urgencyLevel === 'EMERGENCY') confidence += 0.05;
  
  return Math.min(0.95, confidence);
};

// Portfolio Opportunity Analysis
export const analyzeOpportunityPortfolio = (opportunities: OpportunityInput[]) => {
  const analyses = opportunities.map(analyzeOpportunity);
  
  const stats = {
    totalOpportunities: opportunities.length,
    recommendedBids: analyses.filter(a => a.recommendedAction !== 'DO_NOT_BID').length,
    averageWinProbability: analyses.reduce((sum, a) => sum + a.winProbability, 0) / analyses.length,
    abbThreats: opportunities.filter(o => o.isABBPresent).length,
    highValueOpportunities: opportunities.filter(o => o.estimatedValue > 50000).length,
    emergencyOpportunities: opportunities.filter(o => o.urgencyLevel === 'EMERGENCY').length
  };
  
  // Strategic portfolio insights
  const insights = [];
  
  if (stats.abbThreats / stats.totalOpportunities > 0.4) {
    insights.push('High ABB competition level - consider market segmentation strategy');
  }
  
  if (stats.averageWinProbability < 0.5) {
    insights.push('Overall win probability below target - refocus on core strengths');
  }
  
  if (stats.emergencyOpportunities > 0) {
    insights.push('Emergency opportunities available - prioritize for premium pricing');
  }
  
  const portfolioValue = opportunities.reduce((sum, o) => sum + o.estimatedValue, 0);
  const weightedWinRate = analyses.reduce((sum, a, i) => 
    sum + (a.winProbability * opportunities[i].estimatedValue), 0) / portfolioValue;
  
  return {
    stats,
    insights,
    analyses,
    portfolioValue,
    expectedValue: portfolioValue * weightedWinRate,
    averageWinProbability: Math.round(stats.averageWinProbability * 100),
    weightedWinRate: Math.round(weightedWinRate * 100)
  };
};

// Competitor Database (Business Reality Intelligence)
export const getCompetitorProfiles = (): Record<string, CompetitorProfile> => {
  return {
    'ABB': {
      name: 'ABB Ltd',
      threatLevel: 0.9, // 90% threat level
      typicalDiscount: 0.20, // 20% typical discount (can go to zero margin)
      strengths: [
        'Deep pockets for price wars',
        'Global brand recognition', 
        'Extensive product range',
        'Corporate backing'
      ],
      weaknesses: [
        'Slow response time (8+ weeks)',
        'Minimum order quantities',
        'Corporate bureaucracy',
        'No local technical support'
      ],
      marketShare: 0.35 // 35% market share
    },
    'Schneider Electric': {
      name: 'Schneider Electric',
      threatLevel: 0.6,
      typicalDiscount: 0.12,
      strengths: ['Strong automation portfolio', 'Good technical support'],
      weaknesses: ['Higher pricing', 'Limited local presence'],
      marketShare: 0.15
    },
    'Siemens': {
      name: 'Siemens AG',
      threatLevel: 0.5,
      typicalDiscount: 0.10,
      strengths: ['Quality products', 'Strong engineering'],
      weaknesses: ['Premium pricing', 'Slow delivery'],
      marketShare: 0.12
    }
  };
};