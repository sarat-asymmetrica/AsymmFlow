'use client';

export default function SimpleDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Dashboard</h1>
      <p>Natural Asymmetry Dashboard Test</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Stats</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Orders</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>42</p>
          </div>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Revenue</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$125,000</p>
          </div>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Customers</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>156</p>
          </div>
        </div>
      </div>
    </div>
  );
}