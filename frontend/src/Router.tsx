import React, { useState, useEffect } from 'react';
// استفاده از HashRouter برای حل مشکل 404 در GitHub Pages
// نکته: اگر قرار است روی سرور شخصی (مثل VPS) باشد، می‌توانید از BrowserRouter استفاده کنید
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import { User } from '../types/user'; 
import SignIn from '../components/SignIn';
import Shop from '../pages/Shop';
import EngagementTasksPage from '../pages/EngagementTasksPage';
import Home from '../pages/Home'; // صفحه جدیدی که اضافه کردید

/**
 * کامپوننت نمایش وضعیت لودینگ
 */
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: 'sans-serif' 
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
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AppRouter = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      // ایجاد یک تایمر امنیتی
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn("⚠️ Auth Timeout: Backend is not responding.");
          setIsLoading(false);
        }
      }, 6000);

      try {
        console.log("🔍 Checking user status via:", axiosClient.defaults.baseURL);
        const response = await axiosClient.get("/user/me");
        
        if (response.data) {
          setUser(response.data);
          console.log("✅ User authenticated:", response.data);
        }
      } catch (error: any) {
        if (error.response) {
          console.error("❌ Server Error:", error.response.status, error.response.data);
        } else if (error.request) {
          console.error("❌ Network Error: Check backendURL and CORS.");
        } else {
          console.error("❌ Error:", error.message);
        }
      } finally {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    checkUserStatus();
  }, []);

  // نمایش لودینگ تا زمان اتمام چک کردن وضعیت کاربر
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* 
          ترکیب منطق کد اول و دوم:
          مسیر اصلی حالا صفحه Home است. 
          اگر کاربر لاگین بود به Shop برود، اگر نبود به SignIn (یا همان Login)
        */}
        <Route 
          path="/" 
          element={user ? <Shop /> : <Home />} 
        />

        {/* مسیر لاگین (بر اساس کد دوم شما) */}
        <Route 
          path="/login" 
          element={!user ? <SignIn /> : <Navigate to="/" />} 
        />

        {/* مسیر تسک‌ها: فقط برای کاربران لاگین شده */}
        <Route 
          path="/tasks" 
          element={user ? <EngagementTasksPage /> : <Navigate to="/login" />} 
        />

        {/* مسیر صفحات دیگر را اینجا اضافه کنید */}
        {/* <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} /> */}

        {/* مسیر 404 - نمایش پیام خطا در صورت نبودن مسیر (بر اساس کد دوم شما) */}
        <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
