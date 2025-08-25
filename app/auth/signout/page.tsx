// ⛳ code-map: auth-signout (docs/code-map/auth.md#signout)
// 🧬 bio-signal: [stable]
// 🌊 energy-cost: [low]
// 🌲 network-role: [guardian]
// 🎓 learning-level: [beginner]
// 🔄 evolution-stage: [mature]
// 🔐 authentication: Custom signout page for Microsoft Azure AD
// last-sweep: Authentication-Integration-Sprint-001

'use client';

export default function SignOutPage() {
  const handleSignOut = () => {
    // Redirect to NextAuth.js signout endpoint
    window.location.href = '/api/auth/signout';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#eff6ff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        maxWidth: '28rem',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          backgroundColor: '#dbeafe',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '0.5rem'
        }}>
          Sign Out
        </h1>
        
        <p style={{
          color: '#4b5563',
          marginBottom: '1.5rem'
        }}>
          Are you sure you want to sign out of PrismFlow?
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleSignOut}
            style={{
              flex: 1,
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#ef4444'}
          >
            Sign Out
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              flex: 1,
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#6b7280'}
          >
            Cancel
          </button>
        </div>
        
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '1rem'
        }}>
          🔐 Secured by Microsoft Azure AD
        </p>
      </div>
    </div>
  );
}
