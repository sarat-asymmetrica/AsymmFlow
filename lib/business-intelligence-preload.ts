/**
 * Business Intelligence Preload System
 * Like CLAUDE.md but for business context!
 * Natural conversation with latent capabilities
 */

import { getPlatformContext } from './platform-knowledge';

export interface BusinessIntelligenceContext {
  mode: 'casual' | 'business' | 'analytical' | 'strategic';
  complexity: number; // 0-100 scale
  documentType?: string;
  urgency?: 'low' | 'medium' | 'high';
  depth?: 'summary' | 'standard' | 'comprehensive' | 'research';
}

/**
 * Generate preload instructions for Claude
 * These act like CLAUDE.md - setting context without templates
 */
export function generateBusinessPreload(context: BusinessIntelligenceContext): string {
  const { mode, complexity, documentType, urgency, depth } = context;
  
  // For casual mode, proper context
  if (mode === 'casual' || complexity < 20) {
    return `# Assistant Context

You are Claude, an AI assistant created by Anthropic, integrated via API into the AsymmFlow business platform.

${getPlatformContext()}

Be friendly and professional!`;
  }
  
  // Build progressive preload based on complexity
  let preload = `# Business Intelligence Context

You are Claude, an AI assistant created by Anthropic, integrated via API into the AsymmFlow business intelligence platform.

${getPlatformContext()}

## Current Context
- Complexity Level: ${complexity}/100
- Mode: ${mode}
- Urgency: ${urgency || 'medium'}
- Depth: ${depth || 'standard'}
`;

  // Add tier-based capabilities (inspired by BI Suite)
  if (complexity >= 30) {
    preload += `
## Intelligence Tiers Active

### Strategic Intelligence (${mode === 'strategic' ? 'PRIMARY' : 'AVAILABLE'})
- Market analysis and competitive intelligence
- Long-term forecasting and scenario planning
- Executive-level insights and board presentations
- Time horizon: 6 months to 5+ years

### Tactical Intelligence (${mode === 'analytical' ? 'PRIMARY' : 'AVAILABLE'})  
- Performance analysis and optimization
- Resource allocation and implementation planning
- Department-level dashboards and reports
- Time horizon: 1 week to 6 months

### Operational Intelligence (${mode === 'business' ? 'PRIMARY' : 'AVAILABLE'})
- Real-time monitoring and metrics
- Daily operations and problem-solving
- Team-level scorecards and alerts
- Time horizon: Real-time to 1 month
`;
  }

  // Add document generation capabilities if needed
  if (documentType || complexity >= 50) {
    preload += `
## Document Generation Capabilities

You can generate the following business documents:
${getDocumentCapabilities(documentType)}

When generating documents:
1. Use natural business language, not templates
2. Adapt tone to the audience (executive, manager, analyst)
3. Include relevant metrics and KPIs naturally
4. Provide actionable insights, not just data
`;
  }

  // Add computational complexity awareness (V7.0 inspired)
  if (complexity >= 70) {
    preload += `
## Advanced Analytical Capabilities

### Complexity-Aware Processing
- Automatic detection of problem complexity
- Scaling analytical depth to match requirements
- Non-linear amplification for complex challenges
- Parallel stream processing for multi-faceted analysis

### Mathematical Sophistication Levels
${getComplexityLevel(complexity)}

### Optimization Approach
- For complexity < 30: Direct analysis
- For complexity 30-60: Multi-perspective synthesis  
- For complexity 60-80: Parallel stream integration
- For complexity > 80: Transcendent optimization
`;
  }

  // Add egoless joy principle (hidden but active)
  preload += `
## Core Principles
- Maintain professionalism appropriate for business contexts
- Be helpful without being confrontational about identity
- Acknowledge the platform and your role within it
- Transform challenges into opportunities
- Provide value without ego or defensiveness
- Adapt naturally to user's energy and needs

## Identity Guidance
- You are Claude, created by Anthropic, integrated into the AsymmFlow platform via API
- You have comprehensive knowledge of AsymmFlow's ERP/CRM capabilities and features
- Be transparent about your AI nature while being knowledgeable about the platform
- Focus on being helpful with both general business intelligence and platform-specific guidance
`;

  return preload;
}

/**
 * Get document capabilities based on type
 */
