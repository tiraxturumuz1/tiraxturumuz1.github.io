// frontend/src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import TasksPage from './pages/Engagement/TasksPage';

// وارد کردن کامپوننت SignIn که ساخته شده است
// اگر فایل شما در components/SignIn.tsx است، این خط درست است
import SignIn from './components/SignIn'; 

// کامپوننت محافظ برای مسیرهای خصوصی (Private Routes)
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">در حال بارگذاری...</div>;
  }

  if (!isAuthenticated) {
    // کاربر لاگین نکرده، به صفحه ورود هدایت می‌شود
    return <Navigate to="/login" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* مسیرهای عمومی */}
        <Route path="/" element={<Home />} />
        
        {/* مسیر ورود - حالا از کامپوننت واقعی استفاده می‌کند */}
        <Route path="/login" element={<SignIn />} />

        {/* مسیرهای محافظت شده (فقط برای کاربران لاگین شده) */}
        <Route 
          path="/shop" 
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } 
        />

        {/* مدیریت مسیرهای اشتباه: هدایت به صفحه اصلی */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
