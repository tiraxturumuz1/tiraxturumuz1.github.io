import React from 'react';
import { useAuth } from '../context/AuthContext';

const SignIn: React.FC = () => {
  const { loginWithPi, isLoggingIn } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>π</div>
        <h2 style={{ margin: '0 0 8px', color: '#2d2d2d' }}>Sign in with Pi</h2>
        <p style={{ margin: '0 0 20px', color: '#666', lineHeight: 1.6 }}>
          Connect your Pi account to continue to the dashboard.
        </p>
        <button
          onClick={() => loginWithPi().catch(() => undefined)}
          disabled={isLoggingIn}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '10px',
            background: '#673ab7',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            opacity: isLoggingIn ? 0.8 : 1,
          }}
        >
          {isLoggingIn ? 'Signing in...' : 'Continue with Pi'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
