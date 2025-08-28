/**
 * Cloud Access Bridge - Asymmetric Enhancement Wave
 * Bridges JWT 4-tier hierarchy with OneDrive binary auth
 * Mathematical constraint resolution through graduated permissions
 */

import { UserRole } from './user-roles';

export interface CloudAccessProfile {
  role: UserRole;
  onedrive: {
    enabled: boolean;
    permissions: OneDrivePermissionLevel;
    folderAccess: string[];
    fileTypes: string[];
    quotaGB: number;
    sharing: boolean;
    adminControls: boolean;
  };
  // Future cloud services
  googleDrive?: CloudServiceConfig;
  dropbox?: CloudServiceConfig;
}

export type OneDrivePermissionLevel = 'read' | 'write' | 'full' | 'admin';

export interface CloudServiceConfig {
  enabled: boolean;
  permissions: string[];
  quotaGB: number;
}

/**
 * ASYMMETRIC DISCOVERY: Natural 4-tier cloud access hierarchy
 * Maps your JWT roles to graduated OneDrive permissions
 */
export const cloudAccessMatrix: Record<UserRole, CloudAccessProfile> = {
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    onedrive: {
      enabled: true,
      permissions: 'admin',
      folderAccess: ['/*'], // All folders
      fileTypes: ['*'], // All file types
      quotaGB: 1000, // 1TB
      sharing: true,
      adminControls: true
    }
  },

  [UserRole.MANAGER]: {
    role: UserRole.MANAGER,
    onedrive: {
      enabled: true,
      permissions: 'full',
      folderAccess: [
        '/PH-Trading-Shared/*',
        '/Team-Files/*',
        '/Reports/*',
        '/Templates/*'
      ],
      fileTypes: ['.xlsx', '.docx', '.pdf', '.png', '.jpg'],
      quotaGB: 100, // 100GB
      sharing: true,
      adminControls: false
    }
  },

  [UserRole.ACCOUNTS]: {
    role: UserRole.ACCOUNTS,
    onedrive: {
      enabled: true,
      permissions: 'write',
      folderAccess: [
        '/PH-Trading-Shared/Finance/*',
        '/Reports/Financial/*',
        '/Templates/Invoices/*'
      ],
      fileTypes: ['.xlsx', '.pdf', '.csv'],
      quotaGB: 50, // 50GB
      sharing: false, // No sharing for accounts
      adminControls: false
    }
  },

  [UserRole.REGULAR]: {
    role: UserRole.REGULAR,
    onedrive: {
      enabled: true,
      permissions: 'read',
      folderAccess: [
        '/PH-Trading-Shared/Public/*',
        '/Templates/Sales/*'
      ],
      fileTypes: ['.pdf', '.docx'],
      quotaGB: 10, // 10GB
      sharing: false,
      adminControls: false
    }
  }
};

/**
 * Enhanced JWT Payload with Cloud Capabilities
 */
export interface EnhancedJWTPayload {
  // Original JWT data
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  
  // NEW: Cloud access capabilities
  cloudAccess: {
    onedrive: CloudAccessProfile['onedrive'];
    profileVersion: string; // For cache busting
  };
}

/**
 * Auth Bridge Service - Amplifies both systems
 */
export class CloudAccessBridge {
  
  /**
   * Enhance JWT token with cloud capabilities
   */
  static enhanceJWTPayload(basePayload: any): EnhancedJWTPayload {
    const userRole = basePayload.role as UserRole;
    const cloudProfile = cloudAccessMatrix[userRole];
    
    return {
      ...basePayload,
      cloudAccess: {
        onedrive: cloudProfile.onedrive,
        profileVersion: '1.0'
      }
    };
  }

  /**
   * Check if user can access specific OneDrive path
   */
  static canAccessPath(userRole: UserRole, path: string): boolean {
    const profile = cloudAccessMatrix[userRole];
    
    return profile.onedrive.folderAccess.some(allowedPath => {
      if (allowedPath === '/*') return true;
      if (allowedPath.endsWith('/*')) {
        return path.startsWith(allowedPath.slice(0, -2));
      }
      return path === allowedPath;
    });
  }

  /**
   * Check if user can handle specific file type
   */
  static canHandleFileType(userRole: UserRole, fileName: string): boolean {
    const profile = cloudAccessMatrix[userRole];
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    
    return profile.onedrive.fileTypes.includes('*') || 
           profile.onedrive.fileTypes.includes(extension);
  }

  /**
   * Get user's OneDrive quota limit
   */
  static getQuotaLimit(userRole: UserRole): number {
    return cloudAccessMatrix[userRole].onedrive.quotaGB;
  }

  /**
   * Check if user can share files
   */
  static canShare(userRole: UserRole): boolean {
    return cloudAccessMatrix[userRole].onedrive.sharing;
  }

  /**
   * Get Microsoft Graph API scopes for user role
   */
  static getMicrosoftGraphScopes(userRole: UserRole): string[] {
    const profile = cloudAccessMatrix[userRole];
    
    const baseScopes = ['User.Read', 'offline_access'];
    
    switch (profile.onedrive.permissions) {
      case 'admin':
        return [...baseScopes, 'Files.ReadWrite.All', 'Sites.FullControl.All'];
      case 'full':
        return [...baseScopes, 'Files.ReadWrite', 'Sites.ReadWrite.All'];
      case 'write':
        return [...baseScopes, 'Files.ReadWrite'];
      case 'read':
        return [...baseScopes, 'Files.Read'];
      default:
        return baseScopes;
    }
  }

  /**
   * Validate OneDrive operation against user permissions
   */
  static validateOperation(
    userRole: UserRole, 
    operation: 'read' | 'write' | 'delete' | 'share',
    path: string,
    fileName?: string
  ): { allowed: boolean; reason?: string } {
    const profile = cloudAccessMatrix[userRole];
    
    // Check if OneDrive is enabled for user
    if (!profile.onedrive.enabled) {
      return { allowed: false, reason: 'OneDrive access not enabled for this role' };
    }

    // Check path access
    if (!this.canAccessPath(userRole, path)) {
      return { allowed: false, reason: 'Access denied to this folder' };
    }

    // Check file type (if fileName provided)
    if (fileName && !this.canHandleFileType(userRole, fileName)) {
      return { allowed: false, reason: 'File type not allowed for this role' };
    }

    // Check operation permissions
    const userPermission = profile.onedrive.permissions;
    
    switch (operation) {
      case 'read':
        return { allowed: true };
        
      case 'write':
        if (['write', 'full', 'admin'].includes(userPermission)) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Write access not permitted' };
        
      case 'delete':
        if (['full', 'admin'].includes(userPermission)) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Delete access not permitted' };
        
      case 'share':
        if (profile.onedrive.sharing) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Sharing not permitted for this role' };
        
      default:
        return { allowed: false, reason: 'Unknown operation' };
    }
  }
}

/**
 * OneDrive Proxy Request Interface
 */
export interface OneDriveProxyRequest {
  operation: 'list' | 'download' | 'upload' | 'delete' | 'share';
  path: string;
  fileName?: string;
  data?: any;
}