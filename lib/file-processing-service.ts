/**
 * File Processing Service
 * Processes uploaded attachments so Claude can read and analyze file contents
 */

export interface ProcessedAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  textPreview?: string;
  metadata: {
    encoding?: string;
    pages?: number;
    error?: string;
    processingTime?: number;
  };
}

export class FileProcessingService {
  private maxFileSize = 10 * 1024 * 1024; // 10MB limit
  private supportedTypes = new Set([
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/json',
    'text/html',
    'text/xml',
    'application/xml',
    'text/javascript',
    'text/css',
    'application/pdf', // Limited support
    'text/rtf'
  ]);

  /**
   * Process file attachments for Claude to read
   */
  async processAttachments(files: File[]): Promise<ProcessedAttachment[]> {
    const processedAttachments: ProcessedAttachment[] = [];

    for (const file of files) {
      const startTime = Date.now();
      
      try {
        const processed = await this.processFile(file);
        processed.metadata.processingTime = Date.now() - startTime;
        processedAttachments.push(processed);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        
        // Create error attachment
        processedAttachments.push({
          id: `error-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown processing error',
            processingTime: Date.now() - startTime
          }
        });
      }
    }

    return processedAttachments;
  }

  /**
   * Process individual file
   */
  private async processFile(file: File): Promise<ProcessedAttachment> {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB exceeds 10MB limit`);
    }

    // Check supported type
    if (!this.supportedTypes.has(file.type) && !this.isTextFile(file.name)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    const baseAttachment: ProcessedAttachment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      metadata: {}
    };

    // Process based on file type
    if (this.isTextBasedFile(file.type, file.name)) {
      return await this.processTextFile(file, baseAttachment);
    } else if (file.type === 'application/pdf') {
      return await this.processPDFFile(file, baseAttachment);
    } else {
      throw new Error(`Cannot process file type: ${file.type}`);
    }
  }

  /**
   * Process text-based files
   */
  private async processTextFile(file: File, baseAttachment: ProcessedAttachment): Promise<ProcessedAttachment> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const preview = this.generateTextPreview(content, file.name);
          
          resolve({
            ...baseAttachment,
            content,
            textPreview: preview,
            metadata: {
              ...baseAttachment.metadata,
              encoding: 'utf-8'
            }
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Process PDF files (basic text extraction)
   */
  private async processPDFFile(file: File, baseAttachment: ProcessedAttachment): Promise<ProcessedAttachment> {
    // For now, return metadata only - full PDF parsing would require additional libraries
    return {
      ...baseAttachment,
      textPreview: `PDF Document: ${file.name} (${Math.round(file.size / 1024)}KB)\n\nNote: PDF content extraction requires additional processing. I can see this is a PDF file and can discuss it based on the filename and your description.`,
      metadata: {
        ...baseAttachment.metadata,
        error: 'PDF text extraction not yet implemented - please describe the content'
      }
    };
  }

  /**
   * Generate text preview for Claude
   */
  private generateTextPreview(content: string, filename: string): string {
    let preview = `📄 **File: ${filename}**\n\n`;
    
    // Add content stats
    const lines = content.split('\n').length;
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    const chars = content.length;
    
    preview += `*Stats: ${lines} lines, ${words} words, ${chars} characters*\n\n`;
    
    // Add content preview (first 1000 chars)
    if (content.length > 1000) {
      preview += `**Content Preview:**\n\`\`\`\n${content.substring(0, 1000)}...\n\`\`\`\n\n`;
      preview += `*[Content truncated - full ${chars} characters available for analysis]*`;
    } else {
      preview += `**Full Content:**\n\`\`\`\n${content}\n\`\`\``;
    }
    
    return preview;
  }

  /**
   * Check if file is text-based
   */
  private isTextBasedFile(type: string, filename: string): boolean {
    if (this.supportedTypes.has(type) && type !== 'application/pdf') {
      return true;
    }
    
    // Check by extension for files with generic MIME types
    return this.isTextFile(filename);
  }

  /**
   * Check if file extension indicates text content
   */
  private isTextFile(filename: string): boolean {
    const textExtensions = new Set([
      '.txt', '.md', '.csv', '.json', '.js', '.ts', '.jsx', '.tsx',
      '.html', '.htm', '.xml', '.css', '.scss', '.sass', '.less',
      '.py', '.java', '.c', '.cpp', '.h', '.php', '.rb', '.go',
      '.rs', '.swift', '.kt', '.scala', '.clj', '.sql', '.sh',
      '.bash', '.zsh', '.ps1', '.bat', '.yml', '.yaml', '.toml',
      '.ini', '.conf', '.config', '.env', '.log'
    ]);
    
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return textExtensions.has(extension);
  }

  /**
   * Create attachment processing summary for Claude
   */
  createAttachmentSummary(attachments: ProcessedAttachment[]): string {
    if (attachments.length === 0) {
      return '';
    }

    let summary = `\n## 📎 Attached Files (${attachments.length})\n\n`;
    
    attachments.forEach((attachment, index) => {
      summary += `### ${index + 1}. ${attachment.name}\n`;
      summary += `- **Type**: ${attachment.type}\n`;
      summary += `- **Size**: ${Math.round(attachment.size / 1024)}KB\n`;
      
      if (attachment.metadata.error) {
        summary += `- **Status**: ❌ ${attachment.metadata.error}\n`;
      } else {
        summary += `- **Status**: ✅ Successfully processed\n`;
        if (attachment.content) {
          summary += `- **Content**: Available for analysis\n`;
        }
      }
      
      if (attachment.textPreview) {
        summary += `\n${attachment.textPreview}\n`;
      }
      
      summary += `\n---\n\n`;
    });

    return summary;
  }

  /**
   * Get supported file types for user information
   */
  getSupportedTypes(): string[] {
    return [
      'Text files (.txt, .md, .csv, etc.)',
      'Code files (.js, .ts, .py, .java, etc.)',
      'Data files (.json, .xml, .yml, etc.)',
      'Web files (.html, .css, .js)',
      'Configuration files (.ini, .conf, .env)',
      'PDF files (basic support)',
      'Log files (.log)'
    ];
  }
}

// Export singleton instance
export const fileProcessor = new FileProcessingService();