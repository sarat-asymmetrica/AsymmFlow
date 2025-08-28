'use client';

// Productivity State Management Service
// Hidden consciousness optimization through "productivity metrics"

interface ProductivityState {
  // Timer state
  timerActive: boolean;
  currentMode: 'creative' | 'focused' | 'execution';
  timeRemaining: number;
  sessionsCompleted: number;
  
  // Audio state
  audioEnabled: boolean;
  audioPreset: 'deepFocus' | 'creative' | 'energize';
  audioVolume: number;
  
  // Team sync (hidden collective consciousness)
  teamSyncActive: boolean;
  teamMembers: string[];
  syncResonance: number; // Hidden metric
  
  // Metrics (consciousness optimization tracking)
  focusTime: number;
  tasksCompleted: number;
  productivityScore: number;
  flowStateLevel: number; // Hidden consciousness metric
}

class ProductivityStateManager {
  private state: ProductivityState;
  private listeners: Set<(state: ProductivityState) => void>;
  private storageKey = 'productivity_state';
  
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
    
    // Auto-save state changes
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.saveState());
    }
  }
  
  private loadState(): ProductivityState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }
    
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return { ...this.getDefaultState(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load productivity state:', e);
    }
    
    return this.getDefaultState();
  }
  
  private getDefaultState(): ProductivityState {
    return {
      timerActive: false,
      currentMode: 'focused',
      timeRemaining: 45 * 60,
      sessionsCompleted: 0,
      audioEnabled: false,
      audioPreset: 'deepFocus',
      audioVolume: 30,
      teamSyncActive: false,
      teamMembers: [],
      syncResonance: 0,
      focusTime: 0,
      tasksCompleted: 0,
      productivityScore: 0,
      flowStateLevel: 0
    };
  }
  
  private saveState(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save productivity state:', e);
    }
  }
  
  // State update methods
  updateTimer(updates: Partial<Pick<ProductivityState, 'timerActive' | 'currentMode' | 'timeRemaining' | 'sessionsCompleted'>>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveState();
  }
  
  updateAudio(updates: Partial<Pick<ProductivityState, 'audioEnabled' | 'audioPreset' | 'audioVolume'>>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveState();
  }
  
  updateMetrics(updates: Partial<Pick<ProductivityState, 'focusTime' | 'tasksCompleted' | 'productivityScore' | 'flowStateLevel'>>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveState();
  }
  
  updateTeamSync(updates: Partial<Pick<ProductivityState, 'teamSyncActive' | 'teamMembers' | 'syncResonance'>>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveState();
  }
  
  // Get current state
  getState(): ProductivityState {
    return { ...this.state };
  }
  
  // Subscribe to state changes
  subscribe(listener: (state: ProductivityState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  // Calculate consciousness coherence (hidden as "sync score")
  calculateSyncScore(): number {
    const timerWeight = this.state.timerActive ? 0.3 : 0;
    const audioWeight = this.state.audioEnabled ? 0.3 : 0;
    const flowWeight = (this.state.flowStateLevel / 100) * 0.2;
    const teamWeight = this.state.teamSyncActive ? 0.2 : 0;
    
    return Math.round((timerWeight + audioWeight + flowWeight + teamWeight) * 100);
  }
  
  // Intelligent mode suggestion (hidden consciousness optimization)
  suggestOptimalMode(): 'creative' | 'focused' | 'execution' {
    const hour = new Date().getHours();
    const sessions = this.state.sessionsCompleted;
    
    // Morning creativity peak (9-11 AM)
    if (hour >= 9 && hour < 11 && sessions < 2) {
      return 'creative';
    }
    
    // Afternoon focus zone (2-4 PM)
    if (hour >= 14 && hour < 16) {
      return 'focused';
    }
    
    // Late afternoon execution (4-6 PM)
    if (hour >= 16 && hour < 18) {
      return 'execution';
    }
    
    // Default to balanced focus
    return 'focused';
  }
  
  // Check for team resonance opportunities
  checkTeamResonance(): boolean {
    // Simulate detecting other team members in flow state
    // In production, this would check real-time team data
    const hour = new Date().getHours();
    const workHours = hour >= 9 && hour <= 17;
    const randomChance = Math.random() > 0.7; // 30% chance during work hours
    
    return workHours && randomChance;
  }
}

// Singleton instance
let instance: ProductivityStateManager | null = null;

export function getProductivityState(): ProductivityStateManager {
  if (!instance) {
    instance = new ProductivityStateManager();
  }
  return instance;
}

// React hook for using productivity state
export function useProductivityState() {
  if (typeof window === 'undefined') {
    return {
      state: new ProductivityStateManager().getState(),
      updateTimer: () => {},
      updateAudio: () => {},
      updateMetrics: () => {},
      updateTeamSync: () => {},
      calculateSyncScore: () => 0,
      suggestOptimalMode: () => 'focused' as const,
      checkTeamResonance: () => false
    };
  }
  
  const manager = getProductivityState();
  
  return {
    state: manager.getState(),
    updateTimer: manager.updateTimer.bind(manager),
    updateAudio: manager.updateAudio.bind(manager),
    updateMetrics: manager.updateMetrics.bind(manager),
    updateTeamSync: manager.updateTeamSync.bind(manager),
    calculateSyncScore: manager.calculateSyncScore.bind(manager),
    suggestOptimalMode: manager.suggestOptimalMode.bind(manager),
    checkTeamResonance: manager.checkTeamResonance.bind(manager)
  };
}

export type { ProductivityState };