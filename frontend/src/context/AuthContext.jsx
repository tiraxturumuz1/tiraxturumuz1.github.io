// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../lib/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * تابع جدید برای لاگین از طریق Pi SDK
   * @param {Object} piUser - اطلاعاتی که از Pi SDK دریافت شده (username, user_id, etc.)
   */
  const loginWithPi = async (piUser) => {
    try {
      // ارسال اطلاعات کاربر به بک‌اِند برای تایید یا ایجاد کاربر جدید
      const response = await axiosClient.post('/auth/pi-login', {
        pi_user_id: piUser.uid,
        username: piUser.username,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در اتصال به شبکه Pi' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithPi, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
