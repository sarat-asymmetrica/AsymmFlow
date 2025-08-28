/**
 * Document Generation API
 * Generates business documents using BI Suite architecture
 */

import { NextResponse } from 'next/server';
import { createV7BusinessAgent } from '../../../lib/v7-business-agent';
import { generateModularIntelligence } from '../../../lib/business-intelligence-preload';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      documentType, 
      domain, 
      tier, 
      depth = 'standard',
      data,
      customPrompt 
    } = body;
    
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'API key not configured'
      }, { status: 500 });
    }
    
    // Get agent instance
    const agent = createV7BusinessAgent(process.env.ANTHROPIC_API_KEY);
    
    // Build document generation query
    const moduleDepth = depth === 'summary' ? 1 : depth === 'comprehensive' ? 3 : 2;
    const modules = domain && tier ? 
      generateModularIntelligence(domain, tier, moduleDepth) : '';
    
    // Create the document generation prompt
    const documentPrompt = buildDocumentPrompt(
      documentType,
      domain,
      tier,
      depth,
      data,
      customPrompt,
      modules
    );
    
    // Process through business agent
    const result = await agent.processBusinessQuery({
      task: documentPrompt,
      domain: domain || 'general',
      urgency: 'medium',
      outputFormat: getOutputFormat(documentType)
    });
    
    // Format as document
    const document = formatAsDocument(result, documentType);
    
    return NextResponse.json({
      success: true,
      document,
      metadata: {
        type: documentType,
        domain,
        tier,
        depth,
        tokensUsed: result.tokensUsed,
        cost: result.cost
      }
    });
    
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Document generation failed'
    }, { status: 500 });
  }
}

/**
 * Build document generation prompt
 */
function buildDocumentPrompt(
  documentType: string,
  domain: string,
  tier: string,
  depth: string,
  data: any,
  customPrompt?: string,
  modules?: string
): string {
  let prompt = `Generate a ${depth} ${documentType} for ${domain || 'business'} at the ${tier || 'operational'} level.\n\n`;
  
  if (modules) {
    prompt += modules + '\n\n';
  }
  
  if (data) {
    prompt += `## Data Context\n${JSON.stringify(data, null, 2)}\n\n`;
  }
  
  if (customPrompt) {
    prompt += `## Specific Requirements\n${customPrompt}\n\n`;
  }
  
  // Add document-specific instructions
  switch (documentType) {
    case 'report':
      prompt += `Generate a professional business report with:
- Executive summary
- Key findings and insights
- Data analysis with visualizations
- Recommendations and action items
- Conclusion`;
      break;
      
    case 'dashboard':
      prompt += `Design a dashboard specification with:
- Key metrics and KPIs
- Visual layout description
- Data sources and update frequency
- Alert thresholds and conditions
- User interaction features`;
      break;
      
    case 'presentation':
      prompt += `Create a presentation outline with:
- Title slide with key message
- Agenda/overview
- Main content slides with talking points
- Data visualization slides
- Conclusion and next steps`;
      break;
      
    case 'analysis':
      prompt += `Provide a detailed analysis including:
- Problem statement
- Methodology
- Data analysis and findings
- Statistical significance (if applicable)
- Conclusions and implications`;
      break;
      
    default:
      prompt += `Generate a comprehensive business document with appropriate structure and content.`;
  }
  
  return prompt;
}

/**
 * Get output format for document type
 */
function getOutputFormat(documentType: string): 'text' | 'json' | 'markdown' | 'action-items' {
  switch (documentType) {
    case 'dashboard':
      return 'json';
    case 'presentation':
    case 'report':
      return 'markdown';
    default:
      return 'text';
  }
}

/**
 * Format result as document
 */
function formatAsDocument(result: any, documentType: string): any {
  const baseDocument = {
    title: extractTitle(result.response),
    content: result.response,
    sections: extractSections(result.response),
    actionItems: result.actionItems || [],
    metrics: result.metrics || {},
    confidence: result.confidence,
    generatedAt: new Date().toISOString()
  };
  
  // Add document-specific formatting
  switch (documentType) {
    case 'dashboard':
      return {
        ...baseDocument,
        widgets: extractDashboardWidgets(result.response),
        layout: 'responsive',
        refreshInterval: 60000
      };
      
    case 'presentation':
      return {
        ...baseDocument,
        slides: extractSlides(result.response),
        theme: 'professional',
        estimatedDuration: estimatePresentationDuration(result.response)
      };
      
    case 'report':
      return {
        ...baseDocument,
        executiveSummary: extractExecutiveSummary(result.response),
        tableOfContents: generateTableOfContents(result.response),
        appendices: []
      };
      
    default:
      return baseDocument;
  }
}

/**
 * Helper functions for document formatting
 */
function extractTitle(content: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : 'Business Document';
}

function extractSections(content: string): string[] {
  const sections = content.match(/^##\s+(.+)$/gm);
  return sections ? sections.map(s => s.replace(/^##\s+/, '')) : [];
}

function extractDashboardWidgets(content: string): any[] {
  // Extract metric definitions from content
  const widgets: any[] = [];
  const metricMatches = Array.from(content.matchAll(/(?:metric|kpi|indicator):\s*([^,\n]+)/gi));
  
  for (const match of metricMatches) {
    widgets.push({
      type: 'metric',
      title: match[1].trim(),
      size: 'medium'
    });
  }
  
  return widgets;
}

function extractSlides(content: string): any[] {
  const slides: any[] = [];
  const slideMatches = content.split(/^##\s+/m);
  
  slideMatches.forEach((slide, index) => {
    if (slide.trim()) {
      slides.push({
        number: index,
        title: slide.split('\n')[0],
        content: slide,
        notes: ''
      });
    }
  });
  
  return slides;
}

function extractExecutiveSummary(content: string): string {
  const summaryMatch = content.match(/executive summary[:\n]+([\s\S]+?)(?:^#|^##|\n\n)/mi);
  return summaryMatch ? summaryMatch[1].trim() : content.substring(0, 500);
}

function generateTableOfContents(content: string): string[] {
  const headings = content.match(/^#{1,3}\s+.+$/gm);
  return headings ? headings : [];
}

function estimatePresentationDuration(content: string): number {
  const words = content.split(/\s+/).length;
  const speakingRate = 150; // words per minute
  return Math.ceil(words / speakingRate);
}

export async function GET() {
  return NextResponse.json({
    service: 'Document Generation API',
    capabilities: {
      documentTypes: ['report', 'dashboard', 'presentation', 'analysis'],
      domains: ['sales', 'marketing', 'finance', 'operations'],
      tiers: ['strategic', 'tactical', 'operational'],
      depths: ['summary', 'standard', 'comprehensive', 'research'],
      outputFormats: ['text', 'markdown', 'json']
    },
    usage: {
      endpoint: '/api/generate-document',
      method: 'POST',
      body: {
        documentType: 'string (required)',
        domain: 'string (optional)',
        tier: 'string (optional)',
        depth: 'string (optional, default: standard)',
        data: 'object (optional)',
        customPrompt: 'string (optional)'
      }
    }
  });
}