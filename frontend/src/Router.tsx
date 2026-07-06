import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// اصلاح شد: استفاده از مسیر درست Hook مطابق با ساختار پروژه
import { useAuth } from './hooks/useAuth'; 

// صفحات و کامپوننت‌ها
import Home from './pages/Home';
import SignIn from './components/SignIn';
import Shop from './pages/Shop';
// اصلاح نام فایل طبق ساختار فایل‌های شما در پوشه pages/Engagement
import EngagementTasksPage from './pages/Engagement/TasksPage';

const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    fontFamily: 'sans-serif',
    backgroundColor: '#f9f9f9' 
  }}>
    <div className="spinner" style={{ 
      border: '4px solid #f3f3f3', 
      borderTop: '4px solid #3498db', 
      borderRadius: '50%', 
      width: '40px', 
      height: '40px', 
      animation: 'spin 2s linear infinite' 
    }}></div>
    <p style={{ marginTop: '20px', color: '#555' }}>Authenticating...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRouter = () => {
  // دریافت وضعیت‌ها از Hook اختصاصی پروژه
  const { user, loading, isLoggingIn } = useAuth();

  // نمایش صفحه Loading در هنگام بررسی توکن یا در حال ورود
  if (loading || isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* مسیرهای عمومی */}
        <Route path="/" element={<Home />} />
        
        {/* مسیر لاگین - اگر کاربر لاگین کرده باشد به Shop هدایت می‌شود */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/shop" replace /> : <SignIn />} 
        />

        {/* مسیرهای محافظت شده - فقط برای کاربران لاگین شده */}
        <Route 
          path="/tasks" 
          element={user ? <EngagementTasksPage /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/shop" 
          element={user ? <Shop /> : <Navigate to="/login" replace />} 
        />

        {/* مدیریت خطای 404 */}
        <Route path="*" element={<div style={{padding: '20px'}}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
