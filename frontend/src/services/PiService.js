// frontend/src/services/PiService.js
import axiosClient from '../lib/axiosClient';

/**
 * سرویس پرداخت Pi
 * تمام ارتباطات از طریق backend انجام می‌شود.
 * هیچ کلید حساسی در این فایل وجود ندارد.
 */
const PiService = {
  /**
   * ایجاد پرداخت
   * payload مثال:
   * { amount: 5, memo: 'PiDao payment', metadata: {...} }
   */
  createPayment: async (payload) => {
    const response = await axiosClient.post('/payment/create', payload);
    return response.data;
  },

  /**
   * تایید پرداخت توسط backend
   */
  approvePaymentOnBackend: async (paymentId) => {
    const response = await axiosClient.post('/payment/approve', {
      paymentId,
    });
    return response.data;
  },

  /**
   * تکمیل پرداخت توسط backend
   */
  completePaymentOnBackend: async (payload) => {
    const response = await axiosClient.post('/payment/complete', payload);
    return response.data;
  },

  /**
   * گرفتن وضعیت پرداخت
   */
  getPaymentStatus: async (paymentId) => {
    const response = await axiosClient.get(`/payment/status/${paymentId}`);
    return response.data;
  },

  /**
   * گرفتن تراکنش‌های ادمین
   * این route باید در backend با JWT محافظت شود
   */
  getAdminTransactions: async () => {
    const response = await axiosClient.get('/admin/transactions');
    return response.data;
  },
};

export default PiService;
