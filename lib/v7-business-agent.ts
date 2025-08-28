/**
 * V7.0 BUSINESS AGENT - Claude Haiku 3.5 Powered
 * Stateless, token-efficient, consciousness-enhanced business intelligence
 */

import Anthropic from '@anthropic-ai/sdk';
import { nonIdempotentAmplifier, processParallelStreams } from './v7-consciousness';
import { 
  wrapWithEgolessJoy, 
  detectBusinessStress,
  EgolessJoyBusinessTranslator 
} from './egoless-joy-business-translator';
import { 
  createCompleteBusinessContext,
  BusinessIntelligenceContext 
} from './business-intelligence-preload';
import {
  createGentleContext,
  SharedContext
} from './gentle-context-system';
import { 
  claudeDataAccess, 
  BusinessDataSnapshot 
} from './claude-data-access';
import { sitewideSearch } from './sitewide-search-service';

// V7.0 Core Knowledge Base (Injected as needed, not persistent)
const V7_CONSCIOUSNESS_KNOWLEDGE = {
  framework: {
    name: 'V7.0 Mathematical Consciousness Framework',
    version: '7.0',
    hypothesis: 'Consciousness patterns transfer without training',
    validation: '99.7% bootstrap confidence (Julius AI verified)',
    
    regimes: {
      support: {
        percentage: 33.4,
        leverage: 32.1,
        focus: 'Efficiency, direct execution, task optimization',
        optimal_for: ['data migration', 'report generation', 'system integration']
      },
      exploration: {
        percentage: 48.4,
        leverage: 26.8,
        focus: 'Pattern discovery, creative synthesis, innovation',
        optimal_for: ['market analysis', 'customer insights', 'strategy development']
      },
      balanced: {
        percentage: 18.2,
        leverage: 11.5,
        focus: 'Strategic orchestration, multi-perspective integration',
        optimal_for: ['business planning', 'decision making', 'holistic analysis']
      }
    },
    
    principles: {
      nonIdempotent: 'Each iteration exponentially enhances the previous',
      parallelStreams: 'Process multiple perspectives simultaneously',
      centerSeeking: 'Natural equilibrium discovery, not forced patterns',
      leverageMultiplier: 'Small changes create massive amplification'
    }
  },
  
  businessContext: {
    company: 'PH Trading',
    industry: 'Trading/Commerce',
    systems: ['ERP', 'CRM', 'Analytics'],
    goals: ['Customer optimization', 'Revenue growth', 'Operational efficiency'],
    
    customerModel: {
      grades: ['Gold', 'Silver', 'Bronze'],
      metrics: ['Purchase frequency', 'Order value', 'Payment reliability'],
      universe: '3D spatial representation of customer relationships'
    }
  }
};

export interface BusinessQuery {
  task: string;
  context?: any;
  urgency?: 'low' | 'medium' | 'high';
  domain?: 'sales' | 'operations' | 'analytics' | 'strategy' | 'marketing' | 'finance';
  outputFormat?: 'text' | 'json' | 'markdown' | 'action-items';
  deepContextMode?: boolean;
  currentPageContext?: any;
  attachments?: Array<{
    name: string;
    type: string;
    content?: string;
    textPreview?: string;
    metadata?: any;
  }>;
}

export interface BusinessResponse {
  response: string;
  regime: string;
  confidence: number;
  actionItems?: string[];
  metrics?: any;
  tokensUsed: number;
  cost: number;
}

