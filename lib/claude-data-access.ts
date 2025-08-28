/**
 * Claude Data Access Service
 * Provides READ-ONLY access to all business data for enhanced AI assistance
 * SAFE: No delete/modify capabilities without explicit permission
 */

import { Customer } from '../src/types/customer';

export interface BusinessDataSnapshot {
  customers: Customer[];
  orders: any[];
  quotations: any[];
  rfqs: any[];
  currentPageContext?: WebPageContext;
  summary: BusinessSummary;
}

export interface WebPageContext {
  url: string;
  title: string;
  section: string;
  visibleData: any;
  userContext: string;
}

export interface BusinessSummary {
  totalCustomers: number;
  totalOrders: number;
  totalQuotations: number;
  totalRFQs: number;
  recentActivity: string[];
  keyMetrics: {
    totalRevenue: number;
    avgOrderValue: number;
    customerGrades: Record<string, number>;
    paymentPerformance: string;
  };
}

export class ClaudeDataAccessService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache
  
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get comprehensive business data snapshot for Claude
   * SAFE: Read-only access with business intelligence context
   */
  async getBusinessDataSnapshot(currentPageContext?: WebPageContext): Promise<BusinessDataSnapshot> {
    try {
      // Parallel fetch all business data
      const [customers, orders, quotations, rfqs] = await Promise.all([
        this.fetchCustomers(),
        this.fetchOrders(),
        this.fetchQuotations(), 
        this.fetchRFQs()
      ]);

      const summary = this.generateBusinessSummary(customers, orders, quotations, rfqs);

      return {
        customers,
        orders,
        quotations,
        rfqs,
        currentPageContext,
        summary
      };
    } catch (error) {
      console.error('Error fetching business data:', error);
      return this.getEmptySnapshot(currentPageContext);
    }
  }

  /**
   * Fetch all customers with business intelligence data (with caching)
   */
  private async fetchCustomers(): Promise<Customer[]> {
    const cacheKey = 'customers';
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if it's still fresh
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    
    try {
      // Enhanced data access - try multiple approaches for better reliability
      
      // Server-side: Try to use environment-based API access
      if (typeof window === 'undefined') {
        // For server contexts, attempt localhost API call
        const serverBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
        try {
          const response = await fetch(`${serverBaseUrl}/api/customers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Claude-DataAccess-Service'
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000)
          });
          
          if (response.ok) {
            const data = await response.json();
            const customers = data.customers || [];
            // Update cache
            this.cache.set(cacheKey, { data: customers, timestamp: Date.now() });
            console.log(`✅ Server-side fetch successful: ${customers.length} customers`);
            return customers;
          }
        } catch (serverError) {
          console.log('Server-side API attempt failed, falling back to cached data');
        }
        
        // Return cached data if available, even if stale
        if (cached) {
          console.log(`📋 Using cached data: ${cached.data?.length || 0} customers (server-side)`);
          return cached.data;
        }
        
        // Return empty if no cache available
        console.log('⚠️ No data available (server-side, no cache)');
        return [];
      }
      
      // Client-side: Original approach
      const response = await fetch(`${this.baseUrl}/api/customers`);
      if (!response.ok) throw new Error(`Customers API error: ${response.status}`);
      const data = await response.json();
      const customers = data.customers || [];
      
      // Update cache
      this.cache.set(cacheKey, { data: customers, timestamp: Date.now() });
      console.log(`✅ Client-side fetch successful: ${customers.length} customers`);
      return customers;
      
    } catch (error) {
      console.warn('Could not fetch customers:', error);
      
      // Enhanced error handling: return cached data with warning
      if (cached) {
        console.log(`📋 Using cached data due to fetch error: ${cached.data?.length || 0} customers`);
        return cached.data;
      }
      
      console.log('⚠️ No cached data available, returning empty array');
      return [];
    }
  }

  /**
   * Fetch all orders
   */
  private async fetchOrders(): Promise<any[]> {
    try {
      // Skip server-side API calls
      if (typeof window === 'undefined') {
        return [];
      }
      
      const response = await fetch(`${this.baseUrl}/api/orders`);
      if (!response.ok) throw new Error(`Orders API error: ${response.status}`);
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.warn('Could not fetch orders:', error);
      return [];
    }
  }

  /**
   * Fetch all quotations
   */
  private async fetchQuotations(): Promise<any[]> {
    try {
      // Skip server-side API calls
      if (typeof window === 'undefined') {
        return [];
      }
      
      const response = await fetch(`${this.baseUrl}/api/quotations`);
      if (!response.ok) throw new Error(`Quotations API error: ${response.status}`);
      const data = await response.json();
      return data.quotations || [];
    } catch (error) {
      console.warn('Could not fetch quotations:', error);
      return [];
    }
  }

  /**
   * Fetch all RFQs
   */
  private async fetchRFQs(): Promise<any[]> {
    try {
      // Skip server-side API calls
      if (typeof window === 'undefined') {
        return [];
      }
      
      const response = await fetch(`${this.baseUrl}/api/rfq`);
      if (!response.ok) throw new Error(`RFQ API error: ${response.status}`);
      const data = await response.json();
      return data.rfqs || [];
    } catch (error) {
      console.warn('Could not fetch RFQs:', error);
      return [];
    }
  }

  /**
   * Generate business intelligence summary
   */
  private generateBusinessSummary(
    customers: Customer[], 
    orders: any[], 
    quotations: any[], 
    rfqs: any[]
  ): BusinessSummary {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const customerGrades = customers.reduce((grades, customer) => {
      const grade = customer.paymentGrade || 'Ungraded';
      grades[grade] = (grades[grade] || 0) + 1;
      return grades;
    }, {} as Record<string, number>);

    const recentActivity = this.generateRecentActivitySummary(customers, orders, quotations, rfqs);
    
    const avgPaymentDays = customers
      .filter(c => c.averagePaymentDays)
      .reduce((sum, c) => sum + (c.averagePaymentDays || 0), 0) / customers.length || 0;

    let paymentPerformance = 'Good';
    if (avgPaymentDays > 45) paymentPerformance = 'Needs Attention';
    if (avgPaymentDays > 60) paymentPerformance = 'Poor';

    return {
      totalCustomers: customers.length,
      totalOrders: orders.length,
      totalQuotations: quotations.length,
      totalRFQs: rfqs.length,
      recentActivity,
      keyMetrics: {
        totalRevenue,
        avgOrderValue,
        customerGrades,
        paymentPerformance
      }
    };
  }

  /**
   * Generate recent activity summary for context
   */
  private generateRecentActivitySummary(
    customers: Customer[], 
    orders: any[], 
    quotations: any[], 
    rfqs: any[]
  ): string[] {
    const activity: string[] = [];

    // Recent customers
    const recentCustomers = customers
      .filter(c => c.createdAt && new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;
    if (recentCustomers > 0) {
      activity.push(`${recentCustomers} new customers this week`);
    }

    // Recent orders
    const recentOrders = orders
      .filter(o => o.createdAt && new Date(o.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;
    if (recentOrders > 0) {
      activity.push(`${recentOrders} new orders this week`);
    }

    // Grade distribution
    const gradeA = customers.filter(c => c.paymentGrade === 'A').length;
    if (gradeA > 0) {
      activity.push(`${gradeA} Grade A customers (excellent payment history)`);
    }

    return activity;
  }

  /**
   * Get current webpage context for enhanced assistance
   */
  extractWebPageContext(): WebPageContext {
    if (typeof window === 'undefined') {
      return {
        url: '/dashboard',
        title: 'AsymmFlow Dashboard',
        section: 'dashboard',
        visibleData: {},
        userContext: 'Dashboard overview'
      };
    }

    const url = window.location.pathname;
    const title = document.title || 'AsymmFlow';
    
    let section = 'dashboard';
    let userContext = 'Dashboard overview';
    let visibleData: any = {};

    if (url.includes('/customers')) {
      section = 'customers';
      userContext = 'Customer management section';
      // Try to extract visible customer data
      try {
        const tableRows = document.querySelectorAll('tbody tr');
        visibleData.visibleCustomers = Array.from(tableRows).slice(0, 5).map(row => {
          const cells = row.querySelectorAll('td');
          return cells.length > 0 ? {
            name: cells[0]?.textContent?.trim(),
            status: cells[1]?.textContent?.trim(),
            grade: cells[2]?.textContent?.trim()
          } : null;
        }).filter(Boolean);
      } catch (e) {
        console.warn('Could not extract customer table data');
      }
    } else if (url.includes('/orders')) {
      section = 'orders';
      userContext = 'Order management section';
    } else if (url.includes('/quotations')) {
      section = 'quotations';
      userContext = 'Quotation management section';
    } else if (url.includes('/rfq')) {
      section = 'rfq';
      userContext = 'RFQ (Request for Quote) management section';
    } else if (url.includes('/reports')) {
      section = 'reports';
      userContext = 'Analytics and reporting section';
    }

    return {
      url,
      title,
      section,
      visibleData,
      userContext
    };
  }

  /**
   * Force refresh cache for real-time data sync
   */
  async forceRefreshData(): Promise<void> {
    console.log('🔄 Force refreshing all data caches...');
    this.cache.clear();
    
    // Trigger fresh data fetch
    try {
      await this.getBusinessDataSnapshot();
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.warn('⚠️ Data refresh failed:', error);
    }
  }
  
  /**
   * Create context-aware business intelligence prompt enhancement
   */
  createBusinessIntelligenceContext(snapshot: BusinessDataSnapshot): string {
    const { customers, orders, quotations, rfqs, currentPageContext, summary } = snapshot;

    let context = `
## Current Business Data Context (Read-Only Access)

### Business Overview
- **${summary.totalCustomers} Customers** (${summary.keyMetrics.customerGrades.A || 0} Grade A, ${summary.keyMetrics.customerGrades.B || 0} Grade B, ${summary.keyMetrics.customerGrades.C || 0} Grade C)
- **${summary.totalOrders} Orders** (Total Revenue: $${summary.keyMetrics.totalRevenue?.toLocaleString() || 0})
- **${summary.totalQuotations} Quotations** in pipeline
- **${summary.totalRFQs} RFQs** being processed
- **Payment Performance**: ${summary.keyMetrics.paymentPerformance}

### Recent Activity
${summary.recentActivity.map(activity => `- ${activity}`).join('\n')}

### Current Page Context
You are currently in the **${currentPageContext?.userContext || 'Dashboard'}** section.
`;

    // Add specific context based on current page
    if (currentPageContext?.section === 'customers' && customers.length > 0) {
      context += `
### Customer Intelligence Available
- **Customer Grading System**: A (Excellent), B (Good), C (Average), D (Poor)
- **Payment Analytics**: Average payment days, risk scores, profitability indices
- **Relationship Data**: Years of relationship, order history, lifetime value
- **Predictive Insights**: Churn risk, recommended actions

Recent customer highlights:
${customers.slice(0, 3).map(c => `- ${c.companyName}: Grade ${c.paymentGrade || 'Ungraded'}, ${c.orderCount || 0} orders`).join('\n')}
`;
    }

    if (currentPageContext?.visibleData?.visibleCustomers?.length > 0) {
      context += `
### Currently Visible Data
You can see these customers on screen:
${currentPageContext?.visibleData?.visibleCustomers?.map((c: any) => `- ${c.name}: ${c.status}, Grade ${c.grade}`).join('\n') || 'No customers visible'}
`;
    }

    context += `
### AI Assistant Capabilities
✅ **Can analyze** customer data, payment patterns, order trends
✅ **Can provide** business insights, recommendations, forecasts
✅ **Can answer** specific questions about customers, orders, quotations
✅ **Can generate** reports, summaries, action items
❌ **Cannot modify** data without explicit user permission
❌ **Cannot delete** any records for data safety

I have comprehensive access to all business data and can provide detailed insights, analysis, and recommendations based on your current business operations.
`;

    return context;
  }

  /**
   * Get empty snapshot for error cases
   */
  private getEmptySnapshot(currentPageContext?: WebPageContext): BusinessDataSnapshot {
    return {
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
        recentActivity: ['No data available'],
        keyMetrics: {
          totalRevenue: 0,
          avgOrderValue: 0,
          customerGrades: {},
          paymentPerformance: 'Unknown'
        }
      }
    };
  }
}

// Export singleton instance
export const claudeDataAccess = new ClaudeDataAccessService();