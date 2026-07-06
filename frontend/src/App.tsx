// frontend/src/App.tsx
import React from 'react';
import AppRouter from './Router';

const App: React.FC = () => {
  return (
    // اینجا دیگر نیاز به AuthProvider نیست چون در main.tsx قرار داده شده است
    <AppRouter />
  );
};

export default App;
