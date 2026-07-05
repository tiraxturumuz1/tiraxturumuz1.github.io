import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #673ab7 0%, #311b92 100%)', // رنگ بنفش Pi
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Tahoma, sans-serif',
    direction: 'rtl'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    maxWidth: '500px',
    width: '100%'
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '30px'
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#673ab7',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    borderRadius: '12px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>π</div>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Welcome to Pi DAO</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: '1.6' }}>
          مرکز مدیریت هوشمند و غیرمتمرکز تراکنش‌های شما در شبکه پای
        </p>
        
        <div style={buttonContainerStyle}>
          <button 
            style={primaryButtonStyle} 
            onClick={() => navigate('/shop')}
          >
            🛒 فروشگاه Pi
          </button>
          <button 
            style={secondaryButtonStyle} 
            onClick={() => navigate('/tasks')}
          >
            🎯 ماموریت‌ها و پاداش‌ها
          </button>
        </div>

        <div style={{ marginTop: '40px', fontSize: '14px', opacity: 0.6 }}>
          Powered by Pi Network Ecosystem
        </div>
      </div>
    </div>
  );
};

export default Home;
