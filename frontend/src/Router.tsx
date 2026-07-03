import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import { User } from '../types/user';

// صفحات و کامپوننت‌ها
import Home from '../pages/Home';
import SignIn from '../components/SignIn';
import Shop from '../pages/Shop';
import EngagementTasksPage from '../pages/EngagementTasksPage';

const LoadingScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
    <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }}></div>
    <p style={{ marginTop: '20px', color: '#555' }}>Authenticating...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRouter = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const timeoutId = setTimeout(() => setIsLoading(false), 6000);
      try {
        const response = await axiosClient.get("/user/me");
        if (response.data) setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };
    checkUserStatus();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <Router>
      <Routes>
        {/* مسیرهای عمومی */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/shop" /> : <SignIn />} />

        {/* مسیرهای محافظت شده (فقط برای کاربران لاگین شده) */}
        <Route 
          path="/tasks" 
          element={user ? <EngagementTasksPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/shop" 
          element={user ? <Shop /> : <Navigate to="/login" />} 
        />

        {/* مدیریت 404 */}
        <Route path="*" element={<div style={{padding: '20px'}}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