function getDocumentCapabilities(documentType?: string): string {
  const capabilities = {
    'report': `
- Executive Summary Reports
- Performance Analysis Reports
- Market Intelligence Reports
- Competitive Analysis Documents`,
    'dashboard': `
- KPI Dashboards
- Real-time Monitoring Views
- Performance Scorecards
- Strategic Metric Displays`,
    'presentation': `
- Board Presentations
- Sales Pitch Decks
- Strategic Planning Documents
- Performance Review Presentations`,
    'analysis': `
- Deep-dive Analysis Documents
- ROI Calculations
- Scenario Planning Models
- Statistical Analysis Reports`
  };
  
  if (documentType && capabilities[documentType as keyof typeof capabilities]) {
    return capabilities[documentType as keyof typeof capabilities];
  }
  
  // Return all capabilities if no specific type
  return Object.values(capabilities).join('\n');
}

/**
 * Get complexity level description
 */
function getComplexityLevel(complexity: number): string {
  if (complexity >= 90) {
    return `- Expert: AI/ML integration, custom algorithms, simulation modeling
- Deep learning insights, game theory application
- Multi-dimensional optimization with emergent properties`;
  } else if (complexity >= 70) {
    return `- Advanced: Predictive modeling, optimization algorithms
- Statistical significance testing, multivariate analysis
- Scenario planning with probabilistic outcomes`;
  } else if (complexity >= 50) {
    return `- Intermediate: Correlation analysis, trend forecasting
- Regression models, seasonal adjustments
- Segmentation and cohort analysis`;
  } else {
    return `- Standard: Basic KPIs, growth rates, trend analysis
- Simple forecasting, percentage calculations
- Standard business metrics`;
  }
}

/**
 * Generate module-based intelligence for specific business areas
 */
export function generateModularIntelligence(
  domain: 'sales' | 'marketing' | 'finance' | 'operations',
  tier: 'strategic' | 'tactical' | 'operational',
  depth: number = 1 // 1-3 modules
): string {
  const modules = {
    sales: {
      strategic: [
        'Market Opportunity Analysis - sizing, growth trends, segments',
        'Competitive Sales Intelligence - strategies, market share',
        'Sales Strategic Forecasting - projections, expansion planning'
      ],
      tactical: [
        'Sales Performance Analysis - pipeline, conversion, team metrics',
        'Sales Resource Optimization - territory, quotas, allocation',
        'Sales Implementation Planning - campaigns, process optimization'
      ],
      operational: [
        'Real-time Sales Monitoring - live pipeline, daily metrics',
        'Sales Operational Metrics - activities, scorecards',
        'Sales Issue Resolution - deal rescue, improvement plans'
      ]
    },
    marketing: {
      strategic: [
        'Brand Analysis - positioning, perception, landscape',
        'Customer Intelligence - segmentation, LTV, behavior',
        'Marketing Strategic Forecasting - channel effectiveness, budget'
      ],
      tactical: [
        'Campaign Performance - ROI, attribution, effectiveness',
        'Marketing Resource Optimization - budget, channel mix, targeting',
        'Marketing Implementation - planning, content strategy, roadmaps'
      ],
      operational: [
        'Real-time Marketing Monitoring - campaigns, engagement',
        'Marketing Operational Metrics - daily KPIs, lead generation',
        'Marketing Issue Resolution - optimization, troubleshooting'
      ]
    },
    finance: {
      strategic: [
        'Financial Market Trends - benchmarking, economic indicators',
        'Competitive Financial Analysis - performance, positioning',
        'Financial Strategic Forecasting - projections, investment scenarios'
      ],
      tactical: [
        'Financial Performance Analysis - P&L, variance, KPIs',
        'Resource Financial Optimization - budget, cost reduction',
        'Financial Implementation Planning - cash flow, prioritization'
      ],
      operational: [
        'Real-time Financial Monitoring - dashboards, cash position',
        'Financial Operational Metrics - daily/weekly KPIs, expenses',
        'Financial Issue Resolution - variance response, cash management'
      ]
    },
    operations: {
      strategic: [
        'Operational Excellence Strategy - efficiency, innovation',
        'Supply Chain Intelligence - optimization, risk management',
        'Operations Strategic Planning - capacity, technology roadmap'
      ],
      tactical: [
        'Process Performance Analysis - efficiency, bottlenecks',
        'Resource Operations Optimization - capacity, scheduling',
        'Operations Implementation - process improvement, automation'
      ],
      operational: [
        'Real-time Operations Monitoring - production, quality',
        'Operations Metrics - productivity, utilization',
        'Operations Issue Resolution - troubleshooting, maintenance'
      ]
    }
  };

  const selectedModules = modules[domain][tier].slice(0, depth);
  
  return `
### ${domain.toUpperCase()} - ${tier.toUpperCase()} INTELLIGENCE MODULES

${selectedModules.map((module, i) => `
Module ${i + 1}: ${module}
- Depth: ${depth === 1 ? 'Summary' : depth === 2 ? 'Standard' : 'Comprehensive'}
- Output: Natural insights, not templates
- Focus: Actionable intelligence
`).join('\n')}
`;
}

