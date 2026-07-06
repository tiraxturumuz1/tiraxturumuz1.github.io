// frontend/src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import TasksPage from './pages/Engagement/TasksPage';
// فرض بر این است که یک صفحه Login دارید، اگر ندارید باید ساخته شود
// import LoginPage from './pages/Login'; 

// کامپوننت محافظ برای مسیرهای خصوصی (Private Routes)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">در حال بارگذاری...</div>;
  }

  if (!isAuthenticated) {
    // به جای صفحه Register، کاربر را به صفحه Login می‌فرستیم
    return <Navigate to="/login" replace />;
  }

  return <React\\Fragment>{children}</React\\.Fragment>;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* مسیرهای عمومی */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div>صفحه ورود با Pi (در حال ساخت)</div>} />

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

        {/* مدیریت مسیرهای اشتباه */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
