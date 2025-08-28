/**
 * File Management Service
 * Safe file operations for business workflows (CREATE and READ only - NO DELETE)
 */

import fs from 'fs/promises';
import path from 'path';
import { V7BusinessAgent } from '../v7-business-agent';

export interface FileOperation {
  action: 'create' | 'read' | 'list' | 'exists';
  path: string;
  content?: string;
  encoding?: BufferEncoding;
}

export interface FileResult {
  success: boolean;
  data?: string | string[] | boolean | any[];
  error?: string;
  metadata?: {
    size?: number;
    created?: Date;
    modified?: Date;
  };
}

export class FileManagementService {
  private agent: V7BusinessAgent | null = null;
  private readonly SAFE_BASE_PATH = process.env.SAFE_STORAGE_PATH || './business-data';
  private readonly ALLOWED_EXTENSIONS = [
    '.txt', '.json', '.csv', '.md', '.xml', 
    '.pdf', '.xlsx', '.docx', '.html', '.log'
  ];
  
  constructor(apiKey?: string) {
    if (apiKey || process.env.ANTHROPIC_API_KEY) {
      this.agent = new V7BusinessAgent(apiKey || process.env.ANTHROPIC_API_KEY!);
    }
    this.ensureBaseDirectory();
  }
  
  /**
   * Ensure base directory exists
   */
  private async ensureBaseDirectory() {
    try {
      await fs.mkdir(this.SAFE_BASE_PATH, { recursive: true });
    } catch (error) {
      console.log('Base directory setup:', error);
    }
  }
  
  /**
   * Validate file path for safety
   */
  private validatePath(filePath: string): { valid: boolean; reason?: string } {
    // Prevent directory traversal
    if (filePath.includes('..') || filePath.includes('~')) {
      return { valid: false, reason: 'Directory traversal not allowed' };
    }
    
    // Check allowed extensions
    const ext = path.extname(filePath).toLowerCase();
    if (ext && !this.ALLOWED_EXTENSIONS.includes(ext)) {
      return { valid: false, reason: `File type ${ext} not allowed` };
    }
    
    // Ensure path stays within safe directory
    const absolute = path.resolve(this.SAFE_BASE_PATH, filePath);
    if (!absolute.startsWith(path.resolve(this.SAFE_BASE_PATH))) {
      return { valid: false, reason: 'Path must be within safe directory' };
    }
    
    return { valid: true };
  }
  
  /**
   * Create a new file (NO OVERWRITE)
   */
  async createFile(filePath: string, content: string): Promise<FileResult> {
    const validation = this.validatePath(filePath);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }
    
    const fullPath = path.join(this.SAFE_BASE_PATH, filePath);
    
    try {
      // Check if file exists (no overwrite policy)
      const exists = await this.fileExists(filePath);
      if (exists.data) {
        return { 
          success: false, 
          error: 'File already exists. Overwriting not permitted for safety.' 
        };
      }
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      
      // Create file
      await fs.writeFile(fullPath, content, 'utf-8');
      
      // Get metadata
      const stats = await fs.stat(fullPath);
      
      return {
        success: true,
        data: fullPath,
        metadata: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Read file contents
   */
  async readFile(filePath: string): Promise<FileResult> {
    const validation = this.validatePath(filePath);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }
    
    const fullPath = path.join(this.SAFE_BASE_PATH, filePath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const stats = await fs.stat(fullPath);
      
      return {
        success: true,
        data: content,
        metadata: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * List files in directory
   */
  async listFiles(dirPath: string = ''): Promise<FileResult> {
    const validation = this.validatePath(dirPath);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }
    
    const fullPath = path.join(this.SAFE_BASE_PATH, dirPath);
    
    try {
      const files = await fs.readdir(fullPath);
      const fileDetails = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(fullPath, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            type: stats.isDirectory() ? 'directory' : 'file',
            size: stats.size,
            modified: stats.mtime
          };
        })
      );
      
      return {
        success: true,
        data: fileDetails
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<FileResult> {
    const validation = this.validatePath(filePath);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }
    
    const fullPath = path.join(this.SAFE_BASE_PATH, filePath);
    
    try {
      await fs.access(fullPath);
      return { success: true, data: true };
    } catch {
      return { success: true, data: false };
    }
  }
  
  /**
   * Generate intelligent file content using AI
   */
  async generateFileContent(params: {
    type: 'report' | 'analysis' | 'template' | 'documentation';
    subject: string;
    format: 'markdown' | 'json' | 'csv' | 'html';
    context?: any;
  }): Promise<string> {
    if (!this.agent) {
      return this.generateLocalTemplate(params);
    }
    
    const task = `Generate a ${params.type} about ${params.subject} in ${params.format} format`;
    const response = await this.agent.processBusinessQuery({
      task,
      domain: 'operations',
      outputFormat: 'text',
      context: params.context
    });
    
    return response.response;
  }
  
  /**
   * Create business document with AI assistance
   */
  async createBusinessDocument(params: {
    title: string;
    type: 'proposal' | 'report' | 'invoice' | 'contract' | 'memo';
    data: any;
    template?: string;
  }): Promise<FileResult> {
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${params.type}/${params.title.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.md`;
    
    // Generate content
    let content: string;
    
    if (this.agent) {
      const task = `Create a professional ${params.type} titled "${params.title}" with the following data: ${JSON.stringify(params.data)}`;
      const response = await this.agent.processBusinessQuery({
        task,
        domain: 'operations',
        outputFormat: 'markdown'
      });
      content = response.response;
    } else {
      content = this.generateLocalDocument(params);
    }
    
    // Create file
    return await this.createFile(filename, content);
  }
  
  /**
   * Safe batch file operations
   */
  async batchOperation(operations: FileOperation[]): Promise<FileResult[]> {
    const results: FileResult[] = [];
    
    for (const op of operations) {
      let result: FileResult;
      
      switch (op.action) {
        case 'create':
          result = await this.createFile(op.path, op.content || '');
          break;
        case 'read':
          result = await this.readFile(op.path);
          break;
        case 'list':
          result = await this.listFiles(op.path);
          break;
        case 'exists':
          result = await this.fileExists(op.path);
          break;
        default:
          result = { success: false, error: 'Invalid operation' };
      }
      
      results.push(result);
    }
    
    return results;
  }
  
  // Local template generation when AI is not available
  private generateLocalTemplate(params: any): string {
    const templates: Record<string, string> = {
      report: `# ${params.subject} Report\n\n## Executive Summary\n\n## Key Findings\n\n## Recommendations\n\n---\nGenerated: ${new Date().toISOString()}`,
      analysis: `# ${params.subject} Analysis\n\n## Overview\n\n## Data Points\n\n## Conclusions\n\n---\nGenerated: ${new Date().toISOString()}`,
      template: `# ${params.subject}\n\n## Section 1\n\n## Section 2\n\n## Section 3\n\n---\nGenerated: ${new Date().toISOString()}`,
      documentation: `# ${params.subject} Documentation\n\n## Introduction\n\n## Details\n\n## References\n\n---\nGenerated: ${new Date().toISOString()}`
    };
    
    return templates[params.type] || templates.template;
  }
  
  private generateLocalDocument(params: any): string {
    return `# ${params.title}

## Type: ${params.type}

## Date: ${new Date().toLocaleDateString()}

## Details:
${JSON.stringify(params.data, null, 2)}

---
*Document generated automatically by AsymmFlow Business Platform*`;
  }
}

// Export singleton instance for convenience
export const fileManager = new FileManagementService();