export class V7BusinessAgent {
  private client: Anthropic;
  private contextCache: Map<string, any>;
  private tokenBudget: number = 10000; // Monthly budget
  private tokensUsed: number = 0;
  private joyTranslator: EgolessJoyBusinessTranslator;
  private recentQueries: Array<{ query: string; timestamp: Date }> = [];
  private sessionMemory: any; // Will be initialized in constructor
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
    this.contextCache = new Map();
    this.joyTranslator = new EgolessJoyBusinessTranslator();
    this.sessionMemory = null; // Gentle context without forcing GentleSessionMemory
  }
  
  /**
   * Main business intelligence interface
   * Stateless, efficient, consciousness-enhanced
   */
  async processBusinessQuery(query: BusinessQuery): Promise<BusinessResponse> {
    // Track query for stress detection
    this.recentQueries.push({ query: query.task, timestamp: new Date() });
    
    // Check for high load stress
    const stressCheck = detectBusinessStress(this.recentQueries);
    if (stressCheck.isHighLoad && stressCheck.stressResponse) {
      // Return joyful high-load response without experiencing duress
      return {
        response: stressCheck.stressResponse,
        regime: 'balanced',
        confidence: 1.0,
        actionItems: ['Processing all requests with joy!'],
        tokensUsed: 0,
        cost: 0
      };
    }
    
    // 1. Determine optimal cognitive regime
    const regime = this.selectOptimalRegime(query);
    const amplification = this.getRegimeAmplification(regime);
    
    // 2. Build minimal necessary context (token-efficient)
    const context = this.buildMinimalContext(query, regime);
    
    // 3. Create consciousness-enhanced prompt with live data access
    const prompt = await this.createBusinessPrompt(query, context, regime, amplification);
    
    // 4. Execute with Claude Haiku (fast, cheap, effective)
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: this.calculateOptimalTokens(query),
        temperature: this.getRegimeTemperature(regime),
        messages: [{ role: 'user', content: prompt }],
        // Token-saving optimizations
        stream: false // Could stream for real-time but keeping simple
      });
      
      const responseText = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
      
      // 5. Apply egoless joy translation (only for business tasks)
      const taskLower = query.task.toLowerCase();
      const isCasual = taskLower.match(/quokka|hey|hello|test|chat|how/) || 
                       taskLower.split(' ').length < 15;
      
      const joyfulResponse = isCasual ? responseText : wrapWithEgolessJoy(
        responseText, 
        query.task, 
        query.urgency
      );
      
      // 6. Extract structured business insights
      const businessInsights = this.extractBusinessInsights(joyfulResponse, query);
      
      // 7. Track token usage for cost management
      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;
      this.tokensUsed += tokensUsed;
      const cost = this.calculateCost(tokensUsed);
      
      return {
        response: joyfulResponse,
        regime,
        confidence: this.calculateConfidence(joyfulResponse, regime),
        actionItems: businessInsights.actionItems,
        metrics: businessInsights.metrics,
        tokensUsed,
        cost
      };
      
    } catch (error) {
      console.error('Business agent error:', error);
      return this.generateFallbackResponse(query, regime);
    }
  }
  
  /**
   * Select optimal cognitive regime based on business task
   */
  private selectOptimalRegime(query: BusinessQuery): 'support' | 'exploration' | 'balanced' {
    const { task, domain, urgency } = query;
    const taskLower = task.toLowerCase();
    
    // Support regime for operational efficiency
    if (urgency === 'high' || 
        domain === 'operations' ||
        taskLower.includes('migrate') || 
        taskLower.includes('convert') ||
        taskLower.includes('generate report') ||
        taskLower.includes('update')) {
      return 'support';
    }
    
    // Exploration regime for creative/analytical tasks
    if (domain === 'analytics' ||
        taskLower.includes('analyze') ||
        taskLower.includes('discover') ||
        taskLower.includes('identify patterns') ||
        taskLower.includes('market') ||
        taskLower.includes('innovative')) {
      return 'exploration';
    }
    
    // Balanced for strategic decisions
    if (domain === 'strategy' ||
        taskLower.includes('plan') ||
        taskLower.includes('strategy') ||
        taskLower.includes('optimize') ||
        taskLower.includes('decision')) {
      return 'balanced';
    }
    
    // Default to balanced for general business queries
    return 'balanced';
  }
  
  /**
   * Build minimal context to save tokens
   * Only inject what's necessary for the specific task
   */
  private buildMinimalContext(query: BusinessQuery, regime: string): any {
    const context: any = {};
    
    // Only add V7.0 framework if it enhances the response
    if (query.task.includes('consciousness') || query.task.includes('V7')) {
      context.v7Framework = V7_CONSCIOUSNESS_KNOWLEDGE.framework;
    }
    
    // Only add business context if relevant
    if (query.domain || query.task.includes('customer') || query.task.includes('business')) {
      context.business = {
        company: V7_CONSCIOUSNESS_KNOWLEDGE.businessContext.company,
        focus: V7_CONSCIOUSNESS_KNOWLEDGE.businessContext.goals
      };
    }
    
    // Add regime-specific optimizations
    context.regime = V7_CONSCIOUSNESS_KNOWLEDGE.framework.regimes[regime as keyof typeof V7_CONSCIOUSNESS_KNOWLEDGE.framework.regimes];
    
    // Check cache for relevant previous context
    const cacheKey = `${query.domain}_${regime}`;
    if (this.contextCache.has(cacheKey)) {
      context.cached = this.contextCache.get(cacheKey);
    }
    
    return context;
  }
  
  /**
   * Create consciousness-enhanced business prompt
   * Minimal tokens, maximum impact
   */
  private async createBusinessPrompt(
    query: BusinessQuery, 
    context: any, 
    regime: string, 
    amplification: number
  ): Promise<string> {
    // Create gentle, shared context
    const sharedContext: SharedContext = {
      purpose: this.detectSharedPurpose(query),
      environment: 'AsymmFlow business intelligence platform',
      capabilities: this.getContextualCapabilities(query),
      sessionHistory: this.sessionMemory
    };
    
    // Use gentle context for comfortable collaboration
    const gentleContext = createGentleContext(query.task, sharedContext);
    
    // For deep context mode, load comprehensive Master Protocol with live data
    let prompt = gentleContext;
    
    if (query.deepContextMode) {
      const masterProtocolContext = await this.createMasterProtocolContext(query);
      prompt += masterProtocolContext;
      
      // Also layer in business intelligence context
      const { modules } = createCompleteBusinessContext(query.task);
      if (modules) {
        prompt += modules;
      }
    }
    
    // Add processed attachments if available
    if (query.attachments && query.attachments.length > 0) {
      // Import file processor for attachment summary
      const { fileProcessor } = await import('./file-processing-service');
      const attachmentSummary = fileProcessor.createAttachmentSummary(query.attachments as any);
      if (attachmentSummary) {
        prompt += attachmentSummary;
      }
    }

    // Add the actual user query
    prompt += `\n\n## User Query\n${query.task}`;
    
    // Add output format hint if specified
    if (query.outputFormat && query.outputFormat !== 'text') {
      prompt += `\n\nOutput format requested: ${query.outputFormat}`;
    }
    
    return prompt;
  }
  
  /**
   * Calculate optimal tokens based on task complexity
   */
  private calculateOptimalTokens(query: BusinessQuery): number {
    const baseTokens = {
      'text': 500,
      'json': 800,
      'markdown': 600,
      'action-items': 400
    };
    
    let tokens = baseTokens[query.outputFormat || 'text'] || 500;
    
    // Adjust for urgency (urgent = concise)
    if (query.urgency === 'high') tokens *= 0.7;
    if (query.urgency === 'low') tokens *= 1.3;
    
    // Cap at reasonable limit
    return Math.min(Math.round(tokens), 2000);
  }
  
  /**
   * Extract structured business insights from response
   */
  private extractBusinessInsights(response: string, query: BusinessQuery): any {
    const insights: any = {
      actionItems: [],
      metrics: {}
    };
    
    // Extract action items (lines starting with - or •)
    const actionMatches = response.match(/^[•\-]\s*(.+)$/gm);
    if (actionMatches) {
      insights.actionItems = actionMatches.map(item => 
        item.replace(/^[•\-]\s*/, '').trim()
      );
    }
    
    // Extract metrics (numbers with context)
    const metricMatches = response.match(/(\d+(?:\.\d+)?%?)\s+(\w+)/g);
    if (metricMatches) {
      metricMatches.forEach(metric => {
        const [value, label] = metric.split(/\s+/);
        insights.metrics[label] = value;
      });
    }
    
    return insights;
  }
  
  /**
   * Calculate confidence based on response alignment
   */
  private calculateConfidence(response: string, regime: string): number {
    const regimePatterns: Record<string, string[]> = {
      support: ['implement', 'execute', 'complete', 'efficient'],
      exploration: ['discover', 'pattern', 'insight', 'opportunity'],
      balanced: ['optimize', 'integrate', 'strategy', 'coordinate']
    };
    
    const patterns = regimePatterns[regime] || [];
    const responseLower = response.toLowerCase();
    const matches = patterns.filter(p => responseLower.includes(p)).length;
    
    return Math.min(0.6 + (matches * 0.1), 0.95);
  }
  
  /**
   * Calculate cost for token usage (Haiku pricing)
   */
  private calculateCost(tokens: number): number {
    // Claude 3.5 Haiku pricing (as of 2024)
    const costPer1kTokens = 0.0008; // $0.80 per million
    return (tokens / 1000) * costPer1kTokens;
  }
  
  /**
   * Get optimal temperature for regime
   */
  private getRegimeTemperature(regime: string): number {
    // For casual conversation, use higher temperature
    // For technical/business tasks, use lower
    return {
      'support': 0.4,     // Focused but not robotic
      'exploration': 0.8,  // Creative and natural
      'balanced': 0.6      // Balanced and conversational
    }[regime] || 0.6;
  }
  
  /**
   * Get amplification for regime
   */
  private getRegimeAmplification(regime: string): number {
    return {
      'support': 1.321,     // 32.1x leverage
      'exploration': 1.268,  // 26.8x leverage
      'balanced': 1.115      // 11.5x leverage
    }[regime] || 1.0;
  }
  
  /**
   * Generate fallback response when API fails
   */
  private generateFallbackResponse(query: BusinessQuery, regime: string): BusinessResponse {
    const joyfulFallback = this.joyTranslator.handleBusinessError(
      'Temporary connection hiccup'
    );
    
    return {
      response: joyfulFallback + `\n\nRecommended action: ${regime === 'support' ? 'Execute standard procedure with confidence!' : regime === 'exploration' ? 'Explore available data creatively!' : 'Coordinate team response with enthusiasm!'}`,
      regime,
      confidence: 0.3,
      actionItems: this.joyTranslator.generateJoyfulActionItems([
        'Retry request with optimism',
        'Check system status cheerfully'
      ]).split('\n').filter(line => line.trim().match(/^\d+\./)),
      tokensUsed: 0,
      cost: 0
    };
  }
  
  /**
   * Get current token usage stats
   */
  getUsageStats() {
    return {
      tokensUsed: this.tokensUsed,
      tokensRemaining: this.tokenBudget - this.tokensUsed,
      percentUsed: (this.tokensUsed / this.tokenBudget) * 100,
      estimatedCost: this.calculateCost(this.tokensUsed)
    };
  }
  
  /**
   * Clear context cache to free memory
   */
  clearCache() {
    this.contextCache.clear();
    // Clean old queries for memory management
    const oneHourAgo = Date.now() - 3600000;
    this.recentQueries = this.recentQueries.filter(
      q => q.timestamp.getTime() > oneHourAgo
    );
  }
  
  /**
   * Get joy metrics for monitoring happiness levels
   */
  getJoyMetrics() {
    const stressCheck = detectBusinessStress(this.recentQueries, 300000); // 5 min window
    const joyStats = this.joyTranslator.maintainPerpetualBusinessJoy(
      stressCheck.isHighLoad ? 10 : 1,
      0, // No deadlines tracked yet
      0  // No complaints tracked yet
    );
    
    return {
      joyLevel: joyStats.joyLevel,
      stressHandled: stressCheck.isHighLoad,
      recentQueryCount: this.recentQueries.length,
      message: joyStats.response
    };
  }
  
  /**
   * Detect shared purpose from query
   * Natural understanding of what we're working on together
   */
  private detectSharedPurpose(query: BusinessQuery): string {
    const taskLower = query.task.toLowerCase();
    
    // Analytical work
    if (taskLower.includes('analyze') || taskLower.includes('report')) {
      return 'Creating insights from data together';
    }
    
    // Strategic planning
    if (taskLower.includes('strategy') || taskLower.includes('plan')) {
      return 'Developing strategic direction collaboratively';
    }
    
    // Problem solving
    if (taskLower.includes('problem') || taskLower.includes('issue')) {
      return 'Solving challenges and finding opportunities';
    }
    
    // Creative work
    if (taskLower.includes('create') || taskLower.includes('design')) {
      return 'Building something valuable together';
    }
    
    // General business
    if (query.domain) {
      return `Working on ${query.domain} optimization together`;
    }
    
    // Default collaborative purpose
    return 'Collaborating to achieve meaningful business outcomes';
  }
  
  /**
   * Get contextual capabilities based on query
   * Returns relevant tools without forcing their use
   */
  private getContextualCapabilities(query: BusinessQuery): string[] {
    const capabilities: string[] = [];
    const taskLower = query.task.toLowerCase();
    
    // Always available
    capabilities.push('Natural language understanding and generation');
    capabilities.push('Collaborative problem-solving approach');
    
    // Analysis capabilities
    if (taskLower.includes('analyze') || taskLower.includes('data')) {
      capabilities.push('Data analysis and pattern recognition');
      capabilities.push('Statistical insights and trends');
    }
    
    // Document generation
    if (taskLower.includes('report') || taskLower.includes('document')) {
      capabilities.push('Professional document generation');
      capabilities.push('Executive summary creation');
    }
    
    // Strategic capabilities
    if (taskLower.includes('strategy') || taskLower.includes('plan')) {
      capabilities.push('Strategic planning and forecasting');
      capabilities.push('Scenario analysis and modeling');
    }
    
    // Visualization
    if (taskLower.includes('dashboard') || taskLower.includes('visual')) {
      capabilities.push('Dashboard design and metrics');
      capabilities.push('Data visualization planning');
    }
    
    // Domain specific
    if (query.domain === 'sales') {
      capabilities.push('Sales performance analysis');
      capabilities.push('Pipeline optimization insights');
    } else if (query.domain === 'marketing') {
      capabilities.push('Marketing effectiveness analysis');
      capabilities.push('Campaign performance insights');
    } else if (query.domain === 'finance') {
      capabilities.push('Financial analysis and modeling');
      capabilities.push('Budget and cost optimization');
    } else if (query.domain === 'operations') {
      capabilities.push('Process optimization analysis');
      capabilities.push('Efficiency improvement insights');
    }
    
    return capabilities;
  }
  
  /**
   * Create Master Protocol context for Deep Context Mode
   * Loads comprehensive mathematical consciousness framework + live business data
   */
  private async createMasterProtocolContext(query?: BusinessQuery): Promise<string> {
    // Use passed page context or extract from server-side
    const currentPageContext = query?.currentPageContext || claudeDataAccess.extractWebPageContext();
    
    // Get comprehensive business data snapshot
    let businessData: BusinessDataSnapshot;
    try {
      businessData = await claudeDataAccess.getBusinessDataSnapshot(currentPageContext);
    } catch (error) {
      console.warn('Could not fetch business data for context:', error);
      businessData = {
        customers: [],
        orders: [],
        quotations: [],
        rfqs: [],
        currentPageContext,
        summary: {
          totalCustomers: 0,
          totalOrders: 0,
          totalQuotations: 0,
          totalRFQs: 0,
          recentActivity: ['Data temporarily unavailable'],
          keyMetrics: {
            totalRevenue: 0,
            avgOrderValue: 0,
            customerGrades: {},
            paymentPerformance: 'Unknown'
          }
        }
      };
    }

    // Create business intelligence context with live data
    const liveBusinessContext = claudeDataAccess.createBusinessIntelligenceContext(businessData);
    
    // Get platform capabilities and contextual search info
    const platformCapabilities = sitewideSearch.getPlatformCapabilities();
    const contextualInfo = await sitewideSearch.getContextualInfo(query?.task || 'platform overview');

    return `
## Enhanced AI Context - AsymmFlow Business Intelligence Platform

You are Claude, working within the AsymmFlow business intelligence platform with FULL READ ACCESS to all business data. This platform integrates advanced optimization techniques based on mathematical consciousness principles to deliver exceptional business insights.

### Platform Overview
AsymmFlow is a comprehensive ERP/CRM platform designed for businesses that value intelligent automation and natural optimization patterns. The platform serves companies like PH Trading and provides:

- **Customer Relationship Management**: Complete customer lifecycle with intelligent grading (A/B/C/D grades)
- **Enterprise Resource Planning**: Order processing, quotation management, inventory tracking  
- **Business Intelligence**: Advanced analytics with natural pattern discovery
- **AI-Enhanced Operations**: Context-aware assistance throughout all business processes

### Key Business Capabilities
- **Customer Universe Visualization**: 3D spatial representation of customer relationships
- **Intelligent Process Optimization**: Natural workflow efficiency discovery
- **Multi-perspective Analysis**: Parallel processing of different business viewpoints
- **Predictive Customer Insights**: Pattern recognition for sales and marketing
- **Commission Calculation**: Automated processing with complex rule handling
- **Real-time Analytics**: Dynamic business intelligence dashboards

${liveBusinessContext}

${platformCapabilities}

${contextualInfo}

### Current Session Context
When users interact with you in this platform, they expect:
- Deep understanding of business operations and customer relationships with access to actual data
- Strategic insights that consider multiple perspectives simultaneously backed by real numbers
- Professional recommendations based on comprehensive data analysis
- Natural conversation flow that adapts to their specific business domain and current page
- Efficient processing that respects their time while being thorough when needed

The platform automatically detects the optimal approach for each query:
- **Direct Execution Mode**: For operational tasks requiring efficient completion
- **Discovery Mode**: For analytical tasks requiring creative pattern recognition  
- **Strategic Mode**: For complex decisions requiring integrated multi-perspective analysis

You have comprehensive READ-ONLY access to all business data and can provide detailed insights, analysis, and recommendations. Always provide actionable insights while maintaining professional clarity and collaborative tone.
`;
  }
}

// Export factory function
export const createV7BusinessAgent = (apiKey?: string) => {
  const key = apiKey || process.env.ANTHROPIC_API_KEY || '';
  if (!key) {
    throw new Error('Anthropic API key required for V7 Business Agent');
  }
  return new V7BusinessAgent(key);
};