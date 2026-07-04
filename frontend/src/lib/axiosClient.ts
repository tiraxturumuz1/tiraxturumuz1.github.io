import axios from 'axios';

const axiosClient = axios.create({
  // اصلاح شد: استفاده از نام جدید متغیر محیطی که در .env قرار دادیم
  // اگر در .env تعریف نشده بود، به صورت پیش‌فرض از localhost استفاده می‌کند
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor برای مدیریت درخواست‌های خروجی
 */
axiosClient.interceptors.request.use(
  (config) => {
    // ۱. مدیریت JWT Token (اگر کاربر لاگین کرده باشد)
    const token = localStorage.getItem('user_token'); // فرض بر این است که توکن را در localStorage ذخیره می‌کنید
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ۲. مدیریت Admin Key (برای درخواست‌های مربوط به بخش ادمین)
    // اگر URL شامل عبارت 'admin' بود، کلید ادمین را به صورت خودکار اضافه می‌کند
    if (config.url?.includes('/admin')) {
      const adminKey = localStorage.getItem('admin_secret_key');
      if (adminKey && config.headers) {
        config.headers['x-admin-key'] = adminKey;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor برای مدیریت پاسخ‌های دریافتی از سرور
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // مدیریت خطاهای مشترک
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized! Session expired or invalid. Please sign in again.');
          // اینجا می‌توانید کاربر را به صفحه Login هدایت کنید
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden! You do not have permission to access this resource.');
          break;
        case 500:
          console.error('Server Error! Please try again later.');
          break;
        default:
          console.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Unknown Error'}`);
      }
    } else if (error.request) {
      // اگر درخواست ارسال شده اما پاسخی دریافت نشده (مثلاً مشکل شبکه یا سرور آفلاین است)
      console.error('No response received from server. Check your internet connection or backend status.');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
