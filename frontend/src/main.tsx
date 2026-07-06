// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("ریشه اپلیکیشن (element with id 'root') یافت نشد. لطفاً مطمئن شوید در فایل index.html یک <div id='root'></div> وجود دارد.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* AuthProvider را اینجا قرار می‌دهیم تا کل پروژه به آن دسترسی داشته باشند */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
