// frontend/src/Router.tsx
import React from 'react';
// تغییر BrowserRouter به HashRouter برای سازگاری کامل با GitHub Pages
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

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // اصلاح یک غلط املایی کوچک در متن بارگذاری
    return <div className="loading-screen">در حال بارگذاری...</div>;
  }

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

        {/* بخش پرداخت و تاریخچه - محافظت شده */}
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

        {/* سایر مسیرهای محافظت شده */}
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />

        {/* مسیر پیش‌فرض در صورت نبود مسیر صحیح */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
