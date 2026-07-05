// frontend/src/hooks/useAuth.ts
import { useState } from 'react';
import axios from 'axios';
// فرض بر این است که Pi SDK را در جای دیگری بارگذاری کرده‌اید
import { getPiUser } from '../lib/pi-sdk-wrapper'; // یا هر متدی که برای گرفتن اطلاعات دارید

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithPi = async () => {
    setLoading(true);
    setError(null);
    try {
      // ۱. گرفتن اطلاعات کاربر از Pi SDK
      const piUser = await getPiUser(); 

      // ۲. ارسال شناسه کاربر به بک‌اند جدید
      const response = await axios.post('/api/auth/pi-login', {
        pi_user_id: piUser.uid,
        username: piUser.username
      });

      // ۳. ذخیره توکن در LocalStorage برای استفاده‌های بعدی
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // اینجا می‌توانید کاربر را به صفحه اصلی هدایت کنید
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError('خطا در احراز هویت با شبکه Pi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loginWithPi, loading, error };
};
