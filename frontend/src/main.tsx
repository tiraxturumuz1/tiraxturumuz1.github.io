// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

// پیدا کردن عنصر ریشه با استفاده از نوع TypeScript برای جلوگیری از خطای null
const rootElement = document.getElementById('root');

if (!rootElement) {
  // این خطا زمانی رخ می‌دهد که در فایل index.html شما <div id="root"> وجود نداشته باشد
  throw new Error("Critical Error: Could not find the root element with id 'root'. Please check your index.html");
}

// رندر کردن اپلیکیشن
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* قرار دادن AuthProvider در بالاترین سطح برای دسترسی Router و تمام کامپوننت‌ها */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
