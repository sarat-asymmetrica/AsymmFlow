import { NextRequest, NextResponse } from 'next/server';
import { hybridFileManager } from '@/lib/hybrid-file-manager';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, filePath, content, reason, userContext } = body;
    
    console.log(`📁 File management request: ${action} ${filePath}`);
    
    switch (action) {
      case 'test-permissions':
        return await handleTestPermissions(filePath, reason, userContext);
        
      case 'create-file':
        return await handleCreateFile(filePath, content, reason, userContext);
        
      case 'create-folder':
        return await handleCreateFolder(filePath, reason, userContext);
        
      case 'list-workspace':
        return await handleListWorkspace();
        
      case 'get-operation-history':
        return await handleGetHistory();
        
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown action',
          availableActions: ['test-permissions', 'create-file', 'create-folder', 'list-workspace', 'get-operation-history']
        }, { status: 400 });
    }
  } catch (error) {
    console.error('File management API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleTestPermissions(filePath: string, reason: string, userContext?: string) {
  const result = await hybridFileManager.requestOperation('create', filePath, reason, userContext);
  
  return NextResponse.json({
    success: true,
    permissions: result,
    riskAssessment: {
      approved: result.approved,
      requiresConfirmation: result.requiresConfirmation,
      message: result.message,
      backupPath: result.backupPath
    }
  });
}

async function handleCreateFile(filePath: string, content: string, reason: string, userContext?: string) {
  // Request permission first
  const permissionResult = await hybridFileManager.requestOperation('create', filePath, reason, userContext);
  
  if (!permissionResult.approved && permissionResult.requiresConfirmation) {
    return NextResponse.json({
      success: false,
      requiresConfirmation: true,
      message: permissionResult.message,
      permissionId: `create-${Date.now()}` // In real implementation, store this for later confirmation
    });
  }
  
  if (!permissionResult.approved) {
    return NextResponse.json({
      success: false,
      message: permissionResult.message,
      denied: true
    });
  }
  
  try {
    // Ensure the directory exists
    const directory = path.dirname(filePath);
    
    // For demonstration, let's use a safe workspace path
    const safeWorkspace = hybridFileManager.recommendWorkspace('testing');
    const safePath = safeWorkspace ? path.join(safeWorkspace.path, path.basename(filePath)) : filePath;
    
    // In a real implementation, create the directory and file
    console.log(`✅ Would create file: ${safePath}`);
    console.log(`📝 Content: ${content.substring(0, 100)}...`);
    
    // For now, simulate success
    return NextResponse.json({
      success: true,
      message: `File created successfully at ${safePath}`,
      actualPath: safePath,
      backup: permissionResult.backupPath,
      simulation: true // Remove this in real implementation
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleCreateFolder(filePath: string, reason: string, userContext?: string) {
  // Request permission first
  const permissionResult = await hybridFileManager.requestOperation('create', filePath, reason, userContext);
  
  if (!permissionResult.approved && permissionResult.requiresConfirmation) {
    return NextResponse.json({
      success: false,
      requiresConfirmation: true,
      message: permissionResult.message,
      permissionId: `mkdir-${Date.now()}`
    });
  }
  
  if (!permissionResult.approved) {
    return NextResponse.json({
      success: false,
      message: permissionResult.message,
      denied: true
    });
  }
  
  try {
    // For demonstration, recommend a safe workspace
    const safeWorkspace = hybridFileManager.recommendWorkspace('testing');
    const safePath = safeWorkspace ? path.join(safeWorkspace.path, path.basename(filePath)) : filePath;
    
    console.log(`📁 Would create folder: ${safePath}`);
    
    // In real implementation:
    // await fs.mkdir(safePath, { recursive: true });
    
    return NextResponse.json({
      success: true,
      message: `Folder created successfully at ${safePath}`,
      actualPath: safePath,
      simulation: true // Remove this in real implementation
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create folder',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleListWorkspace() {
  try {
    const workspaces = [
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
        autoExpiry: 60,
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
    
    return NextResponse.json({
      success: true,
      workspaces,
      recommendations: {
        'report-generation': 'Generated Reports',
        'file-processing': 'File Processing',
        'data-analysis': 'AI Sandbox',
        'testing': 'Drafts'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to list workspaces',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleGetHistory() {
  try {
    const history = hybridFileManager.getOperationHistory(10);
    const learningData = hybridFileManager.exportLearningData();
    
    return NextResponse.json({
      success: true,
      history,
      learningData,
      summary: {
        totalOperations: history.length,
        successfulOperations: history.filter(op => op.success).length,
        currentTrustLevel: learningData.trustLevel
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get history',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Hybrid File Management API',
    endpoints: {
      'POST /api/file-management': {
        'test-permissions': 'Test file operation permissions',
        'create-file': 'Create a file with safety checks',
        'create-folder': 'Create a folder with safety checks', 
        'list-workspace': 'List available safe workspace zones',
        'get-operation-history': 'Get operation history and learning data'
      }
    },
    status: 'Active',
    version: '1.0.0'
  });
}