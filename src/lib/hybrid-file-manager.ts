/**
 * Hybrid AI File Management System
 * Balances AI capabilities with safety through smart permission tiers
 */

export interface FileOperation {
  id: string;
  timestamp: Date;
  operation: 'create' | 'read' | 'update' | 'delete' | 'move' | 'copy';
  path: string;
  reason: string;
  userContext?: string;
  backupPath?: string;
  success: boolean;
  aiAgent: string;
}

export interface AIFilePermissions {
  readAccess: 'full' | 'workspace-only' | 'restricted';
  writeAccess: 'sandbox' | 'confirmed' | 'trusted-zones' | 'restricted';
  deleteAccess: 'never' | 'confirmed-only' | 'backup-first' | 'trusted-zones';
  userTrustLevel: number; // 0-100, increases over time
  operationContext: 'testing' | 'development' | 'production' | 'exploration';
  sessionHistory: FileOperation[];
}

export interface WorkspaceZone {
  name: string;
  path: string;
  permissions: 'full' | 'create-only' | 'read-only';
  autoExpiry?: number; // minutes
  description: string;
}

export class HybridFileManager {
  private permissions: AIFilePermissions;
  private workspaceZones: Map<string, WorkspaceZone> = new Map();
  private operationLog: FileOperation[] = [];
  private userPreferences: Map<string, any> = new Map();
  
  constructor(initialTrustLevel: number = 30) {
    this.permissions = {
      readAccess: 'workspace-only',
      writeAccess: 'sandbox',
      deleteAccess: 'never',
      userTrustLevel: initialTrustLevel,
      operationContext: 'development',
      sessionHistory: []
    };
    
    // Initialize safe workspace zones
    this.initializeWorkspaceZones();
  }
  
  private initializeWorkspaceZones(): void {
    // AI-safe zones with different permission levels
    const zones: WorkspaceZone[] = [
      {
        name: 'AI Sandbox',
        path: '/ai-workspace/sandbox',
        permissions: 'full',
        description: 'Completely safe zone for AI experimentation'
      },
      {
        name: 'Drafts',
        path: '/ai-workspace/drafts',
        permissions: 'full',
        autoExpiry: 60, // Auto-cleanup after 1 hour
        description: 'Temporary files and drafts'
      },
      {
        name: 'Generated Reports',
        path: '/ai-workspace/reports',
        permissions: 'create-only',
        description: 'AI-generated business reports and analysis'
      },
      {
        name: 'File Processing',
        path: '/ai-workspace/temp',
        permissions: 'full',
        autoExpiry: 30,
        description: 'Temporary file processing area'
      }
    ];
    
    zones.forEach(zone => {
      this.workspaceZones.set(zone.name, zone);
    });
  }
  
  /**
   * Assess risk level for file operation
   */
  private assessRisk(operation: string, path: string, context?: string): 'low' | 'medium' | 'high' {
    // HIGH RISK: Production files, config files, system files
    if (path.includes('/config/') || 
        path.includes('.env') || 
        path.includes('/node_modules/') ||
        path.includes('package.json') ||
        path.endsWith('.exe') ||
        this.permissions.operationContext === 'production') {
      return 'high';
    }
    
    // MEDIUM RISK: Existing files, main source code
    if (operation === 'update' || operation === 'delete' || path.includes('/src/')) {
      return 'medium';
    }
    
    // LOW RISK: New files in workspace zones, read operations
    if (operation === 'read' || this.isInWorkspaceZone(path)) {
      return 'low';
    }
    
    return 'medium'; // Default to caution
  }
  
