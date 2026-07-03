import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
// فرض بر این است که تایپ‌ها و کامپوننت‌های دیگر را از فایل‌های اصلی خودتان وارد می‌کنید
import { User } from '../types/user'; 
import SignIn from '../components/SignIn';
import Shop from '../pages/Shop';
import EngagementTasksPage from '../pages/EngagementTasksPage';

// این کامپوننت جایگزین حالت لودینگ فعلی شما می‌شود
const LoadingScreen = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Authenticating...</p> 
  </div>
);

const AppRouter = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      // ایجاد یک تایمر برای جلوگیری از گیر کردن ابدی (Timeout)
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn("Auth request timed out. Moving out of loading state.");
          setIsLoading(false);
        }
      }, 5000); // اگر بعد از 5 ثانیه خبری نشد، از لودینگ خارج شو

      try {
        console.log("Attempting to fetch user status from:", axiosClient.defaults.baseURL);
        
        const response = await axiosClient.get("/user/me");
        
        if (response.data) {
          setUser(response.data);
          console.log("User authenticated successfully:", response.data);
        }
      } catch (error: any) {
        // اینجا تحلیل خطا برای شما بسیار مهم است
        if (error.response) {
          // سرور پاسخ داده اما کد خطا (مثل 401 یا 404)
          console.error("Server Error:", error.response.status, error.response.data);
        } else if (error.request) {
          // درخواست فرستاده شده اما پاسخی دریافت نشده (احتمالاً مشکل CORS یا آدرس اشتباه)
          console.error("Network Error: No response received. Check CORS or Backend URL.");
        } else {
          console.error("Error setting up request:", error.message);
        }
      } finally {
        // اطمینان از اینکه لودینگ حتماً تمام می‌شود
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* اگر کاربر لاگین بود، به صفحه اصلی/شاپ برود، در غیر این صورت به صفحه ورود */}
        <Route 
          path="/" 
          element={user ? <Shop /> : <SignIn />} 
        />
        
        <Route 
          path="/tasks" 
          element={user ? <EngagementTasksPage /> : <Navigate to="/" />} 
        />

        {/* مسیرهای دیگر را اینجا اضافه کنید */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
