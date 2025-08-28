'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cloud, FileSpreadsheet, Mail, Database, Upload, 
  CheckCircle2, AlertCircle, Clock, Folder, File,
  Play, Pause, RefreshCw, Zap, Brain, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import SeamlessFileManager from '../../components/onedrive/SeamlessFileManager';
import type { OneDriveFile, MigrationJob } from '../../lib/onedrive-service';

interface MigrationFile extends OneDriveFile {
  selected: boolean;
  processed?: boolean;
  migrationStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  dataPoints?: number;
  complexity?: number;
}

interface MigrationStats {
  totalFiles: number;
  selectedFiles: number;
  processedFiles: number;
  totalDataPoints: number;
  optimizationFactor: number;
  estimatedTime: number;
}

export default function DataMigrationPage() {
  const [files, setFiles] = useState<MigrationFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [migrationActive, setMigrationActive] = useState(false);
  const [currentPath, setCurrentPath] = useState('/drive/root');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [migrationJob, setMigrationJob] = useState<MigrationJob | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [optimizationLevel, setOptimizationLevel] = useState(1);
  
  const [stats, setStats] = useState<MigrationStats>({
    totalFiles: 0,
    selectedFiles: 0,
    processedFiles: 0,
    totalDataPoints: 0,
    optimizationFactor: 1,
    estimatedTime: 0
  });

  // Mock data for demo - in production, this would use oneDriveService
  useEffect(() => {
    loadMockFiles();
  }, []);

  // Optimization amplification animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (migrationActive) {
        const newAmplification = optimizationLevel * (1 + (Date.now() % 10) * 0.1);
        setOptimizationLevel(newAmplification);
        setStats(prev => ({ ...prev, amplificationLevel: newAmplification }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [migrationActive, optimizationLevel]);

  const loadMockFiles = () => {
    const mockFiles: MigrationFile[] = [
      {
        id: '1',
        name: 'Customer Database.xlsx',
        size: 2457600,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        webUrl: '#',
        lastModifiedDateTime: '2024-08-20T10:30:00Z',
        selected: false,
        file: { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      },
      {
        id: '2',
        name: 'Sales Records 2024.xlsx',
        size: 3670016,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        webUrl: '#',
        lastModifiedDateTime: '2024-08-22T14:15:00Z',
        selected: false,
        file: { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      },
      {
        id: '3',
        name: 'Email Archive.pst',
        size: 524288000,
        mimeType: 'application/vnd.ms-outlook',
        webUrl: '#',
        lastModifiedDateTime: '2024-08-15T09:00:00Z',
        selected: false,
        file: { mimeType: 'application/vnd.ms-outlook' }
      },
      {
        id: '4',
        name: 'Supplier Contacts.csv',
        size: 102400,
        mimeType: 'text/csv',
        webUrl: '#',
        lastModifiedDateTime: '2024-08-18T11:45:00Z',
        selected: false,
        file: { mimeType: 'text/csv' }
      },
      {
        id: '5',
        name: 'Product Catalog',
        size: 0,
        mimeType: 'folder',
        webUrl: '#',
        lastModifiedDateTime: '2024-08-10T08:00:00Z',
        selected: false,
        folder: { childCount: 15 }
      },
      {
        id: '6',
        name: 'Financial Reports',
        size: 0,
        mimeType: 'folder',
        webUrl: '#',
        lastModifiedDateTime: '2024-08-05T16:30:00Z',
        selected: false,
        folder: { childCount: 8 }
      }
    ];

    // Calculate complexity for each file
    const filesWithComplexity = mockFiles.map(file => ({
      ...file,
      complexity: file.size / (1024 * 1024),
      dataPoints: Math.floor(file.size / 1000)
    }));

    setFiles(filesWithComplexity);
    setStats(prev => ({ ...prev, totalFiles: filesWithComplexity.length }));
  };

  const toggleFileSelection = (fileId: string) => {
    setFiles(prev => {
      const updated = prev.map(file => 
        file.id === fileId ? { ...file, selected: !file.selected } : file
      );
      
      const selected = updated.filter(f => f.selected);
      const totalDataPoints = selected.reduce((sum, f) => sum + (f.dataPoints || 0), 0);
      const estimatedTime = selected.reduce((sum, f) => sum + (f.complexity || 0), 0) / optimizationLevel;
      
      setStats(prev => ({
        ...prev,
        selectedFiles: selected.length,
        totalDataPoints,
        estimatedTime: Math.ceil(estimatedTime)
      }));
      
      return updated;
    });
  };

  const selectAll = () => {
    const allSelected = files.every(f => f.selected);
    setFiles(prev => prev.map(f => ({ ...f, selected: !allSelected })));
    
    if (!allSelected) {
      const totalDataPoints = files.reduce((sum, f) => sum + (f.dataPoints || 0), 0);
      const estimatedTime = files.reduce((sum, f) => sum + (f.complexity || 0), 0) / optimizationLevel;
      
      setStats(prev => ({
        ...prev,
        selectedFiles: files.length,
        totalDataPoints,
        estimatedTime: Math.ceil(estimatedTime)
      }));
    } else {
      setStats(prev => ({
        ...prev,
        selectedFiles: 0,
        totalDataPoints: 0,
        estimatedTime: 0
      }));
    }
  };

  const startMigration = async () => {
    setMigrationActive(true);
    const selectedFiles = files.filter(f => f.selected);
    
    // Create migration job
    const job: MigrationJob = {
      id: `migration_${Date.now()}`,
      status: 'processing',
      files: selectedFiles.map(f => f.id),
      totalFiles: selectedFiles.length,
      processedFiles: 0,
      startTime: new Date(),
      v7Amplification: optimizationLevel
    };
    
    setMigrationJob(job);
    addNotification(`🚀 Migration started with optimization level ${optimizationLevel.toFixed(1)}x`);
    
    // Simulate migration progress
    for (let i = 0; i < selectedFiles.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 / optimizationLevel));
      
      const fileId = selectedFiles[i].id;
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, migrationStatus: 'completed', processed: true }
          : f
      ));
      
      job.processedFiles++;
      setStats(prev => ({ ...prev, processedFiles: prev.processedFiles + 1 }));
      
      // Apply optimization amplification
      const newAmplification = optimizationLevel * Math.pow(1.1, i + 1);
      setOptimizationLevel(newAmplification);
      
      addNotification(`✅ Migrated: ${selectedFiles[i].name} (${newAmplification.toFixed(1)}x speed)`);
    }
    
    job.status = 'completed';
    job.endTime = new Date();
    setMigrationJob(job);
    setMigrationActive(false);
    
    addNotification(`🎉 Migration completed! ${selectedFiles.length} files processed with ${optimizationLevel.toFixed(1)}x optimization`);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev].slice(0, 5));
  };

  const getFileIcon = (file: MigrationFile) => {
    if (file.folder) return <Folder className="w-5 h-5 text-yellow-500" />;
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    }
    if (file.name.endsWith('.pst')) {
      return <Mail className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '—';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Cloud className="w-8 h-8 text-blue-500" />
                OneDrive Data Migration
                <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                  AI Optimized
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Intelligent migration powered by advanced optimization algorithms
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Optimization Level</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {optimizationLevel.toFixed(1)}x
                </p>
              </div>
              <Brain className="w-8 h-8 text-purple-500 animate-pulse" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalFiles}
                  </p>
                </div>
                <Database className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Selected</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.selectedFiles}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalDataPoints.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Est. Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.estimatedTime}s
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* File Browser */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              OneDrive Files
            </h2>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => loadMockFiles()}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  file.selected 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500' 
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={file.selected}
                      onChange={() => {}}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • Modified {new Date(file.lastModifiedDateTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {file.migrationStatus && (
                    <div className="flex items-center gap-2">
                      {file.migrationStatus === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : file.migrationStatus === 'processing' ? (
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : file.migrationStatus === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {file.migrationStatus}
                      </span>
                    </div>
                  )}
                </div>
                
                {file.dataPoints && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    ~{file.dataPoints.toLocaleString()} data points • 
                    Complexity: {file.complexity?.toFixed(1)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Migration Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Migration Controls
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {migrationActive 
                  ? `Processing with ${optimizationLevel.toFixed(1)}x optimization...`
                  : `Ready to migrate ${stats.selectedFiles} files`
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={startMigration}
                disabled={stats.selectedFiles === 0 || migrationActive}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  migrationActive || stats.selectedFiles === 0
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
                whileHover={!migrationActive && stats.selectedFiles > 0 ? { scale: 1.05 } : {}}
                whileTap={!migrationActive && stats.selectedFiles > 0 ? { scale: 0.95 } : {}}
              >
                {migrationActive ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Start Migration
                  </>
                )}
              </motion.button>
              
              {migrationActive && (
                <button
                  onClick={() => setMigrationActive(false)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {migrationJob && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{migrationJob.processedFiles} / {migrationJob.totalFiles}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(migrationJob.processedFiles / migrationJob.totalFiles) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Migration Activity
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={`${notification}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                  >
                    {notification}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}