import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // استایل‌های مدرن و هماهنگ با هویت Pi
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #673ab7 0%, #311b92 100%)',
      color: '#fff',
      textAlign: 'center' as const,
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      direction: 'rtl' as const
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      padding: '40px',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      maxWidth: '450px',
      width: '100%'
    },
    title: { fontSize: '2rem', marginBottom: '10px' },
    subtitle: { fontSize: '1rem', opacity: 0.8, marginBottom: '30px' },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    button: {
      padding: '14px',
      fontSize: '16px',
      fontWeight: 'bold' as const,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s, background 0.2s'
    },
    primaryBtn: {
      backgroundColor: '#fff',
      color: '#673ab7'
    },
    secondaryBtn: {
      backgroundColor: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: '#fff'
    },
    footer: {
      marginTop: '40px',
      fontSize: '12px',
      opacity: 0.5
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>π</div>
        <h1 style={styles.title}>Welcome to Pi DAO</h1>
        <p style={styles.subtitle}>
          درگاه اختصاصی شما برای خدمات غیرمتمرکز در شبکه پای
        </p>

        <div style={styles.buttonGroup}>
          <button style={{...styles.button, ...styles.primaryBtn}} onClick={() => navigate('/shop')}>
            🛒 فروشگاه و محصولات
          </button>
          <button style={{...styles.button, ...styles.secondaryBtn}} onClick={() => navigate('/tasks')}>
            🎯 ماموریت‌ها و پاداش‌ها
          </button>
          <button style={{...styles.button, ...styles.secondaryBtn}} onClick={() => navigate('/signin')}>
            🔐 ورود با کیف پول Pi
          </button>
        </div>

        <div style={styles.footer}>
          © 2026 Pi Network Developer Project
        </div>
      </div>
    </div>
  );
};

export default Home;