  private isInWorkspaceZone(path: string): boolean {
    for (const zone of this.workspaceZones.values()) {
      if (path.startsWith(zone.path)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Request permission for file operation with intelligent assessment
   */
  async requestOperation(
    operation: 'create' | 'read' | 'update' | 'delete' | 'move' | 'copy',
    path: string,
    reason: string,
    userContext?: string
  ): Promise<{
    approved: boolean;
    requiresConfirmation: boolean;
    message: string;
    backupPath?: string;
  }> {
    const risk = this.assessRisk(operation, path, userContext);
    const operationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Log the operation attempt
    const fileOp: FileOperation = {
      id: operationId,
      timestamp: new Date(),
      operation,
      path,
      reason,
      userContext,
      success: false,
      aiAgent: 'Claude-AsymmFlow'
    };
    
    let approved = false;
    let requiresConfirmation = false;
    let message = '';
    let backupPath: string | undefined;
    
    switch (risk) {
      case 'low':
        // Auto-approve low-risk operations
        approved = true;
        message = `✅ Auto-approved: ${operation} operation in safe zone`;
        break;
        
      case 'medium':
        // Require confirmation for medium-risk operations
        if (this.permissions.userTrustLevel > 70) {
          approved = true;
          message = `✅ Approved based on high trust level (${this.permissions.userTrustLevel}%)`;
        } else {
          requiresConfirmation = true;
          message = `⚠️ Confirmation required: ${operation} ${path} - ${reason}`;
        }
        
        // Create backup for destructive operations
        if ((operation === 'update' || operation === 'delete') && approved) {
          backupPath = `/ai-workspace/backups/${Date.now()}-${path.split('/').pop()}`;
        }
        break;
        
      case 'high':
        // High-risk operations always require confirmation
        requiresConfirmation = true;
        message = `🚨 HIGH RISK: ${operation} ${path} requires explicit confirmation`;
        
        if (operation === 'update' || operation === 'delete') {
          backupPath = `/ai-workspace/backups/${Date.now()}-${path.split('/').pop()}`;
        }
        break;
    }
    
    // Update operation log
    fileOp.success = approved;
    fileOp.backupPath = backupPath;
    this.operationLog.push(fileOp);
    this.permissions.sessionHistory.push(fileOp);
    
    return {
      approved,
      requiresConfirmation,
      message,
      backupPath
    };
  }
  
  /**
   * Learn from user patterns to improve future decisions
   */
  learnFromUserDecision(
    operationId: string, 
    userApproved: boolean, 
    userFeedback?: string
  ): void {
    const operation = this.operationLog.find(op => op.id === operationId);
    if (!operation) return;
    
    // Adjust trust level based on user feedback
    if (userApproved && operation.success) {
      this.permissions.userTrustLevel = Math.min(100, this.permissions.userTrustLevel + 1);
    } else if (!userApproved) {
      this.permissions.userTrustLevel = Math.max(0, this.permissions.userTrustLevel - 2);
    }
    
    // Store user preferences
    const preferenceKey = `${operation.operation}-${this.assessRisk(operation.operation, operation.path)}`;
    this.userPreferences.set(preferenceKey, {
      approved: userApproved,
      feedback: userFeedback,
      context: operation.userContext,
      timestamp: new Date()
    });
    
    console.log(`📊 Trust level updated: ${this.permissions.userTrustLevel}%`);
  }
  
  /**
   * Get safe workspace recommendations for specific tasks
   */
  recommendWorkspace(taskType: 'report-generation' | 'file-processing' | 'data-analysis' | 'testing'): WorkspaceZone | null {
    switch (taskType) {
      case 'report-generation':
        return this.workspaceZones.get('Generated Reports') || null;
      case 'file-processing':
        return this.workspaceZones.get('File Processing') || null;
      case 'data-analysis':
        return this.workspaceZones.get('AI Sandbox') || null;
      case 'testing':
        return this.workspaceZones.get('Drafts') || null;
      default:
        return this.workspaceZones.get('AI Sandbox') || null;
    }
  }
  
  /**
   * Create safe workspace if it doesn't exist
   */
  async ensureWorkspace(zoneName: string): Promise<string> {
    const zone = this.workspaceZones.get(zoneName);
    if (!zone) {
      throw new Error(`Workspace zone '${zoneName}' not found`);
    }
    
    // In a real implementation, this would create the directory
    console.log(`📁 Ensuring workspace: ${zone.path}`);
    return zone.path;
  }
  
  /**
   * Get operation history for transparency
   */
  getOperationHistory(limit: number = 20): FileOperation[] {
    return this.operationLog.slice(-limit);
  }
  
  /**
   * Export user preferences for session continuity
   */
  exportLearningData(): any {
    return {
      trustLevel: this.permissions.userTrustLevel,
      preferences: Object.fromEntries(this.userPreferences),
      successfulOperations: this.operationLog.filter(op => op.success).length,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Import learning data from previous sessions
   */
  importLearningData(data: any): void {
    if (data.trustLevel && typeof data.trustLevel === 'number') {
      this.permissions.userTrustLevel = Math.max(0, Math.min(100, data.trustLevel));
    }
    
    if (data.preferences) {
      this.userPreferences = new Map(Object.entries(data.preferences));
    }
    
    console.log(`📚 Imported learning data: Trust level ${this.permissions.userTrustLevel}%`);
  }
}

// Export singleton instance
export const hybridFileManager = new HybridFileManager();