// frontend/src/App.tsx
import React from 'react';
import AppRouter from './Router';

function App() {
  // توجه: تمام مدیریت صفحات و لاگین باید در Router.tsx انجام شود
  return <AppRouter />;
}

export default App;
