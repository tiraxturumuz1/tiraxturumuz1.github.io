import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // استفاده از Context

// صفحات و کامپوننت‌ها
import Home from './pages/Home';
import SignIn from './components/SignIn';
import Shop from './pages/Shop';
import EngagementTasksPage from './pages/Engagement/TasksPage';

const LoadingScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
    <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }}></div>
    <p style={{ marginTop: '20px', color: '#555' }}>Authenticating...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRouter = () => {
  // دریافت تمام وضعیت‌ها از AuthContext (تنها منبع حقیقت)
  const { user, loading, isLoggingIn } = useAuth();

  // اگر در حال چک کردن اولیه هستیم یا کاربر در حال لاگین است
  // نمایش صفحه Loading برای جلوگیری از پرش (flicker) و نمایش صفحات اشتباه
  if (loading || isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* مسیرهای عمومی */}
        <Route path="/" element={<Home />} />
        
        {/* اگر کاربر لاگین بود، به جای صفحه لاگین، به shop برود */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/shop" replace /> : <SignIn />} 
        />

        {/* مسیرهای محافظت شده */}
        <Route 
          path="/tasks" 
          element={user ? <EngagementTasksPage /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/shop" 
          element={user ? <Shop /> : <Navigate to="/login" replace />} 
        />

        {/* مدیریت 404 */}
        <Route path="*" element={<div style={{padding: '20px'}}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
