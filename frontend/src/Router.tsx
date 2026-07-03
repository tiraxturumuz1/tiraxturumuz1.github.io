import React, { useState, useEffect } from 'react';
// استفاده از HashRouter برای حل مشکل 404 در GitHub Pages
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import { User } from '../types/user'; 
import SignIn from '../components/SignIn';
import Shop from '../pages/Shop';
import EngagementTasksPage from '../pages/EngagementTasksPage';

/**
 * کامپوننت نمایش وضعیت لودینگ
 * اگر فرآیند احراز هویت بیش از حد طول بکشد، کاربر این را می‌بیند
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
      // ۱. ایجاد یک تایمر امنیتی (Fail-safe)
      // اگر بعد از ۶ ثانیه پاسخی از بک‌اند نیامد، لودینگ را قطع کن تا کاربر بتواند دکمه ورود را ببیند
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn("⚠️ Auth Timeout: Backend is not responding. Breaking out of loading state.");
          setIsLoading(false);
        }
      }, 6000);

      try {
        console.log("🔍 Checking user status via:", axiosClient.defaults.baseURL);
        
        // تلاش برای گرفتن اطلاعات کاربر از بک‌اند
        const response = await axiosClient.get("/user/me");
        
        if (response.data) {
          setUser(response.data);
          console.log("✅ User authenticated:", response.data);
        }
      } catch (error: any) {
        // تحلیل خطا در کنسول برای عیب‌یابی سریع
        if (error.response) {
          // سرور پاسخ داده (مثلاً خطای 401 یعنی کاربر لاگین نیست)
          console.error("❌ Server Error:", error.response.status, error.response.data);
        } else if (error.request) {
          // درخواست ارسال شده اما پاسخی دریافت نشده (مشکل CORS یا آدرس اشتباه بک‌اند)
          console.error("❌ Network Error: No response from backend. Check your backendURL in index.html and CORS settings.");
        } else {
          // خطای دیگر
          console.error("❌ Error:", error.message);
        }
      } finally {
        // ۲. در هر صورت (موفقیت یا خطا) لودینگ را تمام کن
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    checkUserStatus();
  }, []); // آرایه خالی یعنی فقط یک بار هنگام لود شدن اپلیکیشن اجرا شود

  // اگر در حالت لودینگ بودیم، صفحه انتظار را نشان بده
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* مسیر اصلی: اگر کاربر لاگین بود به Shop، در غیر این صورت به SignIn */}
        <Route 
          path="/" 
          element={user ? <Shop /> : <SignIn />} 
        />
        
        {/* مسیر تسک‌ها: فقط برای کاربران لاگین شده */}
        <Route 
          path="/tasks" 
          element={user ? <EngagementTasksPage /> : <Navigate to="/" />} 
        />

        {/* مسیر پیش‌فرض: هدایت به روت اصلی */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
