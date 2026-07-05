import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../lib/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // برای بارگذاری اولیه اپلیکیشن
  const [isLoggingIn, setIsLoggingIn] = useState(false); // برای وضعیت حین عملیات لاگین

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // تایید توکن با سرور
          const response = await axiosClient.get("/user/me");
          if (response.data) {
            setUser(response.data);
          } else {
            // اگر توکن بود ولی سرور کاربر را نشناخت، پاک کن
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error("Initial auth check failed:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginWithPi = async () => {
    setIsLoggingIn(true); // شروع عملیات
    try {
      const response = await axiosClient.post('/auth/pi-login');
      const { user: userData, token } = response.data;

      // ذخیره در localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // آپدیت State اصلی
      setUser(userData);
      return response.data;
    } catch (error) {
      console.error("Pi Login Error:", error);
      throw error;
    } finally {
      setIsLoggingIn(false); // پایان عملیات (چه موفق چه خطا)
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isLoggingIn, 
      loginWithPi, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
