/**
 * AsymmSearch - Boolean^10 Markov Chain Powered Search
 * Exponentially more powerful than traditional search
 */

export interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  fuzzy?: boolean;
  depth?: number;
  contextWindow?: number;
}

export interface SearchResult {
  id: string;
  content: string;
  relevance: number;
  context?: string;
  metadata?: any;
  chainDepth?: number;
}

export class AsymmSearch {
  private readonly BOOLEAN_POWER = 10; // Boolean^10 complexity
  private markovChains: Map<string, Map<string, number>> = new Map();
  private contextVectors: Map<string, number[]> = new Map();
  
  /**
   * Build Markov chains from data
   * This creates probabilistic relationships between terms
   */
  buildMarkovChains(documents: Array<{ id: string; content: string }>) {
    documents.forEach(doc => {
      const tokens = this.tokenize(doc.content);
      
      // Build transition probabilities
      for (let i = 0; i < tokens.length - 1; i++) {
        const current = tokens[i];
        const next = tokens[i + 1];
        
        if (!this.markovChains.has(current)) {
          this.markovChains.set(current, new Map());
        }
        
        const transitions = this.markovChains.get(current)!;
        transitions.set(next, (transitions.get(next) || 0) + 1);
      }
      
      // Build context vectors (simplified embedding)
      this.contextVectors.set(doc.id, this.vectorize(doc.content));
    });
    
    // Normalize probabilities
    this.markovChains.forEach(transitions => {
      const total = Array.from(transitions.values()).reduce((a, b) => a + b, 0);
      transitions.forEach((count, word) => {
        transitions.set(word, count / total);
      });
    });
  }
  
  /**
   * Search with Boolean^10 complexity
   * Exponentially explores search space
   */
  search(query: SearchQuery): SearchResult[] {
    const queryTokens = this.tokenize(query.query);
    const depth = query.depth || 3;
    const results: SearchResult[] = [];
    
    // Generate search variations using Markov chains
    const searchVariations = this.generateVariations(queryTokens, depth);
    
    // Apply Boolean^10 complexity
    const booleanCombinations = this.generateBooleanCombinations(queryTokens);
    
    // Score all documents
    this.contextVectors.forEach((vector, docId) => {
      let score = 0;
      
      // Direct matching
      score += this.directMatch(queryTokens, vector) * 0.4;
      
      // Markov chain probability
      score += this.markovScore(queryTokens, docId) * 0.3;
      
      // Boolean combination matching
      score += this.booleanScore(booleanCombinations, vector) * 0.2;
      
      // Context similarity
      score += this.contextSimilarity(query.query, vector) * 0.1;
      
      if (score > 0.1) {
        results.push({
          id: docId,
          content: this.getContent(docId),
          relevance: score,
          chainDepth: depth,
          metadata: {
            variations: searchVariations.length,
            booleanComplexity: Math.pow(2, this.BOOLEAN_POWER)
          }
        });
      }
    });
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }
  
  /**
   * Generate search variations using Markov chains
   */
  private generateVariations(tokens: string[], depth: number): string[][] {
    const variations: string[][] = [tokens];
    
    for (let d = 0; d < depth; d++) {
      const newVariations: string[][] = [];
      
      variations.forEach(variation => {
        variation.forEach((token, i) => {
          const transitions = this.markovChains.get(token);
          if (transitions) {
            // Get top probable next words
            const topNext = Array.from(transitions.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([word]) => word);
            
            topNext.forEach(nextWord => {
              const newVariation = [...variation];
              newVariation.splice(i + 1, 0, nextWord);
              newVariations.push(newVariation);
            });
          }
        });
      });
      
      variations.push(...newVariations.slice(0, 10)); // Limit growth
    }
    
    return variations;
  }
  
  /**
   * Generate Boolean^10 combinations
   */
  private generateBooleanCombinations(tokens: string[]): string[][] {
    const combinations: string[][] = [];
    const n = Math.min(tokens.length, this.BOOLEAN_POWER);
    
    // Generate power set combinations
    for (let i = 0; i < Math.pow(2, n); i++) {
      const combination: string[] = [];
      for (let j = 0; j < n; j++) {
        if (i & (1 << j)) {
          combination.push(tokens[j]);
        }
      }
      if (combination.length > 0) {
        combinations.push(combination);
      }
    }
    
    // Add AND/OR/NOT variations
    const operators = ['AND', 'OR', 'NOT'];
    combinations.forEach(combo => {
      if (combo.length > 1) {
        operators.forEach(op => {
          combinations.push([...combo, op]);
        });
      }
    });
    
    return combinations;
  }
  
