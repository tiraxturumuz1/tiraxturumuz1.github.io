import React, { useState } from 'react';
import Payment from './Payment'; // صفحه پرداخت که قبلاً داشتیم
import History from './History'; // صفحه جدیدی که در مرحله قبل ساختیم

function App() {
  // وضعیت view تعیین می‌کند که در حال حاضر کدام کامپوننت باید نمایش داده شود
  // 'payment' یعنی صفحه پرداخت
  // 'history' یعنی صفحه تاریخچه
  const [view, setView] = useState('payment');

  // استایل‌های کلی برای بدنه اصلی برنامه
  const appStyle = {
    fontFamily: 'Tahoma, Arial, sans-serif',
    direction: 'rtl', // راست‌چین کردن برای زبان فارسی
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    margin: 0,
    padding: 0
  };

  // استایل منوی بالای سایت (Navigation)
  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  // استایل دکمه‌های منو
  const buttonStyle = (currentView) => ({
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: view === currentView ? '#4A90E2' : '#e0e0e0',
    color: view === currentView ? '#fff' : '#333',
    transition: 'all 0.3s ease',
    fontWeight: 'bold'
  });

  return (
    <div style={appStyle}>
      {/* بخش منوی ناوبری */}
      <nav style={navStyle}>
        <button 
          style={buttonStyle('payment')} 
          onClick={() => setView('payment')}
        >
          🛒 پرداخت جدید
        </button>
        
        <button 
          style={buttonStyle('history')} 
          onClick={() => setView('history')}
        >
          📜 تاریخچه تراکنش‌ها
        </button>
      </nav>

      {/* بخش نمایش محتوای اصلی */}
      <main style={{ padding: '0 20px' }}>
        {view === 'payment' ? (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Payment />
          </div>
        ) : (
          <History />
        )}
      </main>

      {/* فوتر ساده */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '50px', 
        fontSize: '12px', 
        color: '#888' 
      }}>
        © 2026 PiDao Project - تمام حقوق محفوظ است
      </footer>
    </div>
  );
}

export default App;
