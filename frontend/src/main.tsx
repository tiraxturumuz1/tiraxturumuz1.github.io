import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// وارد کردن AuthProvider برای پوشش دادن کل اپلیکیشن با احراز هویت
import { AuthProvider } from './context/AuthContext'; 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 
        AuthProvider را اینجا قرار می‌دهیم تا تمام کامپوننت‌های داخل App 
        به هوک useAuth دسترسی داشته باشند 
    */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
