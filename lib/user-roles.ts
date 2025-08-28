import bcrypt from 'bcryptjs';

// User roles and permissions system as per SPOC requirements
export enum UserRole {
  ADMIN = 'admin',     // Master user/owner
  MANAGER = 'manager', // Sales manager
  ACCOUNTS = 'accounts', // Finance team
  REGULAR = 'regular'  // Regular sales user
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Hashed password
  role: UserRole;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  assignedRFQs?: string[]; // For regular users
  teamMembers?: string[]; // For managers
}

// Permission definitions for each role based on SPOC requirements
export const rolePermissions = {
  [UserRole.ADMIN]: {
    // Master user - complete comprehensive access to everything
    modules: [
      'dashboard', 'quick-capture', 'rfq', 'costing', 'quotations', 
      'orders', 'delivery', 'payments', 'follow-ups', 'pipeline',
      'customer-intelligence', 'competition-intelligence', 'customers',
      'suppliers', 'data-migration', 'productivity', 'commissions',
      'currency', 'reports', 'admin', 'security', 'settings'
    ],
    features: {
      cashFlowVisibility: true,
      userManagement: true,
      teamActivityView: true,
      exportData: true,
      editSettings: true,
      viewAllMetrics: true,
      deleteRecords: true,
      setTargets: true
    }
  },
  
  [UserRole.MANAGER]: {
    // Manager - all except cash flow and user management admin
    modules: [
      'dashboard', 'quick-capture', 'rfq', 'costing', 'quotations',
      'orders', 'delivery', 'follow-ups', 'pipeline',
      'customer-intelligence', 'competition-intelligence', 'customers',
      'suppliers', 'productivity', 'reports'
    ],
    features: {
      cashFlowVisibility: false, // No cash flow visibility
      userManagement: false, // No admin options
      teamActivityView: true, // View every regular user's activity
      exportData: true,
      editSettings: false,
      viewAllMetrics: true, // Including team heatmaps
      deleteRecords: true,
      setTargets: true // Can set KPIs and targets for team
    }
  },
  
  [UserRole.ACCOUNTS]: {
    // Accountant - finance focused view
    modules: [
      'dashboard', 'orders', 'delivery', 'payments', 'customers',
      'suppliers', 'commissions', 'currency', 'reports'
    ],
    features: {
      cashFlowVisibility: true, // Needs to know cash flow
      userManagement: false,
      teamActivityView: false,
      exportData: true,
      editSettings: false,
      viewAllMetrics: false, // Only financial metrics
      deleteRecords: false,
      setTargets: false
    }
  },
  
  [UserRole.REGULAR]: {
    // Regular user - own activities only
    modules: [
      'dashboard', 'quick-capture', 'rfq', 'quotations',
      'orders', 'follow-ups', 'customers', 'productivity'
    ],
    features: {
      cashFlowVisibility: false,
      userManagement: false,
      teamActivityView: false, // Only see own heatmap
      exportData: false,
      editSettings: false,
      viewAllMetrics: false, // Only own metrics and KPIs
      deleteRecords: false,
      setTargets: false // Targets set by manager
    }
  }
};

// Mock users for development (in production, this would be in database)
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@phtrading.com',
    name: 'PH Trading Owner',
    password: bcrypt.hashSync('admin123', 10),
    role: UserRole.ADMIN,
    department: 'Management',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: '2',
    email: 'manager@phtrading.com',
    name: 'Sales Manager',
    password: bcrypt.hashSync('manager123', 10),
    role: UserRole.MANAGER,
    department: 'Sales',
    createdAt: new Date('2024-01-15'),
    isActive: true,
    teamMembers: ['4', '5', '6'] // IDs of team members
  },
  {
    id: '3',
    email: 'accounts@phtrading.com',
    name: 'Finance Officer',
    password: bcrypt.hashSync('accounts123', 10),
    role: UserRole.ACCOUNTS,
    department: 'Finance',
    createdAt: new Date('2024-02-01'),
    isActive: true
  },
  {
    id: '4',
    email: 'sales1@phtrading.com',
    name: 'John Sales Executive',
    password: bcrypt.hashSync('sales123', 10),
    role: UserRole.REGULAR,
    department: 'Sales',
    createdAt: new Date('2024-03-01'),
    isActive: true,
    assignedRFQs: ['RFQ-2025-118', 'RFQ-2025-119']
  },
  {
    id: '5',
    email: 'sales2@phtrading.com',
    name: 'Sarah Sales Executive',
    password: bcrypt.hashSync('sales123', 10),
    role: UserRole.REGULAR,
    department: 'Sales',
    createdAt: new Date('2024-03-15'),
    isActive: true,
    assignedRFQs: ['RFQ-2025-120']
  }
];

// Helper functions
export function hasPermission(userRole: UserRole, module: string): boolean {
  const permissions = rolePermissions[userRole];
  return permissions.modules.includes(module);
}

export function canAccessFeature(userRole: UserRole, feature: keyof typeof rolePermissions[UserRole.ADMIN]['features']): boolean {
  const permissions = rolePermissions[userRole];
  return permissions.features[feature] || false;
}

// Get filtered menu items based on user role
export function getMenuItemsForRole(userRole: UserRole) {
  const permissions = rolePermissions[userRole];
  return permissions.modules;
}

// Validate user credentials
export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = mockUsers.find(u => u.email === email && u.isActive);
  
  if (!user || !user.password) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (isValid) {
    // Don't send password to client
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
}

// Get user by ID
export function getUserById(id: string): User | null {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

// Get team members for a manager
export function getTeamMembers(managerId: string): User[] {
  const manager = mockUsers.find(u => u.id === managerId && u.role === UserRole.MANAGER);
  if (!manager || !manager.teamMembers) return [];
  
  return manager.teamMembers
    .map(id => getUserById(id))
    .filter((u): u is User => u !== null);
}

// Filter data based on user role (for RFQs, Orders, etc.)
export function filterDataByUser(data: any[], user: User): any[] {
  if (user.role === UserRole.ADMIN) {
    return data; // Admin sees everything
  }
  
  if (user.role === UserRole.MANAGER) {
    // Manager sees their team's data
    const teamIds = user.teamMembers || [];
    return data.filter(item => 
      teamIds.includes(item.assignedTo) || item.createdBy === user.id
    );
  }
  
  if (user.role === UserRole.REGULAR) {
    // Regular user sees only their own data
    return data.filter(item => 
      item.assignedTo === user.id || item.createdBy === user.id
    );
  }
  
  // Accounts sees financial data (no filtering needed for now)
  return data;
}