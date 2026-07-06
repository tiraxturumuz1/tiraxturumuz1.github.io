import axiosClient from '../lib/axiosClient';

const PiService = {
  // ایجاد درخواست اولیه پرداخت در بک‌اِند
  createPayment: async (payload) => {
    try {
      const response = await axiosClient.post('/payment/create', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // تایید پرداخت توسط سرور (بعد از مرحله Pi SDK)
  approvePayment: async (paymentId) => {
    try {
      const response = await axiosClient.post('/payment/approve', { paymentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // تکمیل نهایی تراکنش
  completePayment: async (payload) => {
    try {
      const response = await axiosClient.post('/payment/complete', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // چک کردن وضعیت پرداخت
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await axiosClient.get(`/payment/status/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // دریافت لیست تراکنش‌ها (فقط برای ادمین)
  getAdminTransactions: async () => {
    try {
      const response = await axiosClient.get('/admin/transactions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default PiService;
