// frontend/src/App.tsx
import React from 'react';
import AppRouter from './Router';

/**
 * نکته فنی:
 * ما AuthProvider را از اینجا حذف کردیم و به فایل main.tsx منتقل کردیم.
 * این کار باعث می‌شود که کل درخت کامپوننت‌ها (بشمول Router و تمام صفحات) 
 * به درستی به Context دسترسی داشته باشند و از خطاهای تکراری جلوگیری شود.
 */

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* 
          AppRouter شامل تمام مسیرهای پروژه (Home, Shop, Payment, History و غیره) است.
          از آنجایی که AuthProvider در main.tsx قرار دارد، 
          تمام Routeهای محافظت شده (Protected Routes) درون Router به درستی کار می‌کنند.
      */}
      <AppRouter />
    </div>
  );
};

export default App;