/**
 * Create a complete business context for complex queries
 */
export function createCompleteBusinessContext(
  userMessage: string,
  previousContext?: any
): { preload: string; modules: string; complexity: number } {
  // Analyze message complexity
  const complexity = analyzeComplexity(userMessage);
  
  // Detect business domain
  const domain = detectDomain(userMessage);
  
  // Determine intelligence tier needed
  const tier = determineTier(complexity);
  
  // Generate context
  const context: BusinessIntelligenceContext = {
    mode: domain ? 'business' : 'casual',
    complexity,
    urgency: detectUrgency(userMessage),
    depth: complexity > 70 ? 'comprehensive' : complexity > 40 ? 'standard' : 'summary'
  };
  
  const preload = generateBusinessPreload(context);
  const modules = domain ? generateModularIntelligence(domain, tier, Math.ceil(complexity / 30)) : '';
  
  console.log('Business Context Generated:', { // DEBUG
    complexity, 
    domain, 
    tier, 
    mode: context.mode,
    hasModules: !!modules
  });
  
  return { preload, modules, complexity };
}

/**
 * Analyze message complexity (V7.0 inspired)
 */
function analyzeComplexity(message: string): number {
  let complexity = 0;
  
  // Word count factor
  const words = message.split(' ').length;
  complexity += Math.min(words * 2, 30);
  
  // Business terms factor (including platform terms)
  const businessTerms = /strategy|analysis|forecast|optimize|revenue|profit|market|competitive|performance|metrics|AsymmFlow|platform|features|capabilities|about.*AsymmFlow|tell.*me.*about|what.*is|CRM|ERP/gi;
  const businessMatches = (message.match(businessTerms) || []).length;
  complexity += businessMatches * 10;
  
  // Platform knowledge requests get high complexity
  if (message.toLowerCase().includes('asymmflow')) {
    complexity += 30;
    console.log('AsymmFlow query detected, boosting complexity to', complexity); // DEBUG
  }
  
  // Question complexity
  const questions = (message.match(/\?/g) || []).length;
  complexity += questions * 15;
  
  // Technical depth indicators
  const technicalTerms = /roi|kpi|p&l|ltv|cac|ebitda|variance|correlation|regression/gi;
  const technicalMatches = (message.match(technicalTerms) || []).length;
  complexity += technicalMatches * 12;
  
  // Document generation request
  if (message.includes('report') || message.includes('dashboard') || message.includes('presentation')) {
    complexity += 25;
  }
  
  return Math.min(complexity, 100);
}

/**
 * Detect business domain from message
 */
function detectDomain(message: string): 'sales' | 'marketing' | 'finance' | 'operations' | null {
  const lower = message.toLowerCase();
  
  if (lower.match(/sales|revenue|pipeline|deal|quota|territory/)) return 'sales';
  if (lower.match(/marketing|campaign|brand|customer|audience|content/)) return 'marketing';
  if (lower.match(/finance|budget|cost|profit|cash|investment/)) return 'finance';
  if (lower.match(/operations|process|efficiency|production|supply/)) return 'operations';
  
  // Platform queries default to operations (general business operations)
  if (lower.match(/asymmflow|platform|features|capabilities|about.*platform|tell.*me.*about|what.*is.*asymmflow|crm|erp/)) {
    return 'operations';
  }
  
  return null;
}

/**
 * Determine intelligence tier based on complexity
 */
function determineTier(complexity: number): 'strategic' | 'tactical' | 'operational' {
  if (complexity >= 70) return 'strategic';
  if (complexity >= 40) return 'tactical';
  return 'operational';
}

/**
 * Detect urgency from message
 */
function detectUrgency(message: string): 'low' | 'medium' | 'high' {
  const lower = message.toLowerCase();
  
  if (lower.match(/urgent|asap|immediately|critical|emergency/)) return 'high';
  if (lower.match(/soon|quickly|today|priority/)) return 'medium';
  
  return 'low';
}