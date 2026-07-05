// frontend/src/lib/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

/**
 * افزودن JWT به همه درخواست‌ها
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('user_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * مدیریت پاسخ و خطا
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        (error.response.data as any)?.message ||
        error.response.statusText ||
        'Unknown error';

      switch (status) {
        case 401:
          console.error('Unauthorized:', message);
          break;
        case 403:
          console.error('Forbidden:', message);
          break;
        case 404:
          console.error('Not Found:', message);
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error(`API Error ${status}:`, message);
      }
    } else if (error.request) {
      console.error('No response received from server.');
    } else {
      console.error('Axios error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
