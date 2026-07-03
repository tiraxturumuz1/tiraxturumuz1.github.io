import React, { useState } from 'react';
import Payment from './Payment';
import History from './History';
import Success from './Success'; // وارد کردن صفحه جدید

function App() {
  // وضعیت‌ها: 'payment', 'history', 'success'
  const [view, setView] = useState('payment');
  const [lastTransactionId, setLastTransactionId] = useState('');

  const appStyle = {
    fontFamily: 'Tahoma, sans-serif',
    direction: 'rtl',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    margin: 0
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const buttonStyle = (currentView) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: view === currentView ? '#4A90E2' : '#e0e0e0',
    color: view === currentView ? '#fff' : '#333',
    fontWeight: 'bold'
  });

  // تابعی که وقتی پرداخت موفق بود صدا زده می‌شود
  const handlePaymentSuccess = (txId) => {
    setLastTransactionId(txId);
    setView('success'); // تغییر صفحه به موفقیت
  };

  // تابعی که وقتی کاربر روی دکمه "بازگشت" در صفحه موفقیت کلیک می‌کند
  const handleReset = () => {
    setView('payment'); // بازگشت به پرداخت
  };

  return (
    <div style={appStyle}>
      <nav style={navStyle}>
        <button style={buttonStyle('payment')} onClick={() => setView('payment')}>🛒 پرداخت</button>
        <button style={buttonStyle('history')} onClick={() => setView('history')}>📜 تاریخچه</button>
      </nav>

      <main style={{ padding: '0 20px' }}>
        {/* مدیریت نمایش صفحات بر اساس وضعیت view */}
        {view === 'payment' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Payment onPaymentSuccess={handlePaymentSuccess} />
          </div>
        )}

        {view === 'history' && <History />}

        {view === 'success' && (
          <Success 
            transactionId={lastTransactionId} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
