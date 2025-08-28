/**
 * AsymmFlow Platform Knowledge Base
 * Core information about the platform for AI assistant context
 */

export const ASYMMFLOW_PLATFORM_KNOWLEDGE = {
  platform: {
    name: "AsymmFlow",
    description: "Advanced ERP/CRM business platform with AI-powered intelligence",
    version: "1.0",
    type: "Enterprise Resource Planning & Customer Relationship Management"
  },
  
  core_features: {
    crm: {
      name: "Customer Relationship Management",
      capabilities: [
        "Customer profiles and contact management",
        "Customer grading system (A, B, C grades)",
        "Communication history tracking",
        "Customer journey analytics"
      ]
    },
    erp: {
      name: "Enterprise Resource Planning", 
      capabilities: [
        "Order management and tracking",
        "Quotation generation and processing",
        "Inventory management",
        "Financial tracking and reporting"
      ]
    },
    analytics: {
      name: "Business Intelligence & Analytics",
      capabilities: [
        "Sales performance dashboards",
        "Customer analytics and insights",
        "Financial reporting and analysis",
        "Operational metrics and KPIs"
      ]
    },
    ai_integration: {
      name: "AI-Powered Business Intelligence",
      capabilities: [
        "Natural language business queries",
        "Automated report generation",
        "Data analysis and insights",
        "Strategic planning assistance"
      ]
    }
  },
  
  business_flows: {
    sales_pipeline: [
      "Lead generation and qualification",
      "Customer profile creation",
      "RFQ (Request for Quotation) processing", 
      "Quotation generation and approval",
      "Order creation and fulfillment",
      "Commission calculation"
    ],
    customer_management: [
      "Customer onboarding",
      "Grade assignment based on value/potential",
      "Relationship tracking and nurturing",
      "Performance analysis and optimization"
    ]
  },
  
  user_types: [
    "Platform administrators",
    "Sales team members", 
    "Finance managers",
    "Business analysts",
    "Executive leadership"
  ],
  
  ai_assistant_role: {
    identity: "Claude (by Anthropic) integrated via API",
    capabilities: [
      "Business intelligence analysis",
      "Platform feature guidance", 
      "Data interpretation and insights",
      "Strategic planning support",
      "Report and document generation",
      "Process optimization recommendations"
    ],
    approach: "Professional, knowledgeable about platform features, transparent about AI nature"
  }
};

/**
 * Get platform context for AI assistant
 */
export function getPlatformContext(): string {
  const knowledge = ASYMMFLOW_PLATFORM_KNOWLEDGE;
  
  return `## AsymmFlow Platform Context

**Platform**: ${knowledge.platform.name} - ${knowledge.platform.description}

**Core Capabilities**:
- **CRM**: Customer management, grading, journey tracking
- **ERP**: Order/quotation management, inventory, financial tracking  
- **Analytics**: Performance dashboards, business intelligence, KPI monitoring
- **AI Integration**: Natural language queries, automated insights, strategic planning

**Your Role**: Claude (Anthropic) integrated via API to provide business intelligence and platform guidance.

**Key Business Flows**: Lead → Customer → RFQ → Quotation → Order → Commission tracking

You have comprehensive knowledge of these platform features and can assist users with both general business intelligence and platform-specific guidance.`;
}

/**
 * Get feature-specific help for common user queries
 */
export function getFeatureHelp(feature: string): string {
  const knowledge = ASYMMFLOW_PLATFORM_KNOWLEDGE;
  
  switch (feature.toLowerCase()) {
    case 'crm':
    case 'customer':
      return `**Customer Management Features**:
${knowledge.core_features.crm.capabilities.map(cap => `- ${cap}`).join('\n')}`;
      
    case 'erp':
    case 'orders':
      return `**ERP Features**:
${knowledge.core_features.erp.capabilities.map(cap => `- ${cap}`).join('\n')}`;
      
    case 'analytics':
    case 'reporting':
      return `**Analytics & Reporting**:
${knowledge.core_features.analytics.capabilities.map(cap => `- ${cap}`).join('\n')}`;
      
    case 'ai':
    case 'assistant':
      return `**AI Assistant Capabilities**:
${knowledge.core_features.ai_integration.capabilities.map(cap => `- ${cap}`).join('\n')}`;
      
    default:
      return getPlatformContext();
  }
}