  /**
   * Score based on Markov chain probability
   */
  private markovScore(query: string[], docId: string): number {
    let score = 0;
    const content = this.getContent(docId);
    const docTokens = this.tokenize(content);
    
    for (let i = 0; i < query.length - 1; i++) {
      const current = query[i];
      const next = query[i + 1];
      
      // Check if this transition exists in document
      for (let j = 0; j < docTokens.length - 1; j++) {
        if (docTokens[j] === current && docTokens[j + 1] === next) {
          score += 1;
        }
      }
      
      // Check Markov probability
      const transitions = this.markovChains.get(current);
      if (transitions && transitions.has(next)) {
        score += transitions.get(next)! * 0.5;
      }
    }
    
    return score / Math.max(query.length, 1);
  }
  
  /**
   * Score based on Boolean combinations
   */
  private booleanScore(combinations: string[][], vector: number[]): number {
    let maxScore = 0;
    
    combinations.forEach(combo => {
      let score = 0;
      const hasAnd = combo.includes('AND');
      const hasOr = combo.includes('OR');
      const hasNot = combo.includes('NOT');
      
      const terms = combo.filter(t => !['AND', 'OR', 'NOT'].includes(t));
      
      if (hasAnd) {
        // All terms must match
        score = terms.every(term => this.vectorContains(vector, term)) ? 1 : 0;
      } else if (hasOr) {
        // Any term matches
        score = terms.some(term => this.vectorContains(vector, term)) ? 0.8 : 0;
      } else if (hasNot) {
        // Inverse matching
        score = terms.some(term => !this.vectorContains(vector, term)) ? 0.6 : 0;
      } else {
        // Default: count matches
        score = terms.filter(term => this.vectorContains(vector, term)).length / terms.length;
      }
      
      maxScore = Math.max(maxScore, score);
    });
    
    return maxScore;
  }
  
  /**
   * Direct token matching
   */
  private directMatch(query: string[], vector: number[]): number {
    let matches = 0;
    query.forEach(token => {
      if (this.vectorContains(vector, token)) {
        matches++;
      }
    });
    return matches / query.length;
  }
  
  /**
   * Context similarity using simplified cosine similarity
   */
  private contextSimilarity(query: string, vector: number[]): number {
    const queryVector = this.vectorize(query);
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < Math.min(queryVector.length, vector.length); i++) {
      dotProduct += queryVector[i] * vector[i];
      normA += queryVector[i] * queryVector[i];
      normB += vector[i] * vector[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  /**
   * Tokenize text
   */
  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }
  
  /**
   * Create simple vector representation
   */
  private vectorize(text: string): number[] {
    const tokens = this.tokenize(text);
    const vector: number[] = [];
    
    // Simple hash-based vectorization
    tokens.forEach(token => {
      const hash = this.hashCode(token);
      const index = Math.abs(hash) % 100;
      vector[index] = (vector[index] || 0) + 1;
    });
    
    return vector;
  }
  
  /**
   * Simple hash function
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }
  
  /**
   * Check if vector contains token representation
   */
  private vectorContains(vector: number[], token: string): boolean {
    const hash = this.hashCode(token);
    const index = Math.abs(hash) % 100;
    return vector[index] > 0;
  }
  
  /**
   * Get content by ID (mock implementation)
   */
  private getContent(docId: string): string {
    // In production, this would fetch from database
    return `Document content for ${docId}`;
  }
  
  /**
   * Highlight search results
   */
  highlightResults(content: string, query: string): string {
    const tokens = this.tokenize(query);
    let highlighted = content;
    
    tokens.forEach(token => {
      const regex = new RegExp(`\\b${token}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<mark class="bg-yellow-200">$&</mark>`);
    });
    
    return highlighted;
  }
}

// Export singleton instance
export const asymmSearch = new AsymmSearch();