import axios from 'axios';

const axiosClient = axios.create({
  // این مقدار معمولاً از متغیر محیطی (Environment Variable) خوانده می‌شود
  // در حالت توسعه (Development) به بک‌اند محلی و در حالت تولید (Production) به API اصلی اشاره می‌کند
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// افزودن اینترسپتور برای مدیریت توکن یا اطلاعات احراز هویت در صورت نیاز
axiosClient.interceptors.request.use(
  (config) => {
    // اینجا می‌توانید منطق اضافه کردن Bearer Token را پیاده‌سازی کنید
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // مدیریت خطاهای مشترک مثل 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Please sign in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
