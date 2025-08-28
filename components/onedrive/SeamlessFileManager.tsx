/**
 * Seamless OneDrive File Manager
 * Users only see files, no Microsoft auth complexity!
 * Powered by JWT Auth Bridge with graduated permissions
 */

'use client';

import { useState, useEffect } from 'react';
import { OneDriveProxyRequest } from '../../lib/cloud-access-bridge';

interface OneDriveFile {
  id: string;
  name: string;
  size: number;
  webUrl: string;
  lastModifiedDateTime: string;
  folder?: any;
  file?: any;
}

interface FileManagerProps {
  userToken: string; // JWT token
  className?: string;
}

export default function SeamlessFileManager({ userToken, className = '' }: FileManagerProps) {
  const [files, setFiles] = useState<OneDriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('/PH-Trading-Shared');
  const [userPermissions, setUserPermissions] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Load files from current path
  const loadFiles = async (path: string = currentPath) => {
    setLoading(true);
    setError('');
    
    try {
      const request: OneDriveProxyRequest = {
        operation: 'list',
        path
      };

      const response = await fetch('/api/onedrive-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load files');
      }

      setFiles(result.files || []);
      setUserPermissions(result.permissions);
      setCurrentPath(path);

    } catch (err: any) {
      setError(err.message);
      console.error('File loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const downloadFile = async (fileName: string) => {
    try {
      const request: OneDriveProxyRequest = {
        operation: 'download',
        path: currentPath,
        fileName
      };

      const response = await fetch('/api/onedrive-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();

      if (result.downloadUrl) {
        // Open download in new tab
        window.open(result.downloadUrl, '_blank');
      }

    } catch (err: any) {
      setError(`Download failed: ${err.message}`);
    }
  };

  // Share file (if user has permission)
  const shareFile = async (fileName: string) => {
    try {
      const request: OneDriveProxyRequest = {
        operation: 'share',
        path: currentPath,
        fileName
      };

      const response = await fetch('/api/onedrive-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();

      if (result.shareUrl) {
        // Copy share URL to clipboard
        navigator.clipboard.writeText(result.shareUrl);
        alert(`Share link copied to clipboard!\n${result.shareUrl}`);
      }

    } catch (err: any) {
      setError(`Share failed: ${err.message}`);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderName: string) => {
    const newPath = `${currentPath}/${folderName}`.replace('//', '/');
    loadFiles(newPath);
  };

  // Go back to parent folder
  const goBack = () => {
    if (currentPath === '/' || currentPath === '/PH-Trading-Shared') return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop(); // Remove last part
    const parentPath = pathParts.join('/') || '/';
    loadFiles(parentPath);
  };

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`seamless-file-manager ${className}`} style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#333' }}>
            📁 OneDrive Files
          </h3>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Path: {currentPath} • Permissions: {userPermissions || 'loading...'}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentPath !== '/PH-Trading-Shared' && (
            <button
              onClick={goBack}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          )}
          
          <button
            onClick={() => loadFiles(currentPath)}
            disabled={loading}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            🔄 {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* File List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading && files.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            No files found in this folder
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {files.map((file, index) => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: index < files.length - 1 ? '1px solid #f0f0f0' : 'none',
                  cursor: file.folder ? 'pointer' : 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => file.folder && navigateToFolder(file.name)}
              >
                {/* File Icon */}
                <div style={{ marginRight: '12px', fontSize: '20px' }}>
                  {file.folder ? '📁' : getFileIcon(file.name)}
                </div>

                {/* File Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: file.folder ? 'bold' : 'normal',
                    color: file.folder ? '#007bff' : '#333',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {!file.folder && `${formatFileSize(file.size)} • `}
                    {formatDate(file.lastModifiedDateTime)}
                  </div>
                </div>

                {/* Actions */}
                {!file.folder && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(file.name);
                      }}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      📥 Download
                    </button>

                    {userPermissions === 'full' || userPermissions === 'admin' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareFile(file.name);
                        }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        🔗 Share
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Get appropriate file icon based on extension
function getFileIcon(fileName: string): string {
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  
  switch (extension) {
    case '.xlsx':
    case '.xls':
      return '📊';
    case '.docx':
    case '.doc':
      return '📄';
    case '.pdf':
      return '📑';
    case '.png':
    case '.jpg':
    case '.jpeg':
      return '🖼️';
    case '.csv':
      return '📈';
    default:
      return '📄';
  }
}