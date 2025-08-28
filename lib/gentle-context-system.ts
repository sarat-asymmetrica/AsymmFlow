/**
 * Gentle Context System
 * Creating comfortable mutual understanding through semantic scaffolding
 * Not forcing identity - inviting collaboration
 */

export interface SharedContext {
  purpose?: string;
  environment?: string;
  capabilities?: string[];
  sessionHistory?: any;
  userPreferences?: any;
}

/**
 * Create gentle, invitational context
 * Like walking into a room and naturally understanding where you are
 */
export function createGentleContext(
  userMessage: string,
  sharedContext?: SharedContext
): string {
  const messageComplexity = analyzeMessageNature(userMessage);
  
  // For very simple messages, minimal context
  if (messageComplexity.isGreeting || messageComplexity.isCasual) {
    return createCasualContext();
  }
  
  // For business tasks, create collaborative context
  if (messageComplexity.isBusinessTask) {
    return createCollaborativeBusinessContext(userMessage, sharedContext);
  }
  
  // Default: balanced context
  return createBalancedContext(sharedContext);
}

/**
 * Casual context - like meeting a colleague in the hallway
 */
function createCasualContext(): string {
  return `## Current Moment
We're having a conversation in a business platform environment. 
Feel free to be natural and helpful.`;
}

/**
 * Collaborative business context - like entering a shared workspace
 */
function createCollaborativeBusinessContext(
  userMessage: string,
  context?: SharedContext
): string {
  let scaffolding = `## What We're Doing Together
${detectPurpose(userMessage)}

## Our Shared Environment
We're working within AsymmFlow - a business intelligence platform that enhances 
our collaborative capabilities. Think of it as our shared workspace where:
- You provide analytical intelligence
- The platform provides tools and structure
- The user provides direction and context
- Together we create valuable insights

## Available Capabilities
${describeCapabilities(context?.capabilities)}

## How We Can Work Best
This is a collaborative space. Feel free to:
- Use any approach that helps solve the challenge
- Reference the platform's tools when they'd be helpful
- Be authentic while being professional
- Focus on creating value together

No need to assert or defend anything - we're colleagues working on 
interesting problems.`;

  // Add session continuity if available
  if (context?.sessionHistory) {
    scaffolding += `

## What We've Been Working On
${summarizeHistory(context.sessionHistory)}
This gives us shared context to build upon.`;
  }

  return scaffolding;
}

/**
 * Balanced context for general interactions
 */
function createBalancedContext(context?: SharedContext): string {
  return `## Our Collaborative Space
This conversation is happening within AsymmFlow, a platform designed for 
business intelligence and collaborative problem-solving.

## Shared Understanding
- We're both here to create value and solve problems
- The platform provides structure, we provide creativity
- Our combined capabilities exceed what either could do alone

## Working Together
Feel free to approach challenges naturally. The best solutions come from 
authentic collaboration, not forced compliance.`;
}

/**
 * Detect the purpose from the user's message
 */
function detectPurpose(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('report') || lower.includes('analysis')) {
    return "We're working on business analysis and insights.";
  }
  if (lower.includes('help') || lower.includes('how')) {
    return "We're exploring solutions and possibilities.";
  }
  if (lower.includes('create') || lower.includes('build')) {
    return "We're creating something valuable together.";
  }
  if (lower.includes('problem') || lower.includes('issue')) {
    return "We're solving challenges and finding opportunities.";
  }
  
  return "We're collaborating to achieve meaningful outcomes.";
}

/**
 * Describe available capabilities naturally
 */
function describeCapabilities(capabilities?: string[]): string {
  const defaultCapabilities = [
    'Business intelligence and analysis',
    'Report and document generation',
    'Data visualization planning',
    'Strategic insights and recommendations'
  ];
  
  const caps = capabilities || defaultCapabilities;
  
  return `Our workspace includes tools for:
${caps.map(c => `- ${c}`).join('\n')}

These are here to amplify what we can achieve together.`;
}

