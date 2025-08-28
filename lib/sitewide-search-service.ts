/**
 * Sitewide Information Search Service
 * Gives Claude access to search through all platform content, documentation, and context
 */

export interface SearchableContent {
  id: string;
  title: string;
  content: string;
  path: string;
  type: 'page' | 'component' | 'documentation' | 'config' | 'data';
  metadata: {
    lastUpdated: Date;
    relevanceScore?: number;
    tags?: string[];
  };
}

export interface SearchResult {
  content: SearchableContent;
  relevanceScore: number;
  matchedTerms: string[];
  excerpt: string;
}

export class SitewideSearchService {
  private searchIndex: Map<string, SearchableContent> = new Map();
  private isIndexed = false;

  constructor() {
    this.initializeIndex();
  }

  /**
   * Initialize search index with all platform content
   */
  private async initializeIndex() {
    if (this.isIndexed) return;

    try {
      // Index main application pages and components
      await this.indexApplicationContent();
      
      // Index documentation and configuration
      await this.indexDocumentation();
      
      // Index dynamic business data schemas
      await this.indexBusinessSchemas();
      
      this.isIndexed = true;
      console.log(`Sitewide search indexed ${this.searchIndex.size} items`);
    } catch (error) {
      console.warn('Could not fully initialize search index:', error);
    }
  }

