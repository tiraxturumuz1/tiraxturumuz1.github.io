// frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext' // اضافه شد

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* بسیار مهم: کل اپلیکیشن باید در AuthProvider باشد */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
