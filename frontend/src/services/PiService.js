import axiosClient from '../lib/axiosClient';

const PiService = {
  createPayment: async (payload) => {
    const response = await axiosClient.post('/payment/create', payload);
    return response.data;
  },

  approvePayment: async (paymentId) => {
    const response = await axiosClient.post('/payment/approve', { paymentId });
    return response.data;
  },

  completePayment: async (payload) => {
    const response = await axiosClient.post('/payment/complete', payload);
    return response.data;
  },

  getPaymentStatus: async (paymentId) => {
    const response = await axiosClient.get(`/payment/status/${paymentId}`);
    return response.data;
  },

  getAdminTransactions: async () => {
    const response = await axiosClient.get('/admin/transactions');
    return response.data;
  }
};

export default PiService;
