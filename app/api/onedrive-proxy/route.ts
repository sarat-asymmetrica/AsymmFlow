/**
 * OneDrive Proxy Service - JWT-Authenticated Cloud Bridge
 * Users authenticate with YOUR JWT system, backend handles Microsoft auth
 * Asymmetric Enhancement: Graduated permissions by role
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { CloudAccessBridge, OneDriveProxyRequest } from '../../../lib/cloud-access-bridge';
import { withSecurity } from '../../../lib/security-middleware';
import jwt from 'jsonwebtoken';

// App-level Microsoft Graph client (no user interaction needed)
async function getAppGraphClient(): Promise<Client> {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  
  if (!clientId || !clientSecret) {
    throw new Error('Microsoft Graph credentials not configured');
  }

  // Get app-only access token
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString()
  });

  const tokens = await tokenResponse.json();
  
  if (tokens.error) {
    throw new Error(`Microsoft Graph auth failed: ${tokens.error_description}`);
  }

  return Client.init({
    authProvider: (done) => {
      done(null, tokens.access_token);
    }
  });
}

async function handleOneDriveProxy(request: NextRequest, context: { user?: any }): Promise<NextResponse> {
  try {
    // Verify JWT authentication (handled by withSecurity middleware)
    if (!context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { userId, role, cloudAccess } = context.user;
    
    // Verify cloud access is enabled for user
    if (!cloudAccess?.onedrive?.enabled) {
      return NextResponse.json({ 
        error: 'OneDrive access not enabled for your role' 
      }, { status: 403 });
    }

    const { operation, path, fileName, data }: OneDriveProxyRequest = await request.json();
    
    // Ensure required parameters are provided
    if (!operation || !path) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Validate operation against user permissions
    const validation = CloudAccessBridge.validateOperation(role, operation as any, path, fileName);
    if (!validation.allowed) {
      return NextResponse.json({ 
        error: validation.reason,
        userRole: role,
        allowedPaths: cloudAccess.onedrive.folderAccess
      }, { status: 403 });
    }

    // Get Microsoft Graph client (app-level, no user auth needed)
    const graphClient = await getAppGraphClient();
    
    // Execute operation based on type
    switch (operation) {
      case 'list':
        return await handleListFiles(graphClient, path, cloudAccess);
        
      case 'download':
        if (!fileName) {
          return NextResponse.json({ error: 'fileName required for download' }, { status: 400 });
        }
        return await handleDownload(graphClient, path, fileName, cloudAccess);
        
      case 'upload':
        if (!fileName || !data) {
          return NextResponse.json({ error: 'fileName and data required for upload' }, { status: 400 });
        }
        return await handleUpload(graphClient, path, fileName, data, cloudAccess);
        
      case 'delete':
        if (!fileName) {
          return NextResponse.json({ error: 'fileName required for delete' }, { status: 400 });
        }
        return await handleDelete(graphClient, path, fileName, cloudAccess);
        
      case 'share':
        if (!fileName) {
          return NextResponse.json({ error: 'fileName required for share' }, { status: 400 });
        }
        return await handleShare(graphClient, path, fileName, cloudAccess);
        
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('OneDrive Proxy error:', error);
    return NextResponse.json({ 
      error: 'OneDrive operation failed',
      details: error.message 
    }, { status: 500 });
  }
}

async function handleListFiles(graphClient: Client, path: string, cloudAccess: any): Promise<NextResponse> {
  try {
    // Convert path to Microsoft Graph API path
    const apiPath = path.startsWith('/') ? `/drive/root:${path}:/children` : `/drive/root/children`;
    
    const response = await graphClient
      .api(apiPath)
      .select('id,name,size,webUrl,lastModifiedDateTime,folder,file,parentReference')
      .top(100) // Limit results
      .get();

    // Filter results based on user's file type permissions
    const allowedFileTypes = cloudAccess.onedrive.fileTypes;
    const filteredFiles = response.value.filter((file: any) => {
      if (file.folder) return true; // Always show folders
      if (allowedFileTypes.includes('*')) return true; // Admin can see all
      
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      return allowedFileTypes.includes(extension);
    });

    return NextResponse.json({
      files: filteredFiles,
      path,
      userQuota: `${cloudAccess.onedrive.quotaGB}GB`,
      permissions: cloudAccess.onedrive.permissions
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleDownload(graphClient: Client, path: string, fileName: string, cloudAccess: any): Promise<NextResponse> {
  try {
    const filePath = `${path}/${fileName}`.replace('//', '/');
    const apiPath = `/drive/root:${filePath}`;
    
    // Get download URL
    const downloadResponse = await graphClient
      .api(apiPath)
      .select('id,name,@microsoft.graph.downloadUrl')
      .get();
    
    return NextResponse.json({ 
      downloadUrl: downloadResponse['@microsoft.graph.downloadUrl'],
      fileName,
      path
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleUpload(graphClient: Client, path: string, fileName: string, data: any, cloudAccess: any): Promise<NextResponse> {
  try {
    // Check if user has write permissions
    if (!['write', 'full', 'admin'].includes(cloudAccess.onedrive.permissions)) {
      return NextResponse.json({ error: 'Upload not permitted' }, { status: 403 });
    }

    const filePath = `${path}/${fileName}`.replace('//', '/');
    const apiPath = `/drive/root:${filePath}:/content`;
    
    // Upload file (simplified - in production, handle large files with resumable upload)
    const uploadResponse = await graphClient
      .api(apiPath)
      .put(Buffer.from(data, 'base64'));
    
    return NextResponse.json({ 
      success: true,
      file: uploadResponse,
      message: `File ${fileName} uploaded successfully`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleDelete(graphClient: Client, path: string, fileName: string, cloudAccess: any): Promise<NextResponse> {
  try {
    // Check if user has delete permissions
    if (!['full', 'admin'].includes(cloudAccess.onedrive.permissions)) {
      return NextResponse.json({ error: 'Delete not permitted' }, { status: 403 });
    }

    const filePath = `${path}/${fileName}`.replace('//', '/');
    const apiPath = `/drive/root:${filePath}`;
    
    await graphClient.api(apiPath).delete();
    
    return NextResponse.json({ 
      success: true,
      message: `File ${fileName} deleted successfully`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleShare(graphClient: Client, path: string, fileName: string, cloudAccess: any): Promise<NextResponse> {
  try {
    // Check if user can share
    if (!cloudAccess.onedrive.sharing) {
      return NextResponse.json({ error: 'Sharing not permitted for your role' }, { status: 403 });
    }

    const filePath = `${path}/${fileName}`.replace('//', '/');
    const apiPath = `/drive/root:${filePath}:/createLink`;
    
    const shareResponse = await graphClient
      .api(apiPath)
      .post({
        type: 'view', // Read-only sharing
        scope: 'organization' // Only within organization
      });
    
    return NextResponse.json({ 
      shareUrl: shareResponse.link.webUrl,
      message: `Share link created for ${fileName}`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Apply security middleware with JWT authentication required
export const POST = withSecurity({
  requireAuth: true,
  logRequest: true,
  rateLimit: { maxRequests: 50, windowMs: 15 * 60 * 1000 }, // 50 OneDrive ops per 15 min
  allowedMethods: ['POST']
})(handleOneDriveProxy);