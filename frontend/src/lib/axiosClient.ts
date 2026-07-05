// frontend/src/lib/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosClient = axios.create({
  // اصلاح پورت به 3000 و استفاده از متغیر محیطی
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor برای درخواست‌ها (Request Interceptor)
 * وظیفه: اضافه کردن توکن به هدر تمام درخواست‌های خروجی
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // هماهنگ با AuthContext که توکن را با کلید 'token' ذخیره می‌کند
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor برای پاسخ‌ها (Response Interceptor)
 * وظیفه: مدیریت خطاهای سرور مثل انقضای توکن (401)
 */
axiosClient.interceptors.response.use(
  (response) => {
    // اگر پاسخ موفقیت‌آمیز بود، آن را برگردان
    return response;
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // اگر توکن منقضی شده یا نامعتبر است (Error 401)
        console.warn('Unauthorized! Redirecting to login...');
        
        // پاکسازی اطلاعات کاربر از حافظه
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // هدایت کاربر به صفحه لاگین (اگر در صفحه لاگین نباشد)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // می‌توانید اینجا خطاهای دیگر مثل 403 یا 500 را هم مدیریت کنید
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
