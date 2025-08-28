'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Shield, Edit2, Trash2, Check, X, Mail, Building, Calendar, Activity } from 'lucide-react';
import { UserRole, mockUsers, User } from '../../../lib/user-roles';
import bcrypt from 'bcryptjs';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  
  // New user form
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.REGULAR,
    department: 'Sales'
  });

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    byRole: {} as Record<UserRole, number>
  });

  useEffect(() => {
    // Load users (in production, this would be from API)
    loadUsers();
  }, []);

  const loadUsers = () => {
    // In production, fetch from API
    const loadedUsers = [...mockUsers];
    setUsers(loadedUsers);
    
    // Calculate stats
    const activeCount = loadedUsers.filter(u => u.isActive).length;
    const roleCounts = loadedUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);
    
    setStats({
      totalUsers: loadedUsers.length,
      activeUsers: activeCount,
      byRole: roleCounts
    });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill all required fields');
      return;
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role,
      department: newUser.department,
      createdAt: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    
    // In production, save to API
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setShowAddUser(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: UserRole.REGULAR,
      department: 'Sales'
    });
    
    alert('User added successfully!');
    loadUsers();
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: '#dc2626',
      [UserRole.MANAGER]: '#2563eb',
      [UserRole.ACCOUNTS]: '#7c3aed',
      [UserRole.REGULAR]: '#059669'
    };
    return colors[role];
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return '👑';
      case UserRole.MANAGER: return '📊';
      case UserRole.ACCOUNTS: return '💰';
      case UserRole.REGULAR: return '👤';
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '30px' }}
        >
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            User Management
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            Manage system users and their access permissions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <Users className="w-5 h-5" style={{ color: '#3b82f6', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Users</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <Activity className="w-5 h-5" style={{ color: '#10b981', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {stats.activeUsers}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active Users</div>
          </motion.div>

          {Object.entries(stats.byRole).map(([role, count], index) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                {getRoleIcon(role as UserRole)}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
                {count}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                {role}s
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                flex: 1,
                maxWidth: '300px'
              }}
            />
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Roles</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.MANAGER}>Manager</option>
              <option value={UserRole.ACCOUNTS}>Accounts</option>
              <option value={UserRole.REGULAR}>Regular</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddUser(true)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </motion.button>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  USER
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  ROLE
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  DEPARTMENT
                </th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  STATUS
                </th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  CREATED
                </th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: `${getRoleBadgeColor(user.role)}15`,
                      color: getRoleBadgeColor(user.role),
                      border: `1px solid ${getRoleBadgeColor(user.role)}30`
                    }}>
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                      <Building className="w-3 h-3" />
                      {user.department || 'Not assigned'}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        background: user.isActive ? '#10b98115' : '#ef444415',
                        color: user.isActive ? '#059669' : '#dc2626'
                      }}
                    >
                      {user.isActive ? (
                        <><Check className="w-3 h-3" style={{ display: 'inline' }} /> Active</>
                      ) : (
                        <><X className="w-3 h-3" style={{ display: 'inline' }} /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => setEditingUser(user)}
                        style={{
                          padding: '6px',
                          background: '#3b82f615',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#3b82f6'
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user.role !== UserRole.ADMIN && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          style={{
                            padding: '6px',
                            background: '#ef444415',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#dc2626'
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              <Users className="w-12 h-12" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No users found matching your criteria</p>
            </div>
          )}
        </motion.div>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              onClick={() => setShowAddUser(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '90%',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                  Add New User
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@phtrading.com"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Enter password"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      User Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value={UserRole.REGULAR}>Regular User</option>
                      <option value={UserRole.MANAGER}>Manager</option>
                      <option value={UserRole.ACCOUNTS}>Accounts</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Department
                    </label>
                    <select
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={handleAddUser}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Permission Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f0f9ff',
            borderRadius: '12px',
            border: '1px solid #bfdbfe'
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e40af' }}>
            <Shield className="w-5 h-5" style={{ display: 'inline', marginRight: '8px' }} />
            User Role Permissions
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>
                👑 Admin (Master User)
              </div>
              <ul style={{ fontSize: '12px', color: '#64748b', marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Complete system access</li>
                <li>User management</li>
                <li>All dashboards & reports</li>
                <li>System settings</li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
                📊 Manager
              </div>
              <ul style={{ fontSize: '12px', color: '#64748b', marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Team activity monitoring</li>
                <li>All modules except finance</li>
                <li>Set KPIs and targets</li>
                <li>Export data</li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#7c3aed', marginBottom: '8px' }}>
                💰 Accounts
              </div>
              <ul style={{ fontSize: '12px', color: '#64748b', marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Cash flow visibility</li>
                <li>Payment management</li>
                <li>Currency conversion</li>
                <li>Financial reports</li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669', marginBottom: '8px' }}>
                👤 Regular User
              </div>
              <ul style={{ fontSize: '12px', color: '#64748b', marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Own RFQs and quotations</li>
                <li>Personal dashboard</li>
                <li>Create opportunities</li>
                <li>View own metrics</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}