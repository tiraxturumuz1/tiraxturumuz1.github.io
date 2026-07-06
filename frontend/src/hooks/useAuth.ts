// frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
// اصلاح شد: استفاده از axiosClient برای هماهنگی با Interceptorها
import axiosClient from '../lib/axiosClient'; 
import { getPiUser } from '../lib/pi-sdk-wrapper'; 

interface User {
  uid: string;
  username: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkInitialAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // اصلاح شد: استفاده از axiosClient.get به جای axios.get
        // چون axiosClient خودش توکن را از localStorage برمی‌دارد و به هدر اضافه می‌کند
        const response = await axiosClient.get('/auth/me'); 
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (err: any) {
      console.error('Initial auth check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // در اینجا خطا را ست نمی‌کنیم تا کاربر در صفحه اصلی بماند، فقط لاگین را پاک می‌کنیم
    } finally {
      setLoading(false);
    }
  };

  const loginWithPi = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const piUser = await getPiUser(); 
      if (!piUser || !piUser.uid) {
        throw new Error("Unable to get Pi user information.");
      }

      // اصلاح شد: استفاده از axiosClient برای ارسال درخواست لاگین
      const response = await axiosClient.post('/auth/pi-login', {
        pi_user_id: piUser.uid,
        username: piUser.username
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // ذخیره کاربر برای استفاده در سایر جاها
        setUser(response.data.user);
      } else {
        throw new Error("Login failed: No token received.");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'خطا در احراز هویت با شبکه Pi';
      setError(errorMsg);
      console.error('Login error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setIsLoggingIn(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // با توجه به استفاده از HashRouter، هدایت بهتر است اینگونه باشد:
    window.location.hash = '/login';
  };

  return { user, loading, isLoggingIn, error, loginWithPi, logout, checkInitialAuth };
};
