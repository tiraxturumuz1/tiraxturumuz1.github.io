// frontend/src/App.tsx
import React from 'react';
import AppRouter from './Router';
import { AuthProvider } from './context/AuthContext';

// وارد کردن کامپوننت‌هایی که از فایل App.jsx قبلی داشتید
// نکته: اگر این‌ها در پوشه components هستند، مسیر را اصلاح کنید
import Payment from './components/Payment'; 
import History from './components/History';
import Success from './components/Success';

const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* 
          نکته استراتژیک: 
          در پروژه‌های بزرگ، منطق Payment و History نباید در App.tsx باشد.
          آن‌ها باید در Router.tsx به عنوان صفحات (Pages) تعریف شوند.
          اما فعلاً برای اینکه کد شما به هم نریزد، من ساختار را حفظ می‌کنم.
      */}
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