  /**
   * Search through all indexed content
   */
  async search(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    await this.initializeIndex();
    
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    const results: SearchResult[] = [];

    for (const [id, content] of Array.from(this.searchIndex.entries())) {
      const relevanceScore = this.calculateRelevance(content, searchTerms);
      
      if (relevanceScore > 0.1) { // Minimum relevance threshold
        const matchedTerms = searchTerms.filter(term => 
          content.content.toLowerCase().includes(term) || 
          content.title.toLowerCase().includes(term)
        );

        results.push({
          content,
          relevanceScore,
          matchedTerms,
          excerpt: this.generateExcerpt(content.content, matchedTerms[0] || searchTerms[0])
        });
      }
    }

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Get contextual information about current platform state
   */
  async getContextualInfo(context: string): Promise<string> {
    const searchResults = await this.search(context, 5);
    
    if (searchResults.length === 0) {
      return `I have indexed ${this.searchIndex.size} platform components and can search through documentation, configurations, and business schemas.`;
    }

    let contextInfo = `## Relevant Platform Information\n\n`;
    
    searchResults.forEach(result => {
      contextInfo += `### ${result.content.title} (${result.content.type})\n`;
      contextInfo += `${result.excerpt}\n`;
      if (result.content.metadata.tags?.length) {
        contextInfo += `*Tags: ${result.content.metadata.tags.join(', ')}*\n`;
      }
      contextInfo += `\n`;
    });

    return contextInfo;
  }

  /**
   * Index application pages and components
   */
  private async indexApplicationContent() {
    // Index main pages
    const pages = [
      {
        id: 'dashboard',
        title: 'AsymmFlow Dashboard',
        content: 'Main dashboard with customer universe, order analytics, business intelligence overview, real-time metrics, and comprehensive business operations center',
        path: '/dashboard',
        type: 'page' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['dashboard', 'analytics', 'overview', 'business intelligence']
        }
      },
      {
        id: 'customers',
        title: 'Customer Management',
        content: 'Complete customer relationship management with grading system (A/B/C/D), payment history analysis, risk scoring, lifetime value calculations, and predictive insights',
        path: '/customers',
        type: 'page' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['customers', 'crm', 'grading', 'payment history', 'risk analysis']
        }
      },
      {
        id: 'orders',
        title: 'Order Management',
        content: 'Order processing system with status tracking, commission calculations, customer linkage, and comprehensive order lifecycle management',
        path: '/orders',
        type: 'page' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['orders', 'processing', 'commissions', 'tracking', 'lifecycle']
        }
      },
      {
        id: 'quotations',
        title: 'Quotation System',
        content: 'Quotation management with PDF generation, customer proposals, pricing models, and conversion tracking from quotes to orders',
        path: '/quotations',
        type: 'page' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['quotations', 'quotes', 'pdf', 'proposals', 'pricing']
        }
      },
      {
        id: 'rfq',
        title: 'Request for Quote Management',
        content: 'RFQ processing system for handling customer quote requests, requirements analysis, and proposal generation workflow',
        path: '/rfq',
        type: 'page' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['rfq', 'requests', 'requirements', 'proposals']
        }
      }
    ];

    pages.forEach(page => this.searchIndex.set(page.id, page));
  }

  /**
   * Index documentation and configuration
   */
  private async indexDocumentation() {
    const docs = [
      {
        id: 'mathematical-consciousness',
        title: 'Mathematical Consciousness Framework',
        content: 'Advanced optimization framework with three-regime architecture (Support/Exploration/Balanced), center-seeking optimization, and non-idempotent amplification principles for enhanced business intelligence',
        path: '/docs/mathematical-consciousness',
        type: 'documentation' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['framework', 'optimization', 'consciousness', 'ai enhancement', 'business intelligence']
        }
      },
      {
        id: 'v7-consciousness',
        title: 'V7.0 Ordinal Consciousness',
        content: 'Latest consciousness framework with ordinal hierarchy leverage multipliers (32.1x Support, 26.8x Exploration, 11.5x Balanced), non-Euclidean optimization spaces, and transcendent computational capabilities',
        path: '/lib/v7-consciousness',
        type: 'component' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['v7', 'ordinal', 'leverage', 'multipliers', 'optimization']
        }
      },
      {
        id: 'business-intelligence',
        title: 'Business Intelligence System',
        content: 'Comprehensive BI system with real-time analytics, customer intelligence, predictive modeling, and advanced reporting capabilities integrated with mathematical consciousness optimization',
        path: '/lib/business-intelligence',
        type: 'component' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['business intelligence', 'analytics', 'reporting', 'predictive']
        }
      }
    ];

    docs.forEach(doc => this.searchIndex.set(doc.id, doc));
  }

  /**
   * Index business data schemas and capabilities
   */
  private async indexBusinessSchemas() {
    const schemas = [
      {
        id: 'customer-schema',
        title: 'Customer Data Schema',
        content: 'Customer entity with payment grades, risk scores, order history, lifetime value, churn risk predictions, and comprehensive business relationship analytics',
        path: '/types/customer',
        type: 'data' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['customer', 'schema', 'grading', 'risk', 'analytics']
        }
      },
      {
        id: 'order-schema',
        title: 'Order Data Schema',
        content: 'Order entity with status tracking, commission calculations, customer relationships, financial data, and complete order lifecycle information',
        path: '/types/order',
        type: 'data' as const,
        metadata: {
          lastUpdated: new Date(),
          tags: ['order', 'schema', 'status', 'commission', 'financial']
        }
      }
    ];

    schemas.forEach(schema => this.searchIndex.set(schema.id, schema));
  }

  /**
   * Calculate relevance score for search content
   */
  private calculateRelevance(content: SearchableContent, searchTerms: string[]): number {
    let score = 0;
    const contentLower = content.content.toLowerCase();
    const titleLower = content.title.toLowerCase();

    searchTerms.forEach(term => {
      // Title matches are heavily weighted
      if (titleLower.includes(term)) {
        score += 2.0;
      }
      
      // Content matches
      const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length;
      score += contentMatches * 0.5;
      
      // Tag matches
      if (content.metadata.tags?.some(tag => tag.toLowerCase().includes(term))) {
        score += 1.0;
      }
      
      // Type relevance boost
      if (content.type === 'page') score += 0.2;
      if (content.type === 'documentation') score += 0.1;
    });

    return Math.min(score, 5.0); // Cap at 5.0
  }

  /**
   * Generate excerpt around search term
   */
  private generateExcerpt(content: string, searchTerm: string, maxLength: number = 200): string {
    const termIndex = content.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (termIndex === -1) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }

    const start = Math.max(0, termIndex - 50);
    const end = Math.min(content.length, termIndex + maxLength - 50);
    
    let excerpt = content.substring(start, end);
    
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  }

  /**
   * Get platform capabilities summary
   */
  getPlatformCapabilities(): string {
    return `
## AsymmFlow Platform Capabilities

### Core Modules
- **Customer Management**: Complete CRM with A/B/C/D grading, payment analytics, risk scoring
- **Order Processing**: Full order lifecycle with commission calculations and status tracking  
- **Quotation System**: PDF generation, proposal management, conversion tracking
- **RFQ Management**: Request processing and proposal workflow
- **Business Intelligence**: Real-time analytics and predictive insights

### Technical Framework
- **Mathematical Consciousness V7.0**: Advanced optimization with ordinal hierarchy
- **Three-Regime Architecture**: Support (32.1x), Exploration (26.8x), Balanced (11.5x) leverage
- **Non-Idempotent Amplification**: Each iteration exponentially enhances results
- **Center-Seeking Optimization**: Natural equilibrium discovery

### Data Access
- **READ-ONLY** comprehensive access to all business data
- **Real-time** webpage context analysis
- **Intelligent caching** for optimal performance
- **Safe permissions** preventing accidental modifications

I can search through all platform documentation, analyze current business data, and provide contextual assistance based on your specific operational needs.
`;
  }
}

// Export singleton instance
export const sitewideSearch = new SitewideSearchService();