// frontend/src/Router.tsx
import React from 'react';
// استفاده از HashRouter برای سازگاری با GitHub Pages
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages & Components
import Home from './pages/Home';
import Shop from './pages/Shop';
import TasksPage from './pages/Engagement/TasksPage';
import SignIn from './components/SignIn'; 
import Payment from './components/Payment'; 
import History from './components/History'; 
import Success from './components/Success'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute با قابلیت جلوگیری از کرش (Error Handling)
 * اگر Context لود نشده باشد، به جای صفحه سفید، لودینگ نشان می‌دهد.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();

  // ۱. جلوگیری از کرش اگر useAuth مقدار undefined برگرداند (بسیار مهم)
  if (!auth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>در حال برقراری ارتباط با سرور...</p>
      </div>
    );
  }

  const { isAuthenticated, loading } = auth;

  // ۲. نمایش وضعیت بارگذاری
  if (loading) {
    return (
      <div className="loading-screen" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem' 
      }}>
        در حال بارگذاری...
      </div>
    );
  }

  // ۳. بررسی احراز هویت
  if (!isAuthenticated) {
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
        <Route path="/login" element={<SignIn />} />

        {/* بخش‌های محافظت شده با استفاده از ProtectedRoute */}
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment /> 
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />

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

        {/* مسیر پیش‌فرض: اگر آدرس اشتباه بود، به صفحه اصلی برگردان */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
