// frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react'; // useEffect را اضافه کنید
import axios from 'axios';
// فرض بر این است که Pi SDK را در جای دیگری بارگذاری کرده‌اید
// همچنین باید یک راه برای دریافت اولیه کاربر (مثلاً از localStorage) داشته باشید
import { getPiUser } from '../lib/pi-sdk-wrapper'; // یا هر متدی که برای گرفتن اطلاعات دارید

// یک نوع برای کاربر تعریف کنید (می‌تواند ساده‌تر باشد)
interface User {
  uid: string;
  username: string;
  // ... سایر اطلاعات کاربر
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // state برای کاربر اضافه شد
  const [loading, setLoading] = useState(true); // شروع با loading: true برای بررسی اولیه
  const [isLoggingIn, setIsLoggingIn] = useState(false); // state برای وضعیت لاگین در حال انجام
  const [error, setError] = useState<string | null>(null);

  // تابع برای بررسی اولیه کاربر (مثلاً از توکن ذخیره شده)
  const checkInitialAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // اینجا باید با بک‌اند چک کنید که آیا توکن معتبر است یا نه
        // و اطلاعات کاربر را دریافت کنید.
        // مثال:
        const response = await axios.get('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          // توکن منقضی شده یا نامعتبر است
          localStorage.removeItem('token');
        }
      }
    } catch (err: any) {
      setError('خطا در بررسی وضعیت احراز هویت');
      console.error(err);
      localStorage.removeItem('token'); // حذف توکن در صورت خطا
    } finally {
      setLoading(false);
    }
  };

  const loginWithPi = async () => {
    setIsLoggingIn(true); // شروع فرایند لاگین
    setError(null);
    try {
      // ۱. گرفتن اطلاعات کاربر از Pi SDK
      // اطمینان حاصل کنید که getPiUser() به درستی کار می‌کند و یک شیء با uid و username برمی‌گرداند
      const piUser = await getPiUser(); 
      if (!piUser || !piUser.uid) {
        throw new Error("Unable to get Pi user information.");
      }

      // ۲. ارسال شناسه کاربر به بک‌اند جدید
      const response = await axios.post('/api/auth/pi-login', {
        pi_user_id: piUser.uid,
        username: piUser.username // اطمینان حاصل کنید که piUser.username موجود است
      });

      // ۳. ذخیره توکن در LocalStorage و به‌روزرسانی state کاربر
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user); // ذخیره اطلاعات کاربر در state
        // دیگر نیازی به تغییر window.location.href نیست، Router خودش هدایت می‌کند
      } else {
        throw new Error("Login failed: No token received.");
      }
    } catch (err: any) {
      setError('خطا در احراز هویت با شبکه Pi');
      console.error('Login error:', err);
      // اگر خطایی رخ داد، توکن قبلی را پاک کنید
      localStorage.removeItem('token');
      setUser(null); // پاک کردن اطلاعات کاربر در صورت خطا
    } finally {
      setIsLoggingIn(false); // پایان فرایند لاگین
      setLoading(false); // در اینجا هم loading را false می‌کنیم چون بررسی اولیه تمام شده
    }
  };

  // اثر برای اجرای بررسی اولیه هنگام بارگذاری کامپوننت
  useEffect(() => {
    checkInitialAuth();
  }, []);

  // تابع logout (اختیاری اما مفید)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // شاید نیاز باشد به صفحه لاگین هدایت شوید
    window.location.href = '/login';
  };

  return { user, loading, isLoggingIn, error, loginWithPi, logout, checkInitialAuth }; // user و logout را اضافه کردیم
};
