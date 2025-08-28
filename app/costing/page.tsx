'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Calculator, Download, Upload, Save, Send, DollarSign, Package, TrendingUp, FileSpreadsheet } from 'lucide-react';

interface CostingItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  currency: 'USD' | 'EUR' | 'AED' | 'QAR';
  exchangeRate: number;
  margin: number; // Percentage
  markup: number; // Percentage
  totalCost: number;
  sellingPrice: number;
}

interface CostingSheet {
  id: string;
  rfqNumber: string;
  customer: string;
  project: string;
  items: CostingItem[];
  totalCost: number;
  totalSellingPrice: number;
  profitMargin: number;
  revision: number;
  status: 'draft' | 'finalized' | 'quoted';
  createdDate: string;
  lastModified: string;
}

export default function CostingSheet() {
  const [costingSheets, setCostingSheets] = useState<CostingSheet[]>([]);
  const [activeCostingSheet, setActiveCostingSheet] = useState<CostingSheet | null>(null);
  const [items, setItems] = useState<CostingItem[]>([]);
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    EUR: 1.08,
    AED: 3.67,
    QAR: 3.64
  });
  
  // Default margins and markups (can be customized)
  const [defaultMargin, setDefaultMargin] = useState(15); // 15% margin
  const [defaultMarkup, setDefaultMarkup] = useState(20); // 20% markup

  useEffect(() => {
    // Load saved costing sheets from localStorage
    const saved = localStorage.getItem('costingSheets');
    if (saved) {
      setCostingSheets(JSON.parse(saved));
    }
    
    // Load exchange rates (would be from API in production)
    const savedRates = localStorage.getItem('exchangeRates');
    if (savedRates) {
      setExchangeRates(JSON.parse(savedRates));
    }
  }, []);

  const addItem = () => {
    const newItem: CostingItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitCost: 0,
      currency: 'USD',
      exchangeRate: exchangeRates.USD,
      margin: defaultMargin,
      markup: defaultMarkup,
      totalCost: 0,
      sellingPrice: 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<CostingItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        
        // Recalculate prices
        const baseCost = updated.quantity * updated.unitCost;
        updated.totalCost = baseCost * updated.exchangeRate;
        
        // Apply margin and markup
        const marginAmount = updated.totalCost * (updated.margin / 100);
        const markupAmount = updated.totalCost * (updated.markup / 100);
        updated.sellingPrice = updated.totalCost + marginAmount + markupAmount;
        
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
    const totalSelling = items.reduce((sum, item) => sum + item.sellingPrice, 0);
    const profitMargin = totalCost > 0 ? ((totalSelling - totalCost) / totalCost) * 100 : 0;
    
    return { totalCost, totalSelling, profitMargin };
  };

  const saveCostingSheet = (status: 'draft' | 'finalized' = 'draft') => {
    const { totalCost, totalSelling, profitMargin } = calculateTotals();
    
    const newSheet: CostingSheet = {
      id: activeCostingSheet?.id || `CS-${Date.now()}`,
      rfqNumber: activeCostingSheet?.rfqNumber || 'RFQ-2025-NEW',
      customer: activeCostingSheet?.customer || 'New Customer',
      project: activeCostingSheet?.project || 'New Project',
      items,
      totalCost,
      totalSellingPrice: totalSelling,
      profitMargin,
      revision: activeCostingSheet ? activeCostingSheet.revision + 1 : 1,
      status,
      createdDate: activeCostingSheet?.createdDate || new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    const updatedSheets = activeCostingSheet
      ? costingSheets.map(sheet => sheet.id === newSheet.id ? newSheet : sheet)
      : [...costingSheets, newSheet];
    
    setCostingSheets(updatedSheets);
    localStorage.setItem('costingSheets', JSON.stringify(updatedSheets));
    setActiveCostingSheet(newSheet);
    
    alert(status === 'finalized' 
      ? 'Costing sheet finalized! Ready to generate quotation.' 
      : 'Costing sheet saved as draft.');
  };

  const exportToExcel = () => {
    // In production, this would generate actual Excel file
    const data = {
      sheet: activeCostingSheet,
      items,
      totals: calculateTotals()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Costing_${activeCostingSheet?.rfqNumber || 'NEW'}_Rev${activeCostingSheet?.revision || 1}.json`;
    a.click();
  };

  const generateQuotation = () => {
    if (!activeCostingSheet || activeCostingSheet.status !== 'finalized') {
      alert('Please finalize the costing sheet before generating a quotation.');
      return;
    }
    
    // Navigate to quotation page with costing data
    window.location.href = `/quotations?costingId=${activeCostingSheet.id}`;
  };

  const { totalCost, totalSelling, profitMargin } = calculateTotals();

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
            Costing Sheet Module
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            Calculate costs with margins, markups, and currency conversion
          </p>
        </motion.div>

        {/* Quick Stats */}
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
            <DollarSign className="w-5 h-5" style={{ color: '#3b82f6', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              ${totalCost.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Cost</div>
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
            <TrendingUp className="w-5 h-5" style={{ color: '#10b981', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              ${totalSelling.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Selling Price</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <Package className="w-5 h-5" style={{ color: '#8b5cf6', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {profitMargin.toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Profit Margin</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <FileSpreadsheet className="w-5 h-5" style={{ color: '#f59e0b', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              {items.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Line Items</div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addItem}
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
            <Calculator className="w-4 h-4" />
            Add Item
          </motion.button>

          <button
            onClick={() => saveCostingSheet('draft')}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <button
            onClick={() => saveCostingSheet('finalized')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
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
            <Send className="w-4 h-4" />
            Finalize Costing
          </button>

          <button
            onClick={exportToExcel}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>

          {activeCostingSheet?.status === 'finalized' && (
            <button
              onClick={generateQuotation}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
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
              Generate Quotation →
            </button>
          )}
        </div>

        {/* Costing Items Table */}
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
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
              Costing Line Items
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Unit Cost</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Currency</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Margin %</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Markup %</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>Total Cost</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>Selling Price</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    <td style={{ padding: '12px' }}>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Product description"
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                        style={{
                          width: '60px',
                          padding: '6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => updateItem(item.id, { unitCost: Number(e.target.value) })}
                        style={{
                          width: '80px',
                          padding: '6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={item.currency}
                        onChange={(e) => updateItem(item.id, { 
                          currency: e.target.value as any,
                          exchangeRate: exchangeRates[e.target.value as keyof typeof exchangeRates]
                        })}
                        style={{
                          padding: '6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="AED">AED</option>
                        <option value="QAR">QAR</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="number"
                        value={item.margin}
                        onChange={(e) => updateItem(item.id, { margin: Number(e.target.value) })}
                        style={{
                          width: '60px',
                          padding: '6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="number"
                        value={item.markup}
                        onChange={(e) => updateItem(item.id, { markup: Number(e.target.value) })}
                        style={{
                          width: '60px',
                          padding: '6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                      ${item.totalCost.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: '#10b981' }}>
                      ${item.sellingPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '4px 8px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              {items.length > 0 && (
                <tfoot>
                  <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f8fafc' }}>
                    <td colSpan={6} style={{ padding: '16px', fontWeight: '600' }}>
                      TOTALS
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', fontSize: '16px' }}>
                      ${totalCost.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', fontSize: '16px', color: '#10b981' }}>
                      ${totalSelling.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
            
            {items.length === 0 && (
              <div style={{
                padding: '60px',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <Calculator className="w-12 h-12" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>No items added yet. Click "Add Item" to start building your costing sheet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '20px',
            padding: '16px',
            background: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}
        >
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1e40af' }}>
            📊 Costing Workflow
          </h4>
          <ol style={{ fontSize: '13px', color: '#64748b', marginLeft: '20px', lineHeight: '1.6' }}>
            <li>Add line items with product descriptions and quantities</li>
            <li>Enter unit costs and select appropriate currency</li>
            <li>Adjust margins and markups based on business requirements</li>
            <li>Save as draft for later or finalize when ready</li>
            <li>Export to Excel for revision tracking (Rev 1, 2, 3...)</li>
            <li>Once finalized, generate quotation with company branding</li>
          </ol>
        </motion.div>
      </div>
    </MainLayout>
  );
}