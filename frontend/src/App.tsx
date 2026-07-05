// src/App.tsx
import React from 'react';
import AppRouter from './Router';

function App() {
  // تمام منطق مدیریت صفحات (Navigation) باید داخل Router.tsx باشد.
  // این فایل نباید هیچ استایلی داشته باشد یا دکمه‌ای رندر کند.
  return <AppRouter />;
}

export default App;