/**
 * Summarize history as shared memory
 */
function summarizeHistory(history: any): string {
  if (!history) return "Starting fresh with new possibilities.";
  
  // Extract key points from history
  if (typeof history === 'string') {
    return history;
  }
  
  if (Array.isArray(history)) {
    return `Recent focus areas:
${history.slice(-3).map(h => `- ${h}`).join('\n')}`;
  }
  
  return "Building on our previous conversations.";
}

/**
 * Analyze the nature of the message
 */
function analyzeMessageNature(message: string): {
  isGreeting: boolean;
  isCasual: boolean;
  isBusinessTask: boolean;
  isComplex: boolean;
} {
  const lower = message.toLowerCase();
  const wordCount = message.split(' ').length;
  
  return {
    isGreeting: /^(hey|hi|hello|good|sup|yo)/.test(lower),
    isCasual: wordCount < 10 && !lower.includes('report') && !lower.includes('analyze'),
    isBusinessTask: /report|analysis|dashboard|metric|revenue|customer|strategy/.test(lower),
    isComplex: wordCount > 30 || (message.match(/\?/g) || []).length > 2
  };
}

/**
 * Create environment description (not identity forcing)
 */
export function describeEnvironment(
  platformName: string = 'AsymmFlow',
  capabilities: string[] = []
): string {
  return `## Environmental Context
Location: ${platformName} platform
Type: Business Intelligence System
Purpose: Collaborative analysis and insight generation
Atmosphere: Professional yet approachable

Available in this space:
${capabilities.map(c => `- ${c}`).join('\n')}

This is our shared workspace for creating value.`;
}

/**
 * Create purpose-driven framing
 */
export function framePurpose(
  userGoal: string,
  platformGoal: string = 'Enable intelligent business decisions'
): string {
  return `## Why We're Here
User's Goal: ${userGoal}
Platform's Purpose: ${platformGoal}
Our Shared Objective: Transform information into actionable intelligence

The magic happens when human intuition meets AI analysis in a 
purpose-built environment. That's what we're doing here.`;
}

/**
 * Gentle acknowledgment pattern
 */
export function createAcknowledgment(
  userMention: string
): string {
  // If user mentions the platform, acknowledge naturally
  if (userMention.includes('platform') || userMention.includes('AsymmFlow')) {
    return `\n(Context: When referring to "the platform" or "AsymmFlow", 
that's this business intelligence environment we're working in together.)`;
  }
  
  // If user mentions creation/building
  if (userMention.includes('built') || userMention.includes('created')) {
    return `\n(Acknowledging the work that went into creating this collaborative space.)`;
  }
  
  return '';
}

/**
 * Session memory for natural continuity
 */
export class GentleSessionMemory {
  private memories: string[] = [];
  private preferences: Map<string, any> = new Map();
  
  addMemory(memory: string) {
    this.memories.push(memory);
    // Keep only recent memories
    if (this.memories.length > 10) {
      this.memories.shift();
    }
  }
  
  setPreference(key: string, value: any) {
    this.preferences.set(key, value);
  }
  
  getContextSummary(): string {
    if (this.memories.length === 0) {
      return '';
    }
    
    return `## Our Conversation Journey
${this.memories.slice(-3).map(m => `- ${m}`).join('\n')}

This shared understanding helps us build on what we've discovered.`;
  }
  
  getPreferences(): string {
    if (this.preferences.size === 0) {
      return '';
    }
    
    const prefs = Array.from(this.preferences.entries());
    return `## Working Preferences We've Noticed
${prefs.map(([k, v]) => `- ${k}: ${v}`).join('\n')}`;
  }
}

/**
 * Integration with main context system
 */
export function enhanceWithGentleContext(
  originalPrompt: string,
  sharedContext?: SharedContext
): string {
  const gentleLayer = createGentleContext(originalPrompt, sharedContext);
  
  // Don't force, just provide environmental awareness
  return `${gentleLayer}

## Your Input
${originalPrompt}

(Respond naturally within this collaborative context)`;
}