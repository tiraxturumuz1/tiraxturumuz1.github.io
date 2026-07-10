// src/App.tsx
import React from 'react';
import AppRouter from './Router';
import { AuthProvider } from './context/AuthContext';

function App() {
  // تمام منطق مدیریت صفحات (Navigation) باید داخل Router.tsx باشد.
  // این فایل نباید هیچ استایلی داشته باشد یا دکمه‌ای رندر کند.
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
